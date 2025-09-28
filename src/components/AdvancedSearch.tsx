import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  X,
  Clock,
  Users,
  Globe,
  Lock,
  Bot,
  FileText,
  Tag
} from "lucide-react";

interface SearchFilters {
  categories: string[];
  visibility: string[];
  roles: string[];
  activity: string[];
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

export function AdvancedSearch({ 
  onSearch, 
  placeholder = "Rechercher des espaces...",
  className = ""
}: AdvancedSearchProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    visibility: [],
    roles: [],
    activity: []
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filterOptions = {
    categories: [
      { value: "business", label: "Business", icon: Users },
      { value: "technology", label: "Technologie", icon: Bot },
      { value: "design", label: "Design", icon: FileText },
      { value: "marketing", label: "Marketing", icon: Tag },
      { value: "research", label: "Recherche", icon: Search },
    ],
    visibility: [
      { value: "public", label: "Public", icon: Globe },
      { value: "private", label: "Privé", icon: Lock },
    ],
    roles: [
      { value: "owner", label: "Propriétaire", icon: Users },
      { value: "collaborator", label: "Collaborateur", icon: Users },
      { value: "viewer", label: "Observateur", icon: Users },
    ],
    activity: [
      { value: "today", label: "Aujourd'hui", icon: Clock },
      { value: "week", label: "Cette semaine", icon: Clock },
      { value: "month", label: "Ce mois", icon: Clock },
    ]
  };

  const handleFilterChange = (filterType: keyof SearchFilters, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    if (checked) {
      newFilters[filterType] = [...newFilters[filterType], value];
    } else {
      newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
    }
    setFilters(newFilters);
    onSearch(query, newFilters);
  };

  const removeFilter = (filterType: keyof SearchFilters, value: string) => {
    handleFilterChange(filterType, value, false);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      categories: [],
      visibility: [],
      roles: [],
      activity: []
    };
    setFilters(emptyFilters);
    onSearch(query, emptyFilters);
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    onSearch(newQuery, filters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).flat().length;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-24 border-border/50 focus:border-primary"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <DropdownMenu open={showAdvanced} onOpenChange={setShowAdvanced}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
              >
                <Filter className="w-4 h-4" />
                {hasActiveFilters && (
                  <Badge 
                    className="absolute -top-2 -right-2 w-5 h-5 text-xs p-0 flex items-center justify-center bg-primary text-primary-foreground"
                  >
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel className="flex items-center justify-between">
                Filtres avancés
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Effacer tout
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Categories */}
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Catégories
              </DropdownMenuLabel>
              {filterOptions.categories.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={filters.categories.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleFilterChange('categories', option.value, checked)
                  }
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator />
              
              {/* Visibility */}
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Visibilité
              </DropdownMenuLabel>
              {filterOptions.visibility.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={filters.visibility.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleFilterChange('visibility', option.value, checked)
                  }
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator />
              
              {/* Roles */}
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Votre rôle
              </DropdownMenuLabel>
              {filterOptions.roles.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={filters.roles.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleFilterChange('roles', option.value, checked)
                  }
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator />
              
              {/* Activity */}
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Activité récente
              </DropdownMenuLabel>
              {filterOptions.activity.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={filters.activity.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleFilterChange('activity', option.value, checked)
                  }
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Card className="bg-muted/20 border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Filtres actifs :</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-3 h-3 mr-1" />
                Effacer tout
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([filterType, values]) =>
                values.map((value) => {
                  const option = Object.values(filterOptions)
                    .flat()
                    .find(opt => opt.value === value);
                  
                  return (
                    <Badge 
                      key={`${filterType}-${value}`}
                      variant="secondary" 
                      className="text-xs pl-2 pr-1 py-1 flex items-center gap-1"
                    >
                      {option?.icon && <option.icon className="w-3 h-3" />}
                      {option?.label || value}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive"
                        onClick={() => removeFilter(filterType as keyof SearchFilters, value)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}