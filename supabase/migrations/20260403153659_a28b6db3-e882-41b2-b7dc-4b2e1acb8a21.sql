
-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferred_language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Spaces
CREATE TABLE public.spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  ai_model TEXT DEFAULT 'google/gemini-3-flash-preview',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON public.spaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Space members
CREATE TABLE public.space_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'collaborator', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(space_id, user_id)
);
ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_space_member(_user_id UUID, _space_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.space_members WHERE user_id = _user_id AND space_id = _space_id); $$;

CREATE OR REPLACE FUNCTION public.is_space_public(_space_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.spaces WHERE id = _space_id AND visibility = 'public'); $$;

-- Spaces policies
CREATE POLICY "Public spaces visible to all" ON public.spaces FOR SELECT
  USING (visibility = 'public' OR owner_id = auth.uid() OR public.is_space_member(auth.uid(), id));
CREATE POLICY "Auth users can create spaces" ON public.spaces FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner can update space" ON public.spaces FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner can delete space" ON public.spaces FOR DELETE USING (auth.uid() = owner_id);

-- Space members policies
CREATE POLICY "Members can view space members" ON public.space_members FOR SELECT
  USING (public.is_space_member(auth.uid(), space_id) OR public.is_space_public(space_id));
CREATE POLICY "Auth users can join spaces" ON public.space_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members can leave or owner remove" ON public.space_members FOR DELETE
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.spaces s WHERE s.id = space_id AND s.owner_id = auth.uid()));

-- Documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size_bytes BIGINT DEFAULT 0,
  storage_path TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'ready', 'error')),
  chunk_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Space members can view docs" ON public.documents FOR SELECT
  USING (public.is_space_member(auth.uid(), space_id) OR public.is_space_public(space_id));
CREATE POLICY "Space members can upload docs" ON public.documents FOR INSERT
  WITH CHECK (public.is_space_member(auth.uid(), space_id));
CREATE POLICY "Owner or uploader can delete docs" ON public.documents FOR DELETE
  USING (auth.uid() = uploaded_by OR EXISTS (SELECT 1 FROM public.spaces s WHERE s.id = space_id AND s.owner_id = auth.uid()));
CREATE POLICY "System can update doc status" ON public.documents FOR UPDATE USING (true);

-- Messages (AI chat)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  sources JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Space members can view messages" ON public.messages FOR SELECT
  USING (public.is_space_member(auth.uid(), space_id));
CREATE POLICY "Space members can send messages" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_space_member(auth.uid(), space_id));

-- Team messages
CREATE TABLE public.team_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Space members can view team msgs" ON public.team_messages FOR SELECT
  USING (public.is_space_member(auth.uid(), space_id));
CREATE POLICY "Space members can send team msgs" ON public.team_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_space_member(auth.uid(), space_id));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('space-documents', 'space-documents', false);
CREATE POLICY "Auth users can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'space-documents' AND auth.role() = 'authenticated');
CREATE POLICY "Auth users can view files" ON storage.objects FOR SELECT USING (bucket_id = 'space-documents' AND auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete files" ON storage.objects FOR DELETE USING (bucket_id = 'space-documents' AND auth.role() = 'authenticated');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
