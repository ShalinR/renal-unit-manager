import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import React, { Suspense, lazy } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { FullPageSpinner } from "@/components/ui/spinner";
import { ProtectedRoute } from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
//const RegisterPatient = lazy(() => import("./pages/RegisterPatient"));
const WardManagement = lazy(() => import("./pages/WardManagement"));
const Peritoneal = lazy(() => import("./pages/Peritoneal"));
const HaemoDialysis = lazy(() => import("./pages/HaemoDialysis"));
const KidneyTransplant = lazy(() => import("./pages/KidneyTransplant"));
const Investigation = lazy(() => import("./pages/Investigation"));
const PDInvestigation = lazy(() => import("./pages/PDInvestigation"));
const KTInvestigation = lazy(() => import("./pages/KTInvestigation"));
const HDInvestigation = lazy(() => import("./pages/HDInvestigation"));
const Medications = lazy(() => import("./pages/Medications"));
const AdminFeedback = lazy(() => import("./pages/AdminFeedback"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { PatientProvider } from "./context/PatientContext";
import { DonorProvider } from "./context/DonorContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PatientProvider>
          <DonorProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<FullPageSpinner />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Navigate to="/kidney-transplant" replace />} />
                  {/* Backward compatibility: redirect old dialysis route */}
                  <Route path="/dialysis" element={<Navigate to="/haemodialysis" replace />} />
                  
                  <Route 
                    path="/ward-management" 
                    element={
                      <ProtectedRoute>
                        <Layout><WardManagement /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/peritoneal-dialysis" 
                    element={
                      <ProtectedRoute>
                        <Layout><Peritoneal /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/haemodialysis" 
                    element={
                      <ProtectedRoute>
                        <Layout><HaemoDialysis /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/kidney-transplant" 
                    element={
                      <ProtectedRoute>
                        <Layout><KidneyTransplant /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/investigation" 
                    element={
                      <ProtectedRoute>
                        <Layout><Investigation /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/investigation/pd" 
                    element={
                      <ProtectedRoute>
                        <Layout><PDInvestigation /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/investigation/kt" 
                    element={
                      <ProtectedRoute>
                        <Layout><KTInvestigation /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/investigation/hd" 
                    element={
                      <ProtectedRoute>
                        <Layout><HDInvestigation /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/investigation/monthly-review/:monthlyReviewId" 
                    element={
                      <ProtectedRoute>
                        <Layout><HDInvestigation /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/medications" 
                    element={
                      <ProtectedRoute>
                        <Layout><Medications /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/feedback" 
                    element={
                      <ProtectedRoute>
                        <Layout><AdminFeedback /></Layout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </DonorProvider>
        </PatientProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;