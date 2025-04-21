import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  User,
  LogOut,
  ChevronDown,
  Layout,
  Settings,
  Crown,
  MessageCircleQuestion,
  BookOpen,
  Wallet,
  LogIn,
  UserPlus,
  ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserMenu() {
  const { user, isAuthenticated, isGuest, logoutMutation } = useAuth();
  const [_, navigate] = useLocation();
  const [open, setOpen] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
    setOpen(false);
  };

  // If not authenticated, show sign in/sign up buttons
  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <Button onClick={() => navigate("/auth")} variant="outline" size="sm">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </div>
    );
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    
    if (user.fullName) {
      const nameParts = user.fullName.split(" ");
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    
    return user.username.substring(0, 2).toUpperCase();
  };

  // Get account type badge
  const getAccountBadge = () => {
    if (isGuest) {
      return <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">Guest</Badge>;
    }
    
    switch (user?.accountType) {
      case "paid":
        return <Badge variant="outline" className="text-purple-500 border-purple-200 bg-purple-50">Pro</Badge>;
      case "premium":
        return <Badge variant="outline" className="text-emerald-500 border-emerald-200 bg-emerald-50">Premium</Badge>;
      case "free":
        return <Badge variant="outline" className="text-gray-500 border-gray-200 bg-gray-50">Free</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-500 border-gray-200 bg-gray-50">Free</Badge>;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 rounded-full">
          <Avatar className="h-8 w-8">
            {user?.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.username} />
            ) : null}
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.fullName || user?.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            <div className="pt-1.5">
              {getAccountBadge()}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/projects")}>
            <Layout className="mr-2 h-4 w-4" />
            <span>My Projects</span>
          </DropdownMenuItem>

          {!isGuest && (
            <DropdownMenuItem onClick={() => navigate("/account")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {!isGuest && user?.accountType !== "premium" && (
          <>
            <DropdownMenuItem onClick={() => navigate("/pricing")}>
              <Crown className="mr-2 h-4 w-4" />
              <span>Upgrade Plan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/guide")}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>User Guide</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => window.open("https://launchplate.io/support", "_blank")}>
            <MessageCircleQuestion className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
            <ExternalLink className="ml-auto h-3 w-3" />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{logoutMutation.isPending ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}