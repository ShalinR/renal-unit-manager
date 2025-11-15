import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Activity,
  Heart,
  Stethoscope,
  Search,
  Pill,
  User,
  LogOut,
  Settings,
  Calendar,
  Bell,
  Menu,
  Sun,
  Moon,
  Laptop,
  MessageSquare,
} from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import GlobalSearch from "./GlobalSearch";
import { useAuth } from "@/context/AuthContext";
import { FeedbackButton } from "./FeedbackButton";

const menuItems = [
  { title: "Ward Management", url: "/ward-management", icon: Building2 },
  { title: "Peritoneal Dialysis", url: "/peritoneal-dialysis", icon: Activity },
  { title: "HaemoDialysis", url: "/haemodialysis", icon: Heart },
  { title: "Kidney Transplant", url: "/kidney-transplant", icon: Stethoscope },
  { title: "Investigation", url: "/investigation", icon: Search },
  { title: "Medications", url: "/medications", icon: Pill },
];

const adminMenuItems = [
  { title: "Feedback Management", url: "/admin/feedback", icon: MessageSquare },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cycleTheme, getThemeIcon } = useTheme();
  const { user, logout } = useAuth();

  const currentUser = {
    name: user?.fullName || user?.username || "User",
    email: user?.username ? `${user.username}@hospital.com` : "user@hospital.com",
    role: user?.role || "USER",
    avatar: null,
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-900">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800">
          <SidebarHeader>
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-slate-800">
                  Renal Unit Manager
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Nephrology
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-6">
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        isActive={location.pathname === item.url}
                        className={`
                          flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 w-full dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50
                          ${ // This logic can be simplified or moved into variants if using CVA
                            location.pathname === item.url
                              ? "bg-blue-50 text-blue-700 shadow-sm"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  {user?.role === "ADMIN" && (
                    <>
                      <SidebarGroupLabel className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 mt-4">
                        Administration
                      </SidebarGroupLabel>
                      {adminMenuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            onClick={() => navigate(item.url)}
                            isActive={location.pathname === item.url}
                            className={`
                              flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 w-full dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50
                              ${location.pathname === item.url
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              }
                            `}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex justify-center p-4">
              <Button
                variant="outline"
                size="icon"
                onClick={cycleTheme}
                className="rounded-full"
              >
                {getThemeIcon() === "sun" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
                {getThemeIcon() === "moon" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
                {getThemeIcon() === "system" && (
                  <Laptop className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main */}
        <main className="flex-1 flex flex-col relative">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="p-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors" />
                <div className="flex flex-col">
                  <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    {menuItems.find((item) => item.url === location.pathname)
                      ?.title || "Renal Unit Dashboard"}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentUser.role} •{" "}
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex">
                  <GlobalSearch />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    onClick={cycleTheme}
                  >
                    {getThemeIcon() === "sun" && (
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    )}
                    {getThemeIcon() === "moon" && (
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    )}
                    {getThemeIcon() === "system" && (
                      <Laptop className="h-[1.2rem] w-[1.2rem]" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 text-slate-600 hover:bg-slate-100 relative dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      3
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <Calendar className="h-5 w-5" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 rounded-lg p-2 transition-colors">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={currentUser.avatar || undefined} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-teal-400 text-white text-sm font-medium">
                            {currentUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block text-left dark:text-slate-300">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {currentUser.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {currentUser.role}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-64 bg-white border border-slate-200 shadow-xl rounded-xl"
                    >
                      <DropdownMenuLabel className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={currentUser.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-teal-400 text-white font-medium">
                              {currentUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-slate-800">
                              {currentUser.name}
                            </p>
                            <p className="text-xs text-slate-600">
                              {currentUser.role}
                            </p>
                            <p className="text-xs text-slate-400">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <div className="p-2">
                        <DropdownMenuItem className="rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer">
                          <User className="mr-3 h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-700">Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer">
                          <Settings className="mr-3 h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-700">Settings</span>
                        </DropdownMenuItem>
                      </div>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <div className="p-2">
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="rounded-lg px-3 py-2 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="mr-3 h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-600">Log out</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden p-4 border-t border-slate-100 bg-white">
              <GlobalSearch />
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm p-6 border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
              {children}
            </div>
          </div>
          <FeedbackButton />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
