# Blog App (Frontend)

A modern, accessible blog frontend built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**.  
This client focuses on clean UI composition, accessibility, and long-term maintainability.

---

## 🌐 Overview

- **Framework:** Next.js 16.1.1  
- **UI Library:** React 19.2.3  
- **Styling:** Tailwind CSS 4  
- **Language:** TypeScript  
- **Component System:** Radix UI  
- **Icons:** Lucide React  
- **Theming:** Light / Dark mode via `next-themes`  
- **Linting:** ESLint with Next.js configuration  

This repository is private and intended for controlled or internal use.

---

## 🛠️ Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide React

### Utilities
- clsx
- tailwind-merge
- class-variance-authority
- tw-animate-css

### Tooling
- ESLint
- PostCSS
- Type definitions for Node and React

---

## 📁 Project Structure

```
next-blog-client/
├─ src/
│  ├─ app/
│  │  ├─ (commonLayout)/
│  │  │  ├─ about/
│  │  │  │  ├─ error.tsx
│  │  │  │  ├─ loading.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ blogs/
│  │  │  │  └─ page.tsx
│  │  │  ├─ contact/
│  │  │  │  ├─ branch/
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ login/
│  │  │  │  └─ page.tsx
│  │  │  ├─ register/
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ (dashboardLayout)/
│  │  │  ├─ @admin/
│  │  │  │  ├─ admin-dashboard/
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ default.tsx
│  │  │  ├─ @user/
│  │  │  │  ├─ dashboard/
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ default.tsx
│  │  │  └─ layout.tsx
│  │  ├─ (practice)/
│  │  │  ├─ @marketingSlot/
│  │  │  │  ├─ marketing/
│  │  │  │  │  ├─ settings/
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ default.tsx
│  │  │  ├─ @salesSlot/
│  │  │  │  ├─ sales/
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ default.tsx
│  │  │  ├─ development/
│  │  │  │  └─ page.tsx
│  │  │  ├─ testing/
│  │  │  │  └─ page.tsx
│  │  │  ├─ default.tsx
│  │  │  └─ layout.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ not-found.tsx
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ app-sidebar.tsx
│  │  │  ├─ ModeToggle.tsx
│  │  │  ├─ Navbar.tsx
│  │  │  ├─ search-form.tsx
│  │  │  └─ version-switcher.tsx
│  │  └─ ui/
│  │     ├─ accordion.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ navigation-menu.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     └─ tooltip.tsx
│  ├─ hooks/
│  │  └─ use-mobile.ts
│  ├─ lib/
│  │  └─ utils.ts
│  ├─ providers/
│  │  └─ ThemeProvider.tsx
│  ├─ routes/
│  │  ├─ adminRoutes.ts
│  │  └─ userRoutes.ts
│  └─ types/
│     ├─ index.ts
│     └─ routes.type.ts
├─ .gitignore
├─ components.json
├─ eslint.config.mjs
├─ next-env.d.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ postcss.config.mjs
├─ README.md
└─ tsconfig.json

```

---

## 🚀 Setup & Installation

### Clone

```
git clone <repository-url>
cd blog-site-client
```

### Install

```
pnpm or npm install
```

---

## ▶️ Development

```
npm run dev
```

http://localhost:3000

---

## 📦 Production

```
npm run build
npm run start
```

---

## 📜 Scripts

- dev
- build
- start
- lint

---

## 🎨 Styling

- Tailwind CSS as primary styling system
- CVA for variants
- tailwind-merge for class safety
- tw-animate-css for animations

---

## 🌗 Theming

- Light / Dark / System themes
- next-themes handles persistence
- SSR-safe

---

## 🔐 Environment Variables

`.env.local`

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=Blog Site
```

---

## 🚢 Deployment

Recommended: Vercel

Steps:
1. Push to GitHub
2. Import to Vercel
3. Set env vars
4. Deploy

---