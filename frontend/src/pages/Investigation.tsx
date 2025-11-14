import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Droplets, Heart, Activity } from "lucide-react";

const Investigation = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          Investigation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Laboratory tests, imaging studies, and diagnostic procedures
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Peritoneal Dialysis Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Peritoneal Dialysis</CardTitle>
            <CardDescription>
              Enter investigation results for PD patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/investigation/pd")} 
              className="w-full"
              variant="default"
            >
              Enter Details
            </Button>
          </CardContent>
        </Card>

        {/* Kidney Transplant Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Kidney Transplant</CardTitle>
            <CardDescription>
              Enter investigation results for transplant patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/investigation/kt")} 
              className="w-full"
              variant="default"
            >
              Enter Details
            </Button>
          </CardContent>
        </Card>

        {/* Hemodialysis Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Hemodialysis</CardTitle>
            <CardDescription>
              Enter investigation results for HD patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/investigation/hd")} 
              className="w-full"
              variant="default"
            >
              Enter Details
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Investigation;
