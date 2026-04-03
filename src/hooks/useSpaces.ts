import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SpaceData {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  image_url: string | null;
  visibility: 'public' | 'private';
  ai_model: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface SpaceMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: { display_name: string | null; avatar_url: string | null };
}

export interface SpaceDocument {
  id: string;
  name: string;
  type: string;
  size_bytes: number;
  status: string;
  chunk_count: number;
  created_at: string;
  storage_path: string | null;
}

export function useSpaces() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpaces = useCallback(async () => {
    if (!user) { setSpaces([]); setLoading(false); return; }
    
    const { data } = await supabase
      .from('spaces')
      .select('*')
      .order('updated_at', { ascending: false });
    
    setSpaces((data as SpaceData[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchSpaces(); }, [fetchSpaces]);

  const createSpace = async (spaceData: {
    name: string;
    description: string;
    category: string;
    tags: string[];
    visibility: 'public' | 'private';
    ai_model: string;
    image_url?: string;
  }) => {
    if (!user) throw new Error('Not authenticated');
    
    const { data: space, error } = await supabase
      .from('spaces')
      .insert({
        ...spaceData,
        owner_id: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add owner as member
    await supabase.from('space_members').insert({
      space_id: space.id,
      user_id: user.id,
      role: 'owner',
    });
    
    await fetchSpaces();
    return space;
  };

  const joinSpace = async (spaceId: string) => {
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase.from('space_members').insert({
      space_id: spaceId,
      user_id: user.id,
      role: 'member',
    });
    if (error && !error.message.includes('duplicate')) throw error;
    await fetchSpaces();
  };

  const deleteSpace = async (spaceId: string) => {
    const { error } = await supabase.from('spaces').delete().eq('id', spaceId);
    if (error) throw error;
    await fetchSpaces();
  };

  return { spaces, loading, createSpace, joinSpace, deleteSpace, refreshSpaces: fetchSpaces };
}

export function useSpaceDetails(spaceId: string | undefined) {
  const [space, setSpace] = useState<SpaceData | null>(null);
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [documents, setDocuments] = useState<SpaceDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    if (!spaceId) { setLoading(false); return; }
    
    const [spaceRes, membersRes, docsRes] = await Promise.all([
      supabase.from('spaces').select('*').eq('id', spaceId).single(),
      supabase.from('space_members').select('*, profile:profiles(display_name, avatar_url)').eq('space_id', spaceId),
      supabase.from('documents').select('*').eq('space_id', spaceId).order('created_at', { ascending: false }),
    ]);
    
    if (spaceRes.data) setSpace(spaceRes.data as SpaceData);
    setMembers((membersRes.data as any[]) || []);
    setDocuments((docsRes.data as SpaceDocument[]) || []);
    setLoading(false);
  }, [spaceId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  return { space, members, documents, loading, refreshDetails: fetchDetails };
}

export function useSpaceMessages(spaceId: string | undefined) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!spaceId) return;
    
    // Load existing messages
    supabase
      .from('messages')
      .select('*')
      .eq('space_id', spaceId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data);
      });

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages-${spaceId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `space_id=eq.${spaceId}`,
      }, (payload) => {
        setMessages(prev => {
          if (prev.some(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [spaceId]);

  return { messages, setMessages };
}

export function useTeamMessages(spaceId: string | undefined) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!spaceId) return;
    
    supabase
      .from('team_messages')
      .select('*, profile:profiles(display_name, avatar_url)')
      .eq('space_id', spaceId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data);
      });

    const channel = supabase
      .channel(`team-${spaceId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'team_messages',
        filter: `space_id=eq.${spaceId}`,
      }, (payload) => {
        setMessages(prev => {
          if (prev.some(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [spaceId]);

  const sendTeamMessage = async (content: string, userId: string) => {
    if (!spaceId) return;
    await supabase.from('team_messages').insert({
      space_id: spaceId,
      user_id: userId,
      content,
    });
  };

  return { messages, sendTeamMessage };
}
