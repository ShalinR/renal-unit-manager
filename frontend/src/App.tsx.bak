import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PatientOverview from "./pages/PatientOverview";
import RegisterPatient from "./pages/RegisterPatient";
import WardManagement from "./pages/WardManagement";
import Peritoneal from "./pages/Peritoneal";
import HaemoDialysis from "./pages/HaemoDialysis";
import KidneyTransplant from "./pages/KidneyTransplant";
import Investigation from "./pages/Investigation";
import Medications from "./pages/Medications";
import NotFound from "./pages/NotFound";

import { PatientProvider } from "./context/PatientContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
