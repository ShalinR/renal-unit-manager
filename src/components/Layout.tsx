import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { MedicalButton } from "@/components/ui/button-variants";
import { 
  Home,
  Bed, 
  Activity, 
  Heart, 
  Users, 
  LogOut,
  User,
  Stethoscope
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  username: string;
  role: string;
}

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Ward Management", url: "/ward", icon: Bed },
  { title: "Dialysis Unit", url: "/dialysis", icon: Activity },
  { title: "Peritoneal Dialysis", url: "/peritoneal", icon: Heart },
  { title: "Kidney Transplant", url: "/transplant", icon: Users },
];

function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="border-r">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 medical-gradient rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-sm">Renal Care Unit</h2>
                <p className="text-xs text-muted-foreground">TH Peradeniya</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`medical-transition ${
                        isActive(item.url)
                          ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <button
                        onClick={() => navigate(item.url)}
                        className="w-full flex items-center gap-3 px-3 py-2"
                      >
                        <IconComponent className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <div className="mt-auto p-4 border-t">
          <MedicalButton
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full gap-2"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && "Logout"}
          </MedicalButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {/* Top Header */}
          <header className="bg-card border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="font-semibold">Renal Care Management System</h1>
                <p className="text-sm text-muted-foreground">Professional Patient Care Interface</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span className="font-medium">{user.username}</span>
              <span className="text-muted-foreground">({user.role})</span>
            </div>
          </header>
          
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;