import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Stethoscope, UserCheck, Lock, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/ward-management", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    try {
      await login(username, password);
      navigate("/ward-management", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Main two-column layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2">

        {/* Left Hero Section */}
        <div className="hidden md:flex relative items-center justify-center bg-gradient-to-br from-blue-800 to-cyan-600 p-12 overflow-hidden">
          {/* Decorative gradient circles */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-cyan-300/10 rounded-full blur-3xl" />

          <div className="relative max-w-lg text-white space-y-8">

            {/* Logo and heading */}
            <div className="text-center">
              <img
                src="/renal.jpeg"
                alt="Renal Unit Logo"
                className="mx-auto w-40 h-40 rounded-full object-cover shadow-2xl border border-white/30 transform transition-all duration-700 hover:scale-105"
              />
              <h2 className="text-4xl font-extrabold tracking-tight mt-6 drop-shadow-lg">
                Renal Unit Manager
              </h2>
              <p className="text-white/90 mt-3 text-lg leading-relaxed">
                Integrated patient management platform for renal care, transplant services, and dialysis operations at the Teaching Hospital Peradeniya
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid gap-4">
              {[
                {
                  title: "Clinical Grade Security",
                  desc: "Robust access controls ensure that sensitive patient information remains protected and traceable.",
                },
                {
                  title: "Optimized Workflow",
                  desc: "Streamlined workflows support coordination across transplant, dialysis, and follow-up units.",
                },
                {
                  title: "Reliable Patient Records",
                  desc: "Ensures up-to-date clinical information to support decision making and improve patient outcomes.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 p-5 rounded-xl backdrop-blur-sm shadow-lg border border-white/10 transition-all duration-500 hover:scale-105"
                >
                  <h4 className="font-semibold text-lg">{feature.title}</h4>
                  <p className="text-white/85 text-sm mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            

          </div>
        </div>

        {/* Right Login Form */}
        <div className="flex items-center justify-center p-8 bg-white">
          <Card className="w-full max-w-md shadow-xl border border-gray-200">
            <CardHeader className="text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Sign in to continue to Renal Unit Manager
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2 text-sm">
                    <UserCheck className="w-4 h-4" /> Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm">
                    <Lock className="w-4 h-4" /> Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch checked={false} onCheckedChange={() => {}} />
                    <span className="text-sm">Remember me</span>
                  </div>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Secure access to patient care management
              </div>

              
            </CardContent>

            {/* Footer */}
<footer className="w-full p-6 bg-slate-100 border-t text-center">
  <div className="max-w-4xl mx-auto space-y-4">
    <div>
      <h4 className="font-semibold text-base">Authorized Access Only</h4>
      <p className="text-sm text-slate-600 mt-1">
        This system is intended for clinical and administrative staff of the Renal Care Unit. Unauthorized access or disclosure is strictly prohibited.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-base">Support</h4>
      <p className="text-sm text-slate-600 mt-1">
        For account or technical issues, please contact the IT Support Desk at Teaching Hospital Peradeniya.
      </p>
    </div>
  </div>
</footer>
          </Card>
        </div>

      </div>


    </div>
  );
};

export default Login;
