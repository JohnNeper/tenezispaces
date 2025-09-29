// Service pour gérer les communications avec le backend externe
export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  sources?: { name: string; type: string }[];
}

export interface ChatResponse {
  message: string;
  sources?: { name: string; type: string }[];
}

export class ChatService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  async sendMessage(spaceId: string, message: string, aiModel: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          spaceId,
          message,
          aiModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chat service error:', error);
      // Fallback pour développement
      return this.getFallbackResponse(message, aiModel);
    }
  }

  private getFallbackResponse(message: string, aiModel: string): ChatResponse {
    return {
      message: `Réponse simulée utilisant ${aiModel}: ${message}. Ceci est une réponse de développement. Pour utiliser votre backend, configurez l'URL dans le service chat.`,
      sources: [
        { name: "Document exemple 1.pdf", type: "PDF" },
        { name: "Rapport analyse.docx", type: "DOCX" }
      ]
    };
  }

  async getChatHistory(spaceId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/${spaceId}/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }
}

export const chatService = new ChatService();