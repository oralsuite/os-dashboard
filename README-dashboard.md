# Dashboard - OralSuite

Aplicación principal para odontólogos y laboratorios.

## URL
- Desarrollo: `http://localhost:3100`
- Producción: `https://app.oralsuite.com`

## Puerto
`3100`

## Propósito

Aplicación web donde los usuarios (odontólogos y laboratorios) gestionan órdenes, pacientes y se comunican en tiempo real.

## Roles y Vistas

### Odontólogo (DENTIST)
- Crear y enviar órdenes a laboratorios
- Gestionar pacientes
- Ver estado de sus órdenes
- Chat con laboratorios

### Laboratorio (LABORATORY)
- Recibir órdenes de odontólogos
- Actualizar estado de trabajos
- Chat con odontólogos
- Ver historial de órdenes

### Administrador (ADMIN)
- Gestión de usuarios
- Reportes y métricas
- Configuraciones del sistema

## Estructura

```
dashboard/
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Redirect a /dashboard o /auth/login
│   │   ├── globals.css
│   │   │
│   │   ├── auth/                   # Rutas públicas (sin auth)
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   ├── page.tsx        # Selección de tipo
│   │   │   │   ├── dentist/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── laboratory/
│   │   │   │       └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   │
│   │   └── (protected)/            # Rutas protegidas (requieren auth)
│   │       ├── layout.tsx          # Layout con sidebar y header
│   │       │
│   │       ├── dashboard/
│   │       │   └── page.tsx        # Dashboard principal
│   │       │
│   │       ├── orders/
│   │       │   ├── page.tsx        # Lista de órdenes
│   │       │   ├── new/
│   │       │   │   └── page.tsx    # Crear orden
│   │       │   └── [id]/
│   │       │       ├── page.tsx    # Detalle de orden
│   │       │       └── edit/
│   │       │           └── page.tsx
│   │       │
│   │       ├── patients/           # Solo odontólogos
│   │       │   ├── page.tsx
│   │       │   ├── new/
│   │       │   │   └── page.tsx
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       │
│   │       ├── chat/
│   │       │   ├── page.tsx        # Lista de conversaciones
│   │       │   └── [conversationId]/
│   │       │       └── page.tsx    # Chat individual
│   │       │
│   │       ├── profile/
│   │       │   └── page.tsx
│   │       │
│   │       └── settings/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                     # Componentes base
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   ├── Table/
│   │   │   ├── Badge/
│   │   │   ├── Avatar/
│   │   │   ├── Spinner/
│   │   │   └── Toast/
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── SidebarItem.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── UserMenu.tsx
│   │   │   └── Breadcrumb/
│   │   │
│   │   ├── features/
│   │   │   ├── orders/
│   │   │   │   ├── OrderForm.tsx
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   ├── OrderStatus.tsx
│   │   │   │   ├── OrderTimeline.tsx
│   │   │   │   ├── OrderFilters.tsx
│   │   │   │   └── OrderItemForm.tsx
│   │   │   │
│   │   │   ├── patients/
│   │   │   │   ├── PatientForm.tsx
│   │   │   │   ├── PatientCard.tsx
│   │   │   │   └── PatientSearch.tsx
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── ConversationList.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   └── TypingIndicator.tsx
│   │   │   │
│   │   │   └── auth/
│   │   │       ├── LoginForm.tsx
│   │   │       ├── RegisterForm.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   │
│   │   └── providers/
│   │       ├── AuthProvider.tsx
│   │       ├── SocketProvider.tsx
│   │       └── QueryProvider.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useOrders.ts
│   │   ├── usePatients.ts
│   │   ├── useChat.ts
│   │   ├── useSocket.ts
│   │   └── useDebounce.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts           # Axios configurado
│   │   │   ├── auth.api.ts
│   │   │   ├── orders.api.ts
│   │   │   ├── patients.api.ts
│   │   │   └── chat.api.ts
│   │   │
│   │   ├── socket/
│   │   │   └── socket-client.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── format-date.ts
│   │   │   ├── format-currency.ts
│   │   │   └── cn.ts               # className merger
│   │   │
│   │   └── constants/
│   │       ├── routes.ts
│   │       └── order-status.ts
│   │
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── order.types.ts
│   │   ├── patient.types.ts
│   │   ├── chat.types.ts
│   │   └── api.types.ts
│   │
│   └── store/
│       ├── auth.store.ts
│       ├── orders.store.ts
│       └── chat.store.ts
│
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Inicialización

```bash
# Crear proyecto
pnpm create next-app dashboard --typescript --tailwind --app --src-dir --no-eslint

cd dashboard

# Instalar dependencias
pnpm add zustand                          # Estado global
pnpm add @tanstack/react-query            # Data fetching
pnpm add axios                            # HTTP client
pnpm add socket.io-client                 # WebSocket
pnpm add react-hook-form @hookform/resolvers zod  # Formularios
pnpm add lucide-react                     # Iconos
pnpm add clsx tailwind-merge              # Utilidades CSS
pnpm add date-fns                         # Manejo de fechas
```

## Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3003
```

## Ejemplo: Auth Store (Zustand)

```typescript
// src/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  role: 'DENTIST' | 'LABORATORY' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

## Ejemplo: API Client

```typescript
// src/lib/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

## Ejemplo: Socket Provider

```typescript
// src/components/providers/SocketProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
```

## Scripts

```json
{
  "scripts": {
    "dev": "next dev -p 3100",
    "build": "next build",
    "start": "next start -p 3100",
    "lint": "next lint"
  }
}
```

## Notas

- El layout `(protected)` verifica autenticación
- Usar React Query para cache de datos del servidor
- Zustand solo para estado del cliente (auth, UI)
- Socket.io para chat en tiempo real
