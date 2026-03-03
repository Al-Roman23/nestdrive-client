# 🛸 NestDrive V1.0 - Private Cloud Storage (Client)

## 📌 Project Vision

**NestDrive** is a premium, full-stack private cloud storage platform designed to provide users with a secure, policy-driven workspace for their digital assets. Built with a modern **React 19** architecture, it bridges the gap between complex backend storage policies and an intuitive, hyper-responsive user interface.

This client-side application orchestrates the entire user journey—from secure multi-factor onboarding to real-time storage metrics and hierarchical asset exploration.

🌐 **Live Application:** [https://nestdrive.vercel.app/](https://nestdrive.vercel.app/)

---

## 🎯 Key Capabilities

### 🔐 Identity & Security Gateway
- **Secure Onboarding:** Full registration and login flow with dual-token (Access/Refresh) JWT strategy.
- **Identity Activation:** Email verification protocol integrated with the mail server.
- **Access Restoration:** Password recovery and reset mechanisms via secure temporal tokens.
- **Role-Based Access Control (RBAC):** Protected routes ensuring standard Users and Admins only interact with authorized namespaces.

### 📦 Hierarchical Asset Management
- **Deep Nesting Explorer:** Create, rename, and manage complex directory structures with real-time breadcrumb navigation.
- **Multi-Format Uploads:** Intelligent support for Images, Videos, Audio, and PDF assets.
- **Secure Delegation:** Modal-driven link generation for sharing assets with precise expiration controls.
- **Account Safeguards:** Built-in "Suspended" (Read-Only) and "Deactivated" UI states to handle administrative flags.

### 📊 Intelligence & Monitoring
- **Real-Time Usage Metrics:** Visual progress indicators for storage capacity, folder counts, and asset quotas.
- **Subscription Orchestration:** Interactive plan matrix allowing users to view tier limits and upgrade their workspace.
- **Historical Audit Log:** Comprehensive list of subscription activations and lifecycle records.

### 🛠 Administrative Command Center
- **Policy Management:** Custom dashboard for creating and fine-tuning storage tiers (Package CRUD).
- **Global Registry Audit:** Oversight of all system users with the ability to deactivate or suspend accounts.

---

## 🎨 Professional User Experience

- **Responsive Architecture:** Perfectly optimized for high-density displays (Retina) and mobile devices.
- **Hyper-Modern Design:** Glassmorphism-inspired UI with backdrop blurs, border gradients, and persistent dark-mode aesthetics.
- **Fluid Interactions:** CSS-driven animations and state-aware transitions for a premium application feel.
- **Contextual Notifications:** Real-time feedback via intelligent alerts for file operations and security events.

---

## 🛠 Tech Stack

### Frontend Core
- **React 19:** Utilizing the latest concurrent rendering features for ultra-fluid interactions.
- **Vite 6:** Next-generation frontend tooling for instantaneous development and optimized builds.
- **TypeScript:** Strict, end-to-end type safety across the entire component hierarchy.

### State & Data Orchestration
- **TanStack Query (React Query) 5:** High-performance server-state management with automatic caching and refetching.
- **React Router 7:** Advanced client-side routing with nested layouts and sophisticated auth guards.
- **Axios & Interceptors:** Centralized API communication with automated Bearer token injection and silent-refresh logic.

### Design System
- **Tailwind CSS 4:** Utility-first styling for a rapid, perfectly consistent design system.
- **Lucide React:** A high-fidelity, consistent iconography registry.
- **Glassmorphism 2.0:** Deeply layered cards with backdrop filtering for a premium software aesthetic.

---

## 🚀 Installation & Local Baseline

Initialize the secure workspace on your machine.

### Prerequisites
- Node.js (v18.0+)
- npm / pnpm / yarn
- Active NestDrive Backend API URL

### 1. Clone & Entry
```bash
git clone https://github.com/Al-Roman23/nestdrive-client.git
cd nestdrive-client
```

### 2. Dependency Resolution
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` in the root directory:

```env
# API Gateway Target
VITE_API_BASE_URL="http://localhost:3000/api/v1"
```

### 4. Run Development Tunnel
```bash
npm run dev
```
The workspace will be active on `http://localhost:5173`.

### 5. Production Optimization
```bash
npm run build
```

---

## 📂 Project Structure Hierarchy

```
src/
├── assets/          # Brand artifacts and static imagery
├── components/      # Atomic UI units (Buttons, Modals, Cards)
├── core/            # Infrastructure logic (Auth Context, API Interceptors)
├── layouts/         # Page shells (AuthLayout, DashboardLayout)
├── pages/           # Dynamic user views
│   ├── auth/        # Login, Register, Recovery flows
│   ├── dashboard/   # Explorer, Subscriptions, Profile
│   ├── admin/       # Policy creation and user management
│   └── public/      # Public shared files
├── routes/          # Navigation and security-filtered definitions
└── index.css        # Global CSS tokens and Tailwind utilities
└── main.tsx         # Application entry point
```

---

## 🔗 Related Registry

- **Server Repository:** [Al-Roman23/nestdrive-server](https://github.com/Al-Roman23/nestdrive-server)
- **Live Ecosystem:** [https://nestdrive.vercel.app/](https://nestdrive.vercel.app/)

---

## 👨‍💻 Primary Developer

**Muhammad Al-Roman Molla**  
*Backend-Focused Full Stack Engineer | System Architect*

- **Email:** alromanmolla@gmail.com
- **LinkedIn:** [al-roman](https://www.linkedin.com/in/al-roman/)
- **Phone:** 01319694957

---

*"Architecting secure bridges between data and users."* — **Made with ❤️ by Muhammad Al-Roman Molla**
