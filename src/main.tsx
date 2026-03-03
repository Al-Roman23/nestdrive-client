import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "@/routes/Router";
import AuthProvider from "@/core/auth/AuthProvider";
import { ThemeProvider } from "@/core/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// This Is The Global Configuration For React Query
const queryClient = new QueryClient();

// This Is The Application Entry Point Initialization
createRoot(document.getElementById("root")!).render(
  // This Ensures Extra Rendering Checks During Development
  <StrictMode>
    {/* This Provides Global Theme Support */}
    <ThemeProvider>
      {/* This Enables Server State Management And Caching */}
      <QueryClientProvider client={queryClient}>
        {/* This Handles User Identity And Session State */}
        <AuthProvider>
          {/* This Manages Application Navigation And Routing */}
          <RouterProvider
            router={router}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
