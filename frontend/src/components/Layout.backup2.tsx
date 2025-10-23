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
  User,
  LogOut,
  Settings,
  Calendar,
  Bell,
  Menu,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
const menuItems = [
  { title: "Patient Overview", url: "/patient-overview", icon: Users },
  { title: "Ward Management", url: "/ward-management", icon: Building2 },
  { title: "Peritoneal Dialysis", url: "/peritoneal-dialysis", icon: Activity },
  { title: "HaemoDialysis", url: "/haemodialysis", icon: Heart },
  { title: "Kidney Transplant", url: "/kidney-transplant", icon: Stethoscope },
  { title: "Investigation", url: "/investigation", icon: Search },
  { title: "Medications", url: "/medications", icon: Pill },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { cycleTheme, getThemeIcon } = useTheme();

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const patients = [
    { id: "1", name: "Sarath Wijesinghe" },
    { id: "2", name: "Ranil Rajapaksha" },
  ];

  const currentUser = {
    name: "Dr. Rajitha Abeysekara",
    email: "rajitha.abeysekara@hospital.com",
    role: "Nephrologist",
    avatar: null,
  };

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  const raw = (searchQuery || "").trim();
  if (!raw) return;

  // Normalize so both "1001" and "BHT-1001" work
  const norm = (() => {
    const t = raw.toUpperCase();
    if (/^BHT-\d+$/.test(t)) return t;
    if (/^\d+$/.test(t)) return BHT-\;
    return t;
  })();

  // Navigate to Ward Management page with querystring
  navigate(\/ward-management?bht=\\);
};

export default Layout;

