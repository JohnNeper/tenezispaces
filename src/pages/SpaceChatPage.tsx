import { useParams } from "react-router-dom";
import { SpaceChat } from "@/components/SpaceChat";
import { SpacesSidebar } from "@/components/SpacesSidebar";
import { SpaceDetailsSidebar } from "@/components/SpaceDetailsSidebar";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

const mockSpace = {
  id: "1",
  name: "Product Research Hub",
  description: "Central repository for all product research documents, user feedback, and market analysis.",
  category: "Research",
  tags: ["UX Research", "Market Analysis", "User Feedback"],
  visibility: 'public' as const,
  owner: { name: "Sarah Chen", avatar: "" },
  stats: { members: 12, documents: 24, messages: 156 },
  aiModel: "gpt-4",
  lastActivity: "2 hours ago",
  isOwner: true,
};

const mockDocuments = [
  { id: "1", name: "User Interview Transcripts Q4 2024.pdf", type: "PDF", size: "2.3 MB", uploadedAt: "2024-01-15" },
  { id: "2", name: "Market Research Report.docx", type: "DOCX", size: "5.1 MB", uploadedAt: "2024-01-14" },
  { id: "3", name: "Competitor Analysis Spreadsheet.xlsx", type: "XLSX", size: "1.8 MB", uploadedAt: "2024-01-13" },
  { id: "4", name: "Product Requirements Document.pdf", type: "PDF", size: "4.2 MB", uploadedAt: "2024-01-12" },
  { id: "5", name: "Customer Feedback Survey Results.csv", type: "CSV", size: "892 KB", uploadedAt: "2024-01-11" },
];

const mockMembers = [
  { id: "1", name: "Sarah Chen", role: "Owner", avatar: "", lastActive: "Online" },
  { id: "2", name: "Alex Rodriguez", role: "Collaborator", avatar: "", lastActive: "2 hours ago" },
  { id: "3", name: "Emma Thompson", role: "User", avatar: "", lastActive: "1 day ago" },
  { id: "4", name: "David Kim", role: "User", avatar: "", lastActive: "3 days ago" },
];

export default function SpaceChatPage() {
  const { spaceId } = useParams();
  const { t } = useLanguage();

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/spaces/join/${spaceId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success(t("spaces.linkCopied"));
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-subtle">
      {/* Sidebar gauche - Liste des spaces */}
      <SpacesSidebar />
      
      {/* Centre - Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <SpaceChat
          spaceId={mockSpace.id}
          spaceName={mockSpace.name}
          aiModel={mockSpace.aiModel}
          documents={mockDocuments}
        />
      </div>
      
      {/* Sidebar droite - Détails du space */}
      <SpaceDetailsSidebar
        space={mockSpace}
        documents={mockDocuments}
        members={mockMembers}
        onShare={handleShare}
      />
    </div>
  );
}