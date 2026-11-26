# LocalLift — Your Business. Our Digital Drive.

LocalLift is a full-featured web application prototype for a digital growth agency platform designed to help small and local businesses establish and expand their digital presence across websites, social media, local SEO, branding, and online platform onboarding.

---

## Application Environments

1. **Public Website** (`/`, `/about`, `/services`, `/our-work`, `/contact`, `/login`, `/signup`)
   - Interactive **Services & Custom Package Builder** with predefined **Starter**, **Growth**, and **Premium** combinations (no fabricated pricing) and a validated **Business Enquiry Form**.
   - **Our Work** portfolio page displaying a clean empty state until verified completed projects are published by the Admin.
   - **Contact & Help** page with General Enquiry / Business Support toggle, FAQ accordion, and placeholder contact details.

2. **Client Portal** (`/client/dashboard`, `/client/projects`, `/client/updates`, `/client/settings`)
   - Scoped strictly to the signed-in client account.
   - Displays active/completed projects, selected services, real-time milestone progress (computed from actual milestone statuses across 7 standard stages), pending requirements, project updates, notifications, and profile settings.

3. **Private Admin Dashboard** (`/admin/dashboard`, `/admin/enquiries`, `/admin/clients`, `/admin/projects`, `/admin/team`, `/admin/services`, `/admin/reports`, `/admin/settings`)
   - Hidden from public navigation and protected by role-based route guards.
   - Live metrics calculated from `localStorage`, enquiry review and one-click conversion into tracked projects, client profile inspection, full project/milestone management, team member accounts & assignments, dynamic service catalog management, reports, and **Reset Demo Data**.

4. **Team Member Workspace** (`/team/dashboard`, `/team/projects`)
   - Focused workspace showing assigned projects, requirements, deadlines, milestone progress updates, "Submit for Admin Review" workflow, and internal/client progress notes without unrestricted admin permissions.

---

## Installation & Run Instructions

### Prerequisites
- Node.js 18+
- npm

### Setup & Development
```bash
npm install
npm run dev
```

*(On Windows PowerShell if script execution policies restrict `npm.ps1`, use `npm.cmd install` and `npm.cmd run dev`.)*

### Production Build Check
```bash
npm run build
```

---

## Demo Login Credentials

Use the **One-Click Role Switching** panel on `/login` or sign in manually:

| Role | Email | Password | Sample Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@locallift.demo` | `Admin123!` | Full Agency Operations |
| **Client** | `client@locallift.demo` | `Client123!` | Sunrise Café |
| **Team Member** | `team@locallift.demo` | `Team123!` | Aarav Mehta (Assigned Projects) |

---

## Prototype Limitations & Future Backend Notes

- **Local Persistence Only**: All data (users, enquiries, projects, milestones, services, updates, notifications, and portfolio items) is stored in browser `localStorage` (`locallift_prototype_db_v1`). Clearing browser storage resets data, or use **Admin → Settings → Reset Demo Data**.
- **Simulated Authentication**: Email/password, Google Demo Login, and Phone OTP Login are local prototype simulations for presentation purposes only—they do not connect to live Google OAuth, SMS OTP providers, or production password hashing.
- **Future Backend Integration (e.g., Supabase)**: Repository functions are cleanly isolated inside `src/services/storageService.ts` and consumed via `src/context/AppContext.tsx`. To migrate to Supabase, replace the synchronous `localStorage` functions with Supabase Auth, Row-Level Security (RLS) policies per user role (`admin`, `team`, `client`), and PostgreSQL queries.
