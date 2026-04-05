import { useParams } from "react-router-dom";
import { SpaceChat } from "@/components/SpaceChat";
import { SpacesSidebar } from "@/components/SpacesSidebar";
import { useSpaceDetails } from "@/hooks/useSpaces";
import { Loader2 } from "lucide-react";

export default function SpaceChatPage() {
  const { spaceId } = useParams();
  const { space, documents, loading, refreshDetails } = useSpaceDetails(spaceId);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Espace introuvable</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-subtle">
      <SpacesSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <SpaceChat
          spaceId={space.id}
          spaceName={space.name}
          aiModel={space.ai_model || 'google/gemini-3-flash-preview'}
          documents={documents.map(d => ({
            id: d.id,
            name: d.name,
            type: d.type,
            status: d.status,
            chunk_count: d.chunk_count,
            size_bytes: d.size_bytes,
            created_at: d.created_at,
          }))}
          onRefreshDocuments={refreshDetails}
        />
      </div>
    </div>
  );
}
