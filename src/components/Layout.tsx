import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
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
  Users,
  Building2,
  Activity,
  Heart,
  Stethoscope,
  Search,
  Pill,
  Menu,
  User,
  LogOut,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Patient Overview",
    url: "/patient-overview",
    icon: Users,
  },
  {
    title: "Ward Management",
    url: "/ward-management",
    icon: Building2,
  },
  {
    title: "Peritoneal Dialysis",
    url: "/peritoneal-dialysis",
    icon: Activity,
  },
  {
    title: "HaemoDialysis",
    url: "/haemodialysis",
    icon: Heart,
  },
  {
    title: "Kidney Transplant",
    url: "/kidney-transplant",
    icon: Stethoscope,
  },
  {
    title: "Investigation",
    url: "/investigation",
    icon: Search,
  },
  {
    title: "Medications",
    url: "/medications",
    icon: Pill,
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock user data - in a real app, this would come from authentication context
  const currentUser = {
    name: "Dr. Rajitha Abeysekara",
    email: "rajitha.abeysekara@hospital.com",
    role: "Nephrologist",
    avatar: null,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would trigger a search across all modules
      console.log("Searching for:", searchQuery);
      // You could implement search logic here or navigate to a search results page
    }
  };

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log("Logging out...");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Renal Unit Manager</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        isActive={location.pathname === item.url}
                        tooltip={item.title}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1">
          <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">
                  {menuItems.find(item => item.url === location.pathname)?.title || "Renal Unit Manager"}
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </form>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-md p-2 transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatar || undefined} />
                        <AvatarFallback>
                          {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.role}</p>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
