// Service pour gérer les opérations sur les spaces
export interface SpaceSettings {
  name: string;
  description: string;
  visibility: 'public' | 'private';
  aiModel: string;
}

export interface ShareableLink {
  url: string;
  token: string;
  expiresAt: Date;
}

export class SpaceService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  async updateSpaceSettings(spaceId: string, settings: SpaceSettings): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/spaces/${spaceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating space settings:', error);
      throw error;
    }
  }

  async generateShareLink(spaceId: string, expirationHours: number = 24): Promise<ShareableLink> {
    try {
      const response = await fetch(`${this.baseUrl}/spaces/${spaceId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ expirationHours }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating share link:', error);
      // Fallback pour développement
      const token = Math.random().toString(36).substring(2, 15);
      return {
        url: `${window.location.origin}/spaces/${spaceId}/join?token=${token}`,
        token,
        expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000)
      };
    }
  }

  async sendInviteEmail(spaceId: string, email: string, role: string = 'member'): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/spaces/${spaceId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      throw error;
    }
  }

  getAvailableAIModels(): Array<{ id: string; name: string; description: string }> {
    return [
      { id: 'gpt-4', name: 'GPT-4', description: 'Modèle le plus avancé pour l\'analyse complexe' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Rapide et efficace pour la plupart des tâches' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Excellent pour l\'analyse de documents longs' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Équilibre performance et coût' },
      { id: 'gemini-pro', name: 'Gemini Pro', description: 'Modèle polyvalent de Google' },
      { id: 'llama-2-70b', name: 'Llama 2 70B', description: 'Modèle open source puissant' },
    ];
  }
}

export const spaceService = new SpaceService();