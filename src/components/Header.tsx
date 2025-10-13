import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Settings, 
  LogOut, 
  User, 
  Bell,
  Search,
  Plus,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import logoGradient from "@/assets/logo-gradient.png";

export const Header = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
          <div className="w-9 h-9 flex items-center justify-center">
            <img src={logoGradient} alt="Tenezis" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-semibold text-foreground tracking-tight">
            Tenezis <span className="font-light text-muted-foreground">Spaces</span>
          </span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-1">
          <Link 
            to="/discover" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
          >
            {t('nav.discover')}
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                to="/dashboard" 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
              >
                {t('nav.dashboard')}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-4 py-2 h-auto font-medium text-muted-foreground hover:text-foreground">
                    {t('nav.create')}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/spaces/create" className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      {t('nav.newSpace')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/documents/upload" className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      {t('nav.document')}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          <LanguageSelector />
          
          {/* Search - Only when authenticated */}
          {isAuthenticated && (
            <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9">
              <Search className="w-4 h-4" />
            </Button>
          )}

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-primary">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 px-2 hover:bg-muted/50">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block ml-2 text-left">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 ml-2 hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      {t('nav.settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Not authenticated */}
              <Link to="/login">
                <Button variant="ghost" className="hidden md:flex font-medium">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 font-medium">
                  {t('nav.signup')}
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link 
              to="/discover" 
              className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.discover')}
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link 
                  to="/spaces/create" 
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.create')}
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <Link 
                to="/login" 
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};