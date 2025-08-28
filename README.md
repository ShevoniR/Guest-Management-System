# Hotel Guest Management System

This is a **Hotel Guest Management** web application built using:

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: PocketBase

The system allows hotel staff to manage guest records with full CRUD operations:

- View Guest List (full screen)
- Add / Edit Guest (via modal form)
- Delete Guest (via modal confirmation)

---

## 🚀 Features

- Guest list displayed in a responsive table (full screen).
- Add new guest using `+ New Guest` button (opens modal).
- Edit guest record using the same modal form.
- Delete guest confirmation via modal.
- PocketBase admin dashboard for backend management.

---

## 📦 Project Setup

### 1. Clone Repository

-git clone https://github.com/your-username/hotel-guest-management.git
-cd hotel-guest-management

### 2. Backend Setup

-Download PocketBase
-PocketBase Releases
-Place the pocketbase.exe (or binary) inside the /server directory.
-Start PocketBase - ./pocketbase serve
-Access Admin Dashboard
--Admin Email:shevonirogers1915@gmail.com
--Admin Password: KbscQ!!rgZvy89c

### 3. Frontend Setup

-install dependencies - npm install
-Run Development Server - npm run dev

### 4. Project structure

hotel-guest-management/
│
├── server/ # PocketBase backend
│ └── pocketbase.exe
│
├── frontend/ # Next.js frontend
│ ├── components/
│ │ ├── GuestList.tsx # Displays guest list + modals
│ │ ├── GuestFormModal.tsx
│ │ └── DeleteGuestModal.tsx
│ ├── lib/
│ │ └── pocketbase.ts # PocketBase client config
│ └── pages/
│ └── index.tsx # Main entry
│
└── README.md
