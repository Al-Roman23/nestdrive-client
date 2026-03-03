import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import AdminGuard from "@/core/auth/AdminGuard";
import AdminUsersPage from "@/pages/admin/UsersPage";
import AdminPackagesPage from "@/pages/admin/PackagesPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import FilesPage from "@/pages/dashboard/FilesPage";
import SharedPage from "@/pages/dashboard/SharedPage";
import SubscriptionsPage from "@/pages/dashboard/SubscriptionsPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";

// This Is The Central Router Configuration
export const router = createBrowserRouter([
    // These Are The Public Facing Routes
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: HomePage
            },
            // Additional Public Routes Like About Or Pricing Will Go Here
        ],
    },

    // These Are The Core Authentication Routes Integrated With Auth Layout
    {
        path: "/",
        Component: AuthLayout,
        children: [
            {
                path: "login",
                Component: LoginPage
            },
            {
                path: "register",
                Component: RegisterPage
            },
            {
                path: "verify-email",
                Component: VerifyEmailPage
            },
            {
                path: "forgot-password",
                Component: ForgotPasswordPage
            },
            {
                path: "reset-password",
                Component: ResetPasswordPage
            },
        ],
    },

    // These Are The Protected Dashboard Routes
    {
        path: "dashboard",
        Component: DashboardLayout,
        children: [
            {
                index: true,
                Component: DashboardPage
            },
            {
                path: "files",
                Component: FilesPage
            },
            {
                path: "shared",
                Component: SharedPage
            },
            {
                path: "subscriptions",
                Component: SubscriptionsPage
            },
            {
                path: "profile",
                Component: ProfilePage
            },
            // Administrators Exclusive Command Center Section
            {
                path: "admin",
                Component: AdminGuard,
                children: [
                    {
                        path: "users",
                        Component: AdminUsersPage
                    },
                    {
                        path: "packages",
                        Component: AdminPackagesPage
                    }
                ]
            }
        ],
    },
]);
