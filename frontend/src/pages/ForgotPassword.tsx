import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>If you've forgotten your password</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
            For security reasons, password resets are managed by the system administrator.
            Please contact your administrator to reset your account password.
          </p>

          <div className="flex gap-3">
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">Back to login</Button>
            </Link>
            <a href="mailto:it-support@hospital.local" className="w-full">
              <Button className="w-full">Contact IT</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
