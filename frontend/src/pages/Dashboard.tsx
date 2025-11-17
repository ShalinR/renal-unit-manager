import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicalButton } from "@/components/ui/button-variants";
import { 
  Bed, 
  Activity, 
  Heart, 
  Users, 
  LogOut,
  User
} from "lucide-react";
import { formatDateToDDMMYYYY } from "@/lib/dateUtils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface User {
  username: string;
  role: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const unitCards = [
    {
      title: "Ward Management",
      description: "Inpatient admissions, records, and discharge management",
      icon: Bed,
      route: "/ward",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Dialysis Unit Management",
      description: "Hemodialysis scheduling and session management",
      icon: Activity,
      route: "/dialysis",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      title: "Peritoneal Dialysis Management",
      description: "Remote monitoring and appointment scheduling",
      icon: Heart,
      route: "/peritoneal",
      color: "text-medical-info",
      bgColor: "bg-medical-info/10"
    },
    {
      title: "Kidney Transplant Management",
      description: "Transplant records, follow-ups, and donor registry",
      icon: Users,
      route: "/transplant",
      color: "text-medical-success",
      bgColor: "bg-medical-success/10"
    }
  ];

  if (!user) {
    return null; // Loading state while checking authentication
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="bg-card border-b card-shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Renal Care Unit</h1>
              <p className="text-muted-foreground">Teaching Hospital Peradeniya</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4" />
                  {user.username}
                </div>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <MedicalButton
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </MedicalButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.username}</h2>
          <p className="text-muted-foreground text-lg">
            Select a unit to manage patient care services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {unitCards.map((unit) => {
            const IconComponent = unit.icon;
            return (
              <Card
                key={unit.title}
                className="card-shadow hover:shadow-lg medical-transition cursor-pointer group hover:border-primary/30"
                onClick={() => navigate(unit.route)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${unit.bgColor} group-hover:scale-110 medical-transition`}>
                      <IconComponent className={`w-6 h-6 ${unit.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardTitle className="text-xl mb-2 group-hover:text-primary medical-transition">
                    {unit.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {unit.description}
                  </CardDescription>
                  <div className="mt-4">
                    <MedicalButton
                      variant="unit"
                      className="w-full group-hover:border-primary/50"
                    >
                      Access Unit →
                    </MedicalButton>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">System Status</h3>
                <p className="text-muted-foreground">All systems operational • Last updated: {formatDateToDDMMYYYY(new Date().toISOString())}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;