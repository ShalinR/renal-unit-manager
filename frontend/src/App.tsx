import { Toaster } from "@/components/ui/toaster";
console.log("[BOOT] App module loaded");
import { Toaster as Sonner } from "@/components/ui/sonner";
console.log("[BOOT] App module loaded");
import React from 'react';
console.log("[BOOT] App module loaded");
import { TooltipProvider } from "@/components/ui/tooltip";
console.log("[BOOT] App module loaded");
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
console.log("[BOOT] App module loaded");
import DevErrorBoundary from "@/components/DevErrorBoundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
console.log("[BOOT] App module loaded");
import Layout from "./components/Layout";
console.log("[BOOT] App module loaded");
import PatientOverview from "./pages/PatientOverview";
console.log("[BOOT] App module loaded");
import RegisterPatient from "./pages/RegisterPatient";
console.log("[BOOT] App module loaded");
import WardManagement from "./pages/WardManagement";
console.log("[BOOT] App module loaded");
import Peritoneal from "./pages/Peritoneal";
console.log("[BOOT] App module loaded");
import HaemoDialysis from "./pages/HaemoDialysis";
console.log("[BOOT] App module loaded");
import KidneyTransplant from "./pages/KidneyTransplant";
console.log("[BOOT] App module loaded");
import Investigation from "./pages/Investigation";
console.log("[BOOT] App module loaded");
import Medications from "./pages/Medications";
console.log("[BOOT] App module loaded");
import NotFound from "./pages/NotFound";

console.log("[BOOT] App module loaded");

import { PatientProvider } from "./context/PatientContext";

console.log("[BOOT] App module loaded");

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DevErrorBoundary><BrowserRouter><Routes>
          <Route path="/" element={<Layout><PatientOverview /></Layout>} />
          <Route path="/patient-overview" element={<Layout><PatientOverview /></Layout>} />
          <Route path="/register-patient" element={<Layout><RegisterPatient /></Layout>} />
          <Route path="/ward-management" element={<Layout><WardManagement /></Layout>} />
          <Route path="/peritoneal-dialysis" element={<Layout><Peritoneal /></Layout>} />
          <Route path="/haemodialysis" element={<Layout><HaemoDialysis /></Layout>} />
          <Route path="/kidney-transplant" element={<Layout>
            <PatientProvider>
              <KidneyTransplant />
            </PatientProvider>
          </Layout>} />
          <Route path="/investigation" element={<Layout><Investigation /></Layout>} />
          <Route path="/medications" element={<Layout><Medications /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/health" element={<Layout><div style={{padding:16}}>✅ Health route is rendering.</div></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes></BrowserRouter></DevErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;




