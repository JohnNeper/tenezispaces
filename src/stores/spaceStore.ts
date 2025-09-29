// Store local pour gérer les spaces et les données utilisateur
export interface Space {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  visibility: 'public' | 'private';
  aiModel: string;
  owner: { id: string; name: string; avatar?: string };
  members: Array<{ id: string; name: string; role: 'owner' | 'collaborator' | 'member'; avatar?: string; lastActive: string }>;
  documents: Array<{ id: string; name: string; type: string; size: string; uploadedAt: string; url?: string }>;
  messages: Array<{ id: string; content: string; type: 'user' | 'ai'; timestamp: Date; userId: string; sources?: Array<{ name: string; type: string }> }>;
  createdAt: Date;
  lastActivity: Date;
  stats: { members: number; documents: number; messages: number };
  settings: {
    resourcesVisible: boolean;
    inviteLink?: string;
    inviteToken?: string;
    inviteExpiry?: Date;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  joinedSpaces: string[];
}

class SpaceStore {
  private spaces: Space[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadFromStorage();
    this.initializeMockData();
  }

  private loadFromStorage() {
    const spacesData = localStorage.getItem('tenezis_spaces');
    const userData = localStorage.getItem('tenezis_user');
    
    if (spacesData) {
      this.spaces = JSON.parse(spacesData).map((space: any) => ({
        ...space,
        createdAt: new Date(space.createdAt),
        lastActivity: new Date(space.lastActivity),
        messages: space.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    }
    
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  private saveToStorage() {
    localStorage.setItem('tenezis_spaces', JSON.stringify(this.spaces));
    if (this.currentUser) {
      localStorage.setItem('tenezis_user', JSON.stringify(this.currentUser));
    }
  }

  private initializeMockData() {
    if (this.spaces.length === 0) {
      const mockSpaces: Space[] = [
        {
          id: '1',
          name: 'Product Research Hub',
          description: 'Central repository for all product research documents, user feedback, and market analysis.',
          category: 'research',
          tags: ['UX Research', 'Market Analysis', 'User Feedback'],
          visibility: 'public',
          aiModel: 'gpt-4',
          owner: { id: '1', name: 'Sarah Chen', avatar: '' },
          members: [
            { id: '1', name: 'Sarah Chen', role: 'owner', avatar: '', lastActive: 'En ligne' },
            { id: '2', name: 'Alex Rodriguez', role: 'collaborator', avatar: '', lastActive: 'Il y a 2h' },
            { id: '3', name: 'Emma Thompson', role: 'member', avatar: '', lastActive: 'Il y a 1j' },
          ],
          documents: [
            { id: '1', name: 'User Interview Transcripts Q4 2024.pdf', type: 'PDF', size: '2.3 MB', uploadedAt: '2024-01-15' },
            { id: '2', name: 'Market Research Report.docx', type: 'DOCX', size: '5.1 MB', uploadedAt: '2024-01-14' },
          ],
          messages: [],
          createdAt: new Date('2024-01-10'),
          lastActivity: new Date(),
          stats: { members: 3, documents: 2, messages: 0 },
          settings: { resourcesVisible: true }
        },
        {
          id: '2',
          name: 'Math Study Group',
          description: 'Collaborative space for mathematics students to share resources and discuss problems.',
          category: 'education',
          tags: ['Mathematics', 'Study Group', 'Calculus'],
          visibility: 'public',
          aiModel: 'claude-3-opus',
          owner: { id: '4', name: 'Dr. Martinez', avatar: '' },
          members: [
            { id: '4', name: 'Dr. Martinez', role: 'owner', avatar: '', lastActive: 'En ligne' },
            { id: '5', name: 'Student A', role: 'member', avatar: '', lastActive: 'Il y a 30min' },
            { id: '6', name: 'Student B', role: 'member', avatar: '', lastActive: 'Il y a 1h' },
          ],
          documents: [
            { id: '3', name: 'Calculus Exercise Set 1.pdf', type: 'PDF', size: '1.2 MB', uploadedAt: '2024-01-16' },
          ],
          messages: [],
          createdAt: new Date('2024-01-08'),
          lastActivity: new Date(Date.now() - 30 * 60 * 1000),
          stats: { members: 3, documents: 1, messages: 0 },
          settings: { resourcesVisible: true }
        },
        {
          id: '3',
          name: 'AI Research Lab',
          description: 'Advanced research on artificial intelligence, machine learning, and neural networks.',
          category: 'technology',
          tags: ['AI', 'Machine Learning', 'Research'],
          visibility: 'public',
          aiModel: 'gpt-4',
          owner: { id: '7', name: 'Prof. Zhang', avatar: '' },
          members: [
            { id: '7', name: 'Prof. Zhang', role: 'owner', avatar: '', lastActive: 'Il y a 2h' },
          ],
          documents: [],
          messages: [],
          createdAt: new Date('2024-01-12'),
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
          stats: { members: 1, documents: 0, messages: 0 },
          settings: { resourcesVisible: false }
        }
      ];
      
      this.spaces = mockSpaces;
      this.saveToStorage();
    }
  }

  // Méthodes publiques
  getAllSpaces(): Space[] {
    return this.spaces;
  }

  getPublicSpaces(): Space[] {
    return this.spaces.filter(space => space.visibility === 'public');
  }

  getUserSpaces(userId: string): Space[] {
    return this.spaces.filter(space => 
      space.owner.id === userId || space.members.some(member => member.id === userId)
    );
  }

  getSpaceById(id: string): Space | null {
    return this.spaces.find(space => space.id === id) || null;
  }

  createSpace(spaceData: Omit<Space, 'id' | 'createdAt' | 'lastActivity' | 'stats' | 'messages' | 'members'>): Space {
    const newSpace: Space = {
      ...spaceData,
      id: Date.now().toString(),
      members: [{ ...spaceData.owner, role: 'owner', lastActive: 'En ligne' }],
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      stats: { members: 1, documents: spaceData.documents.length, messages: 0 }
    };
    
    this.spaces.push(newSpace);
    this.saveToStorage();
    return newSpace;
  }

  updateSpace(id: string, updates: Partial<Space>): Space | null {
    const spaceIndex = this.spaces.findIndex(space => space.id === id);
    if (spaceIndex === -1) return null;
    
    this.spaces[spaceIndex] = { ...this.spaces[spaceIndex], ...updates, lastActivity: new Date() };
    this.saveToStorage();
    return this.spaces[spaceIndex];
  }

  deleteSpace(id: string): boolean {
    const spaceIndex = this.spaces.findIndex(space => space.id === id);
    if (spaceIndex === -1) return false;
    
    this.spaces.splice(spaceIndex, 1);
    this.saveToStorage();
    return true;
  }

  joinSpace(spaceId: string, userId: string, userName: string): boolean {
    const space = this.getSpaceById(spaceId);
    if (!space) return false;
    
    const isAlreadyMember = space.members.some(member => member.id === userId);
    if (isAlreadyMember) return false;
    
    space.members.push({ 
      id: userId, 
      name: userName, 
      role: 'member', 
      avatar: '', 
      lastActive: 'En ligne' 
    });
    space.stats.members = space.members.length;
    space.lastActivity = new Date();
    
    this.saveToStorage();
    return true;
  }

  leaveSpace(spaceId: string, userId: string): boolean {
    const space = this.getSpaceById(spaceId);
    if (!space) return false;
    
    const memberIndex = space.members.findIndex(member => member.id === userId);
    if (memberIndex === -1) return false;
    
    // Ne peut pas quitter si c'est le propriétaire
    if (space.members[memberIndex].role === 'owner') return false;
    
    space.members.splice(memberIndex, 1);
    space.stats.members = space.members.length;
    space.lastActivity = new Date();
    
    this.saveToStorage();
    return true;
  }

  addMessage(spaceId: string, message: Omit<Space['messages'][0], 'id' | 'timestamp'>): boolean {
    const space = this.getSpaceById(spaceId);
    if (!space) return false;
    
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    space.messages.push(newMessage);
    space.stats.messages = space.messages.length;
    space.lastActivity = new Date();
    
    this.saveToStorage();
    return true;
  }

  getMessages(spaceId: string): Space['messages'] {
    const space = this.getSpaceById(spaceId);
    return space ? space.messages : [];
  }

  generateInviteLink(spaceId: string, expirationHours: number = 24): string | null {
    const space = this.getSpaceById(spaceId);
    if (!space) return null;
    
    const token = Math.random().toString(36).substring(2, 15);
    const expiry = new Date(Date.now() + expirationHours * 60 * 60 * 1000);
    
    space.settings.inviteToken = token;
    space.settings.inviteExpiry = expiry;
    space.settings.inviteLink = `${window.location.origin}/spaces/join/${spaceId}?token=${token}`;
    
    this.saveToStorage();
    return space.settings.inviteLink;
  }

  validateInviteToken(spaceId: string, token: string): boolean {
    const space = this.getSpaceById(spaceId);
    if (!space || !space.settings.inviteToken || !space.settings.inviteExpiry) {
      return false;
    }
    
    return space.settings.inviteToken === token && new Date() < space.settings.inviteExpiry;
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    this.saveToStorage();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const spaceStore = new SpaceStore();