import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  Crown,
  CreditCard,
  HelpCircle,
  LogOut,
  Bell,
  Shield,
  ChevronDown
} from "lucide-react";
import { SubscriptionSettings } from "./SubscriptionSettings";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  initials: string;
}

interface UserProfileProps {
  user?: UserData;
}

export function UserProfile({ 
  user = {
    name: "John Doe",
    email: "john.doe@example.com", 
    plan: "pro",
    initials: "JD"
  }
}: UserProfileProps) {
  const [showSubscription, setShowSubscription] = useState(false);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-muted text-muted-foreground';
      case 'pro': return 'bg-gradient-primary text-primary-foreground';
      case 'enterprise': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPlanIcon = (plan: string) => {
    if (plan === 'pro' || plan === 'enterprise') {
      return <Crown className="w-3 h-3" />;
    }
    return null;
  };

  return (
    <div className="flex items-center space-x-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded-lg">
            <Avatar className="w-8 h-8">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                  {user.initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <div className="flex items-center space-x-1">
                <Badge className={`text-xs px-2 py-0.5 ${getPlanColor(user.plan)}`}>
                  {getPlanIcon(user.plan)}
                  <span className="ml-1 capitalize">{user.plan}</span>
                </Badge>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64" align="end">
          <DropdownMenuLabel>
            <div className="space-y-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <Badge className={`text-xs w-fit ${getPlanColor(user.plan)}`}>
                {getPlanIcon(user.plan)}
                <span className="ml-1 capitalize">{user.plan} Plan</span>
              </Badge>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Profile Settings
          </DropdownMenuItem>
          
          <Dialog open={showSubscription} onOpenChange={setShowSubscription}>
            <DialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                <CreditCard className="w-4 h-4 mr-2" />
                Subscription & Billing
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <SubscriptionSettings user={user} onClose={() => setShowSubscription(false)} />
            </DialogContent>
          </Dialog>
          
          <DropdownMenuItem className="cursor-pointer">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Shield className="w-4 h-4 mr-2" />
            Privacy & Security
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help & Support
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}