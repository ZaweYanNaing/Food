"use client"

import * as React from "react"
import {
  Home,
  BookOpen,
  ChefHat,
  Users,
  GraduationCap,
  FileText,
  Phone,
  LogIn,
  UserPlus,
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
import { FoodFusionTeamSwitcher } from "@/components/ui/food-fusion-team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "../../contexts/AuthContext"
import { useLocation } from "react-router-dom"

interface FoodFusionSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onJoinUsClick?: () => void;
}

export function FoodFusionSidebar({ onJoinUsClick, ...props }: FoodFusionSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Navigation data for FoodFusion
  const navMain = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: location.pathname === "/",
    },
    {
      title: "About",
      url: "/about",
      icon: BookOpen,
      isActive: location.pathname === "/about",
    },
    {
      title: "Recipes",
      url: "/recipe-management",
      icon: ChefHat,
      isActive: location.pathname === "/recipe-management",
    },
    {
      title: "Community",
      url: "/community",
      icon: Users,
      isActive: location.pathname === "/community",
    },
    {
      title: "Culinary Resources",
      url: "/culinary-resources",
      icon: GraduationCap,
      isActive: location.pathname === "/culinary-resources",
    },
    {
      title: "Educational Resources",
      url: "/educational-resources",
      icon: FileText,
      isActive: location.pathname === "/educational-resources",
    },
    {
      title: "Contact",
      url: "/contact",
      icon: Phone,
      isActive: location.pathname === "/contact",
    },
  ];

  // Authentication navigation items - only show when not logged in
  const authNavItems = !user ? [
    {
      title: "Sign In",
      url: "/login",
      icon: LogIn,
      isActive: location.pathname === "/login",
    },
    {
      title: "Join Us",
      url: "#", // This will be handled by onClick
      icon: UserPlus,
      isActive: false,
      onClick: onJoinUsClick,
    },
  ] : [];

  // User data
  const userData = {
    name: user ? `${user.firstName} ${user.lastName}` : "Guest",
    email: user ? user.email : "guest@example.com",
    avatar: "/avatars/default.jpg",
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <FoodFusionTeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        
        {/* Authentication Navigation Items - only show when not logged in */}
        {!user && (
          <div className="mt-10">
            <NavMain items={authNavItems} />
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>

     
        {user && <NavUser user={userData} onLogout={handleLogout} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
