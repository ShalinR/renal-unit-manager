import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import React, { Suspense, lazy } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { FullPageSpinner } from "@/components/ui/spinner";

const PatientOverview = lazy(() => import("./pages/PatientOverview"));
const RegisterPatient = lazy(() => import("./pages/RegisterPatient"));
const WardManagement = lazy(() => import("./pages/WardManagement"));
const Peritoneal = lazy(() => import("./pages/Peritoneal"));
const HaemoDialysis = lazy(() => import("./pages/HaemoDialysis"));
const KidneyTransplant = lazy(() => import("./pages/KidneyTransplant"));
const Investigation = lazy(() => import("./pages/Investigation"));
const Medications = lazy(() => import("./pages/Medications"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { PatientProvider } from "./context/PatientContext";
import { DonorProvider } from "./context/DonorContext"; // Import DonorProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PatientProvider>
        <DonorProvider> {/* Add DonorProvider here */}
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<FullPageSpinner />}>
              <Routes>
                <Route path="/" element={<Layout><PatientOverview /></Layout>} />
                <Route path="/patient-overview" element={<Layout><PatientOverview /></Layout>} />
                <Route path="/register-patient" element={<Layout><RegisterPatient /></Layout>} />
                <Route path="/ward-management" element={<Layout><WardManagement /></Layout>} />
                <Route path="/peritoneal-dialysis" element={<Layout><Peritoneal /></Layout>} />
                <Route path="/haemodialysis" element={<Layout><HaemoDialysis /></Layout>} />
                <Route path="/kidney-transplant" element={<Layout><KidneyTransplant /></Layout>} />
                <Route path="/investigation" element={<Layout><Investigation /></Layout>} />
                <Route path="/medications" element={<Layout><Medications /></Layout>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </DonorProvider> {/* Close DonorProvider */}
      </PatientProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;