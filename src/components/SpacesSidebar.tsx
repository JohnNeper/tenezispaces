import { Link, useParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/hooks/useLanguage";
import { spaceStore } from "@/stores/spaceStore";
import { useState, useEffect } from "react";
import logoGradient from "@/assets/logo-gradient.png";

export const SpacesSidebar = () => {
  const { t } = useLanguage();
  const { spaceId } = useParams();
  const [spaces, setSpaces] = useState(spaceStore.getAllSpaces());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Refresh spaces list periodically
    const interval = setInterval(() => {
      setSpaces(spaceStore.getAllSpaces());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mySpaces = spaces.filter(space => 
    space.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-background/95 backdrop-blur-md border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2 mb-4">
          <img src={logoGradient} alt="Tenezis" className="w-8 h-8" />
          <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
            Tenezis
          </span>
        </Link>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("spaces.searchSpaces")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/30"
          />
        </div>
      </div>

      {/* Spaces List */}
      <ScrollArea className="flex-1 px-2 py-2">
        <div className="space-y-1">
          {mySpaces.map((space) => (
            <Link
              key={space.id}
              to={`/spaces/${space.id}`}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all
                ${spaceId === space.id 
                  ? 'bg-gradient-primary/10 border border-primary/20 shadow-sm' 
                  : 'hover:bg-muted/30'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0
                ${spaceId === space.id
                  ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {space.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  spaceId === space.id ? 'text-foreground' : 'text-foreground/80'
                }`}>
                  {space.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {space.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Link to="/spaces/create" className="block">
          <Button className="w-full" variant="default">
            <Plus className="w-4 h-4 mr-2" />
            {t("spaces.createSpace")}
          </Button>
        </Link>
        <Link to="/discover" className="block">
          <Button className="w-full" variant="outline">
            <Search className="w-4 h-4 mr-2" />
            {t("spaces.discover")}
          </Button>
        </Link>
      </div>
    </div>
  );
};
