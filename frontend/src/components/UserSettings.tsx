import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserSettings: React.FC<Props> = ({ open, onOpenChange }) => {
  const [notifications, setNotifications] = useState<boolean>(() => {
    return localStorage.getItem("settings.notifications") === "true";
  });
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    return Number(localStorage.getItem("settings.itemsPerPage") || 20);
  });
  const [defaultPage, setDefaultPage] = useState<string>(() => {
    return localStorage.getItem("settings.defaultPage") || "/";
  });
  const [dateFormat, setDateFormat] = useState<string>(() => {
    return localStorage.getItem("settings.dateFormat") || "DD/MM/YYYY";
  });
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("theme") || "system";
  });

  useEffect(() => {
    // apply theme immediately for preview
    const apply = (t: string) => {
      if (t === "dark") document.documentElement.classList.add("dark");
      else if (t === "light") document.documentElement.classList.remove("dark");
      else {
        // system
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    };
    apply(theme);
  }, [theme]);

  const handleSave = () => {
    localStorage.setItem("settings.notifications", String(notifications));
    localStorage.setItem("settings.itemsPerPage", String(itemsPerPage));
    localStorage.setItem("settings.defaultPage", defaultPage);
    localStorage.setItem("settings.dateFormat", dateFormat);
    localStorage.setItem("theme", theme);
    // Close dialog
    onOpenChange(false);
    // small reload may be necessary for some theme hooks to pick up
    // but we avoid full reload to keep UX smooth
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            User Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Notifications</Label>
              <div className="text-xs text-slate-500">Enable in-app notifications</div>
            </div>
            <Switch checked={notifications} onCheckedChange={(v) => setNotifications(Boolean(v))} />
          </div>

          <div>
            <Label className="text-sm">Default Landing Page</Label>
            <Select value={defaultPage} onValueChange={(v) => setDefaultPage(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="/">Dashboard</SelectItem>
                <SelectItem value="/ward-management">Ward Management</SelectItem>
                <SelectItem value="/kidney-transplant">Kidney Transplant</SelectItem>
                <SelectItem value="/haemodialysis">HaemoDialysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Items Per Page</Label>
            <Input type="number" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value || 10))} className="w-32" />
          </div>

          <div>
            <Label className="text-sm">Date Format</Label>
            <Select value={dateFormat} onValueChange={(v) => setDateFormat(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Theme</Label>
            <Select value={theme} onValueChange={(v) => setTheme(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings;
