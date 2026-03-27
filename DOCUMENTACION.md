# 📘 DOCUMENTACIÓN COMPLETA — JoshTVR Portfolio
### Guía de aprendizaje desde cero: cómo construir un portafolio full-stack profesional

> **Para quién es esta guía:** Para alguien que nunca ha programado, o que está comenzando. Cada concepto se explica desde sus bases, con analogías, diagramas y ejemplos reales del código de este proyecto.

---

## ÍNDICE

1. [¿Qué estamos construyendo?](#1-qué-estamos-construyendo)
2. [Conceptos fundamentales antes de comenzar](#2-conceptos-fundamentales)
3. [Las herramientas que usamos](#3-las-herramientas-que-usamos)
4. [Estructura del proyecto](#4-estructura-del-proyecto)
5. [Configuración inicial desde cero](#5-configuración-inicial-desde-cero)
6. [El sistema de diseño (colores, temas, estilos)](#6-el-sistema-de-diseño)
7. [Componentes: las piezas del rompecabezas](#7-componentes)
8. [Las páginas públicas](#8-las-páginas-públicas)
9. [Autenticación: cómo funciona el inicio de sesión](#9-autenticación)
10. [La base de datos con Supabase](#10-la-base-de-datos)
11. [El panel de administración](#11-el-panel-de-administración)
12. [Gráficos 3D con Three.js](#12-gráficos-3d)
13. [Dos idiomas: inglés y español](#13-internacionalización)
14. [La tienda y pagos con Stripe](#14-la-tienda-y-pagos)
15. [Despliegue en Vercel](#15-despliegue-en-vercel)
16. [Variables de entorno explicadas](#16-variables-de-entorno)
17. [Flujo completo de datos](#17-flujo-completo-de-datos)
18. [Solución de problemas comunes](#18-solución-de-problemas-comunes)
19. [Glosario técnico](#19-glosario-técnico)

---

## 1. ¿Qué estamos construyendo?

### La visión general

Imagina que eres un arquitecto y quieres mostrar tu trabajo al mundo. Construyes una sala de exposiciones: una entrada impresionante, galerías con tus proyectos, una oficina donde los clientes pueden pedir servicios, una tienda de recuerdos, y en la parte de atrás, una oficina privada donde solo tú puedes entrar para administrar todo.

Eso es exactamente lo que este proyecto es: **un portafolio digital profesional** con todas esas partes.

```
┌─────────────────────────────────────────────────────────────────┐
│                     JOSHTVR.COM                                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ÁREA PÚBLICA (cualquiera puede verla)                    │   │
│  │                                                            │   │
│  │  🏠 Inicio     → Presentación, habilidades, proyectos     │   │
│  │  🛠️ Servicios  → Formulario para contratar a Joshua        │   │
│  │  🛍️ Tienda     → Productos digitales y físicos             │   │
│  │  📦 Mis Órdenes → Historial de compras del usuario         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ÁREA PRIVADA (solo Joshua puede entrar)                  │   │
│  │                                                            │   │
│  │  🔐 /admin     → Panel de control total                   │   │
│  │     Proyectos, Servicios, Tienda, Órdenes, Consultas      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### ¿Qué puede hacer este sitio?

| Función | ¿Quién la usa? | ¿Cómo funciona? |
|---------|---------------|-----------------|
| Ver el portafolio | Visitantes | Páginas estáticas/dinámicas |
| Cambiar idioma EN/ES | Visitantes | next-intl |
| Modo claro/oscuro | Visitantes | CSS variables |
| Iniciar sesión | Usuarios registrados | Supabase Auth |
| Ver órdenes | Usuarios registrados | Base de datos |
| Contratar servicios | Visitantes | Formulario → Supabase |
| Comprar en tienda | Usuarios registrados | Stripe Checkout |
| Gestionar contenido | Solo Joshua (admin) | Panel /admin |
| Subir imágenes | Solo Joshua (admin) | Supabase Storage |

---

## 2. Conceptos fundamentales

> Antes de ver el código, necesitas entender estas ideas. Son como el abecedario antes de leer.

### 2.1 ¿Qué es una página web?

Cuando abres `joshtvr.com` en tu navegador, tu computadora le pide a otro computadora (llamado **servidor**) que le mande un archivo. Ese archivo contiene instrucciones escritas en 3 lenguajes:

```
HTML  →  La ESTRUCTURA  (como los huesos del cuerpo)
CSS   →  El ESTILO      (como la ropa y apariencia)
JS    →  El COMPORTAMIENTO (como los músculos que mueven todo)
```

**Ejemplo real:**

```html
<!-- HTML: esto crea un botón -->
<button class="btn-amarillo" onclick="saludar()">
  Haz clic aquí
</button>
```

```css
/* CSS: esto lo hace amarillo y redondo */
.btn-amarillo {
  background-color: #facc15;
  border-radius: 8px;
  padding: 12px 24px;
}
```

```javascript
// JS: esto hace que pase algo al hacer clic
function saludar() {
  alert("¡Hola mundo!")
}
```

### 2.2 ¿Qué es React?

**React** es una forma más inteligente de escribir páginas web. En lugar de escribir HTML puro, escribes **componentes** — piezas reutilizables de interfaz.

Piénsalo así: en lugar de dibujar 100 veces el mismo botón, defines el botón UNA VEZ y lo usas 100 veces.

```jsx
// Defines el componente una vez
function Boton({ texto, color }) {
  return (
    <button style={{ background: color }}>
      {texto}
    </button>
  )
}

// Lo usas cuantas veces quieras
<Boton texto="Ver Proyectos" color="#facc15" />
<Boton texto="Contáctame"   color="transparent" />
```

### 2.3 ¿Qué es Next.js?

**Next.js** es una capa encima de React que agrega superpoderes:

```
React puro:        Solo el navegador hace el trabajo
Next.js:           El SERVIDOR también puede hacer trabajo
```

¿Por qué importa? Porque cuando el servidor prepara la página antes de mandártela:
- La página carga más rápido ✅
- Google puede leerla y posicionarla mejor (SEO) ✅
- Puedes hacer cosas seguras que no se muestran al usuario ✅

**En este proyecto usamos Next.js 14 con "App Router"** — que es la forma más moderna de organizar las páginas.

### 2.4 ¿Qué es TypeScript?

**TypeScript** es JavaScript con un sistema de "tipos" — como etiquetas que le dicen a tu código qué tipo de dato espera.

```typescript
// JavaScript normal — cualquier cosa puede pasar
function sumar(a, b) {
  return a + b
}
sumar("hola", "mundo")  // "holamundo" — no es lo que querías

// TypeScript — el editor te avisa del error antes de correr el código
function sumar(a: number, b: number): number {
  return a + b
}
sumar("hola", "mundo")  // ❌ ERROR: debes pasar números, no texto
```

### 2.5 ¿Qué es una base de datos?

Una base de datos es como un Excel gigante y organizado en el que puedes guardar, buscar, actualizar y borrar información.

```
┌─────────────────────────────────────────────────────┐
│  Tabla: projects                                      │
├──────┬──────────────────────┬───────────┬───────────┤
│  id  │  title               │ category  │ published │
├──────┼──────────────────────┼───────────┼───────────┤
│  1   │ "Sistema VR Médico"  │ "vr"      │ true      │
│  2   │ "App de ML para..."  │ "ai"      │ true      │
│  3   │ "Proyecto secreto"   │ "backend" │ false     │
└──────┴──────────────────────┴───────────┴───────────┘
```

En este proyecto usamos **Supabase**, que es una base de datos PostgreSQL con una interfaz web amigable.

### 2.6 ¿Qué es una API?

Una **API** (Application Programming Interface) es como un mesero en un restaurante:

```
TÚ (el navegador)    →  "Quiero la lista de proyectos"
MESERO (la API)      →  Va a la cocina (base de datos)
COCINA (Supabase)    →  Prepara los datos
MESERO (la API)      →  Te trae la respuesta
TÚ (el navegador)    →  Muestra los proyectos en pantalla
```

Las APIs se comunican usando **URLs especiales**. Por ejemplo:

```
GET  /api/projects        → Obtener todos los proyectos
POST /api/inquiries       → Enviar una consulta de servicio
POST /api/stripe/checkout → Iniciar un pago
```

### 2.7 ¿Qué es la autenticación?

"Autenticación" es el proceso de verificar quién eres. Es como mostrar tu identificación en la entrada de un club.

```
Usuario           Servidor
   │                  │
   │── "Soy Joshua" ──▶│
   │                  │── Verifica en GitHub OAuth
   │                  │◀─ "Sí, es JoshTVR confirmado"
   │◀── Token ─────────│
   │                  │
   │── [Con el token] ─▶│
   │── "Dame el admin" ─▶│
   │                  │── "Token válido + es admin ✓"
   │◀── Panel admin ───│
```

En este proyecto hay DOS tipos de autenticación:
- **Admin** (solo Joshua): GitHub OAuth con verificación de username
- **Usuarios normales**: Email/contraseña, Google OAuth, o GitHub OAuth

---

## 3. Las herramientas que usamos

### Stack tecnológico completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    STACK TECNOLÓGICO                             │
│                                                                  │
│  FRONTEND (lo que el usuario ve)                                 │
│  ├── Next.js 14 (App Router)  → Framework principal             │
│  ├── React 18                 → Biblioteca de UI                 │
│  ├── TypeScript               → JavaScript tipado                │
│  ├── Tailwind CSS             → Estilos utilitarios              │
│  ├── Three.js + R3F           → Gráficos 3D                     │
│  └── next-intl                → Traducción EN/ES                 │
│                                                                  │
│  BACKEND (lo que pasa en el servidor)                            │
│  ├── Next.js Server Actions   → Funciones del servidor           │
│  ├── Next.js API Routes       → Endpoints HTTP                   │
│  └── Supabase (PostgreSQL)    → Base de datos + Auth + Storage   │
│                                                                  │
│  PAGOS                                                           │
│  └── Stripe                   → Checkout seguro                  │
│                                                                  │
│  DESPLIEGUE                                                      │
│  ├── Vercel                   → Hosting del sitio                │
│  └── Supabase Cloud           → Hosting de la base de datos      │
└─────────────────────────────────────────────────────────────────┘
```

### ¿Por qué elegimos cada herramienta?

| Herramienta | Alternativas | ¿Por qué esta? |
|-------------|-------------|----------------|
| Next.js | Vite, Create React App | Servidor + cliente, SEO, App Router moderno |
| Supabase | Firebase, PlanetScale | SQL real, gratis, auth incluido |
| Tailwind | Bootstrap, CSS puro | Estilos directamente en el componente |
| Stripe | PayPal, MercadoPago | El estándar de la industria para pagos |
| Vercel | Netlify, Railway | Hecho por los creadores de Next.js |
| Three.js | Babylon.js | La más popular para 3D en web |

### Versiones exactas del proyecto

```json
{
  "next": "14.x",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "@react-three/fiber": "8.x",
  "@react-three/drei": "9.x",
  "three": "0.160.x",
  "@supabase/ssr": "latest",
  "next-intl": "3.x",
  "stripe": "14.x",
  "@tiptap/react": "2.x"
}
```

---

## 4. Estructura del proyecto

### La carpeta del proyecto explicada

Cuando abres la carpeta `JoshTVR-Portfolio`, ves esto:

```
JoshTVR-Portfolio/
│
├── 📁 app/                    ← El corazón del proyecto (páginas y rutas)
│   ├── 📄 layout.tsx          ← Envoltura raíz de TODA la app
│   ├── 📄 globals.css         ← Estilos globales (colores, variables)
│   ├── 📁 [locale]/           ← Páginas públicas (en/ o es/)
│   │   ├── 📄 page.tsx        ← Página de inicio (joshtvr.com)
│   │   ├── 📄 layout.tsx      ← Envoltura con navbar y footer
│   │   ├── 📁 services/       ← joshtvr.com/services
│   │   ├── 📁 store/          ← joshtvr.com/store
│   │   └── 📁 orders/         ← joshtvr.com/orders
│   ├── 📁 admin/              ← Panel de administración (/admin)
│   │   ├── 📄 page.tsx        ← Dashboard del admin
│   │   ├── 📄 layout.tsx      ← Sidebar de navegación
│   │   ├── 📁 login/          ← Página de login del admin
│   │   ├── 📁 projects/       ← CRUD de proyectos
│   │   ├── 📁 services/       ← CRUD de servicios
│   │   ├── 📁 store/          ← CRUD de productos
│   │   ├── 📁 orders/         ← Ver órdenes
│   │   ├── 📁 inquiries/      ← Ver consultas
│   │   └── 📁 settings/       ← Configuración global
│   └── 📁 api/                ← Endpoints HTTP
│       ├── 📁 auth/           ← Callbacks de login
│       ├── 📁 inquiries/      ← Recibir consultas
│       ├── 📁 stripe/         ← Checkout y webhook
│       └── 📁 github/         ← Stats de GitHub
│
├── 📁 components/             ← Piezas reutilizables de UI
│   ├── 📁 layout/             ← Navbar, Footer, AdminSidebar
│   ├── 📁 sections/           ← Hero, About, Skills, Projects...
│   ├── 📁 three/              ← Componentes 3D
│   ├── 📁 auth/               ← Modal de login, menú de usuario
│   ├── 📁 ui/                 ← ThemeToggle, LanguageToggle
│   ├── 📁 admin/              ← Formularios del admin
│   └── 📁 store/              ← Botón de checkout
│
├── 📁 lib/                    ← Funciones de utilidad
│   ├── 📁 supabase/           ← Clientes de Supabase (server, client, admin)
│   ├── 📁 stripe/             ← Funciones de Stripe
│   ├── 📁 github/             ← Cache de stats de GitHub
│   ├── 📁 i18n/               ← Configuración de idiomas
│   └── 📁 utils/              ← Utilidades generales (cn, etc.)
│
├── 📁 messages/               ← Traducciones
│   ├── 📄 en.json             ← Textos en inglés
│   └── 📄 es.json             ← Textos en español
│
├── 📁 public/                 ← Archivos estáticos (imágenes, CV)
│   └── 📁 imgs/               ← Imágenes del portafolio
│
├── 📄 middleware.ts            ← Guardia de rutas (protege /admin)
├── 📄 next.config.mjs          ← Configuración de Next.js
├── 📄 tailwind.config.ts       ← Configuración de Tailwind
├── 📄 tsconfig.json            ← Configuración de TypeScript
└── 📄 package.json             ← Lista de dependencias
```

### ¿Cómo funciona el sistema de rutas?

**El sistema de archivos ES el sistema de rutas.** Cada carpeta con un archivo `page.tsx` se convierte en una URL:

```
app/[locale]/page.tsx              →  joshtvr.com/en
app/[locale]/services/page.tsx     →  joshtvr.com/en/services
app/[locale]/store/page.tsx        →  joshtvr.com/en/store
app/[locale]/orders/page.tsx       →  joshtvr.com/en/orders
app/admin/page.tsx                 →  joshtvr.com/admin
app/admin/projects/page.tsx        →  joshtvr.com/admin/projects
```

El `[locale]` entre corchetes es un **parámetro dinámico** — significa que puede ser `en` o `es`:

```
joshtvr.com/en/services   ← versión inglés
joshtvr.com/es/services   ← versión español
```

---

## 5. Configuración inicial desde cero

> Esta sección explica cómo alguien comenzaría este proyecto desde cero en su computadora.

### 5.1 Prerequisitos

Antes de empezar, necesitas instalar:

**1. Node.js** — El motor que ejecuta JavaScript fuera del navegador
```
Descarga desde: https://nodejs.org
Elige la versión LTS (la más estable)
Verifica la instalación:
$ node --version   → v20.x.x
$ npm --version    → 10.x.x
```

**2. Git** — Sistema de control de versiones
```
Descarga desde: https://git-scm.com
Verifica:
$ git --version    → git version 2.x.x
```

**3. VS Code** — Editor de código
```
Descarga desde: https://code.visualstudio.com
Extensiones recomendadas:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
```

### 5.2 Crear el proyecto

```bash
# Crear un nuevo proyecto Next.js con TypeScript + Tailwind
npx create-next-app@latest JoshTVR-Portfolio \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false

# Entrar a la carpeta
cd JoshTVR-Portfolio
```

### 5.3 Instalar dependencias

```bash
# Supabase (base de datos y autenticación)
npm install @supabase/supabase-js @supabase/ssr

# next-intl (internacionalización EN/ES)
npm install next-intl

# Stripe (pagos)
npm install stripe @stripe/stripe-js

# Three.js (gráficos 3D)
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three

# TipTap (editor de texto enriquecido)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image

# Utilidades
npm install clsx tailwind-merge
```

### 5.4 Configurar las variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local — NUNCA subas este archivo a GitHub
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GITHUB_TOKEN=ghp_...
GITHUB_USERNAME=TuUsername
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_GITHUB_USERNAME=TuUsername
NOTIFICATION_EMAIL=tu@email.com
```

> ⚠️ **IMPORTANTE:** Las variables que empiezan con `NEXT_PUBLIC_` son visibles en el navegador. Las que NO tienen ese prefijo son secretas y solo el servidor puede verlas.

### 5.5 Correr el proyecto localmente

```bash
npm run dev
# El servidor arranca en http://localhost:3000
```

---

## 6. El sistema de diseño

### 6.1 Variables CSS: el corazón del diseño

En `app/globals.css` definimos **variables CSS** — valores reutilizables que podemos cambiar en un solo lugar para afectar todo el sitio.

**Analogía:** Es como definir el color de tu marca en un solo lugar. Si decides cambiar el amarillo por naranja, solo cambias UN valor y todo el sitio se actualiza.

```css
/* app/globals.css */

:root {
  /* El color amarillo de la marca — se usa en TODO el sitio */
  --accent: #facc15;

  /* Colores base para MODO OSCURO (el default) */
  --bg-primary:   #0a0a0a;     /* Fondo principal: casi negro */
  --bg-secondary: #111118;     /* Fondo secundario: gris muy oscuro */
  --text-primary: #f0f0f0;     /* Texto principal: blanco suave */
  --text-muted:   #888899;     /* Texto secundario: gris */

  /* El gradiente del nombre en el hero */
  --hero-gradient: linear-gradient(135deg, #fff 0%, #facc15 60%, #f59e0b 100%);

  /* Efectos de vidrio (glassmorphism) */
  --glass-bg:     rgba(255, 255, 255, 0.03);
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Cuando el modo es CLARO, sobreescribimos los valores */
[data-theme="light"] {
  --bg-primary:   #fafaf0;     /* Fondo: blanco cálido */
  --bg-secondary: #f0efe6;     /* Fondo secundario: crema */
  --text-primary: #1a1a0f;     /* Texto: casi negro */
  --text-muted:   #665f40;     /* Texto secundario: café */
  --hero-gradient: linear-gradient(135deg, #1a1a0f 0%, #d97706 100%);
  --glass-bg:     rgba(0, 0, 0, 0.03);
  --glass-border: 1px solid rgba(0, 0, 0, 0.08);
}
```

**¿Cómo se usan estas variables?** En cualquier componente, en lugar de poner el color directamente:

```css
/* ❌ Mal: si cambias el amarillo, tienes que buscarlo en 100 archivos */
color: #facc15;

/* ✅ Bien: si cambias --accent, automáticamente cambia en todo el sitio */
color: var(--accent);
```

### 6.2 El sistema de tema (Dark/Light Mode)

**¿Cómo funciona el toggle de modo claro/oscuro?**

```
Usuario hace clic en 🌙/☀️
         │
         ▼
ThemeToggle.tsx
  → Cambia el atributo data-theme en <html>
  → Lo guarda en localStorage (persiste al recargar)
         │
         ▼
<html data-theme="light">  o  <html data-theme="dark">
         │
         ▼
CSS aplica las variables correctas automáticamente
```

El componente `ThemeToggle.tsx`:

```tsx
// components/ui/ThemeToggle.tsx
'use client'  // ← Esto significa que corre en el navegador

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(true)  // Por default: modo oscuro

  // Al cargar, lee la preferencia guardada
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const isDark = saved ? saved === 'dark' : true
    setDark(isDark)
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [])

  // Al hacer clic, cambia el tema
  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme">
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
```

### 6.3 Tailwind CSS

**Tailwind** es un sistema de estilos basado en clases utilitarias. En lugar de escribir CSS separado, escribes las clases directamente en el HTML:

```tsx
// Sin Tailwind — tienes que ir al archivo CSS
<button className="mi-boton-especial">Clic</button>
// .mi-boton-especial { display: flex; padding: 12px 24px; ... }

// Con Tailwind — todo en una línea
<button className="flex items-center px-6 py-3 rounded-lg bg-yellow-400 text-black font-bold">
  Clic
</button>
```

**Clases de Tailwind más usadas en este proyecto:**

| Clase | Qué hace |
|-------|----------|
| `flex` | `display: flex` |
| `items-center` | `align-items: center` |
| `gap-4` | `gap: 16px` (4 × 4px) |
| `px-6` | padding izquierdo/derecho de 24px |
| `py-3` | padding arriba/abajo de 12px |
| `rounded-lg` | border-radius: 8px |
| `font-bold` | `font-weight: 700` |
| `text-sm` | `font-size: 14px` |
| `hidden md:flex` | oculto en móvil, flex en pantallas medianas |
| `transition-all` | transición en todas las propiedades |

### 6.4 Glassmorphism: el efecto de vidrio

El "glassmorphism" es el efecto donde los elementos parecen ser de vidrio translúcido. Lo usamos en cards, el navbar, y el contenedor 3D.

```css
/* La clase .glass en globals.css */
.glass {
  background: var(--glass-bg);           /* Fondo semitransparente */
  border: var(--glass-border);           /* Borde sutil */
  backdrop-filter: blur(20px);           /* ← El efecto de vidrio: desenfoca lo que está detrás */
  -webkit-backdrop-filter: blur(20px);   /* Para Safari */
  box-shadow: var(--glass-shadow);       /* Sombra suave */
}
```

---

## 7. Componentes

> Un componente es una pieza de interfaz reutilizable. Piénsalos como piezas de LEGO.

### 7.1 El Navbar (Barra de navegación)

**Archivo:** `components/layout/Navbar.tsx`

El Navbar es lo que aparece en la parte superior de cada página. Tiene varias responsabilidades:

```
┌──────────────────────────────────────────────────────────────┐
│ JoshTVR. │ About Skills Projects Experience Certifications   │
│          │ Contact Services Store    ☀️  EN/ES  [Sign In]    │
└──────────────────────────────────────────────────────────────┘
```

**¿Qué hace cada parte?**

```tsx
// Simplificado para entender la estructura
export function Navbar({ storeVisible = false }) {
  // Estado: ¿está el navbar con fondo? (al hacer scroll)
  const [scrolled, setScrolled] = useState(false)
  // Estado: ¿hay un usuario con sesión iniciada?
  const [hasUser, setHasUser]   = useState(false)
  // Estado: ¿está abierto el modal de login?
  const [authOpen, setAuthOpen] = useState(false)

  // Efecto: escucha el scroll para agregar fondo al navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Efecto: verifica si hay sesión activa en Supabase
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setHasUser(!!data.user))
    supabase.auth.onAuthStateChange((_, session) => {
      setHasUser(!!session?.user)
    })
  }, [])

  return (
    <nav className={scrolled ? 'con-fondo' : 'sin-fondo'}>
      {/* Logo */}
      <a href="/en">JoshTVR<span>.</span></a>

      {/* Links de navegación */}
      <ul>
        <li><a href="#about">About</a></li>
        {/* ... más links ... */}
      </ul>

      {/* Acciones: tema, idioma, y login */}
      <div>
        <ThemeToggle />
        <LanguageToggle />
        {hasUser
          ? <UserMenu />              {/* Si hay sesión: muestra avatar */}
          : <button onClick={() => setAuthOpen(true)}>Sign In</button>
        }
      </div>

      {/* Modal de login (invisible hasta que el usuario haga clic) */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  )
}
```

**Un detalle importante: los links inteligentes**

Cuando estás en la página de inicio (`/en`), el link "About" debe ir a `#about` (mismo scroll de página).
Cuando estás en `/en/services`, el link "About" debe ir a `/en#about` (volver al inicio y hacer scroll).

```tsx
const isHome = pathname === `/${locale}` || pathname === '/'

// Esta función decide la URL correcta
function href(hash: string) {
  return isHome ? `#${hash}` : `/${locale}#${hash}`
}
//         ↑ Si estás en home: solo el hash
//                              ↑ Si no: ruta completa + hash
```

### 7.2 El Hero Section

**Archivo:** `components/sections/HeroSection.tsx`

Es la primera sección que ven los visitantes. Tiene dos columnas:

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  🖼️  HI, I'M         │   ┌─────────────────┐           │
│                       │   │                 │           │
│  Joshua               │   │   🔄 GIROSCOPIO │           │
│  Hernandez            │   │      3D         │           │
│                       │   │                 │           │
│  Building [typewriter]│   └─────────────────┘           │
│                       │                                  │
│  Bio text...          │                                  │
│                       │                                  │
│  [View Projects] [→]  │                                  │
│                       │                                  │
│  🐙 💼 ✉️             │                                  │
└─────────────────────────────────────────────────────────┘
```

**El efecto typewriter (máquina de escribir):**

```tsx
useEffect(() => {
  // Palabras que va a escribir y borrar
  const words = ['immersive VR experiences', 'AI-powered solutions', '3D worlds']
  let wi = 0       // índice de la palabra actual
  let ci = 0       // cuántos caracteres mostrar
  let deleting = false  // ¿está borrando o escribiendo?

  function tick() {
    const word = words[wi % words.length]

    if (deleting) {
      ci--  // Borra un caracter
    } else {
      ci++  // Agrega un caracter
    }

    // Muestra el texto actual
    typewriterRef.current.textContent = word.substring(0, ci)

    let delay = deleting ? 60 : 110  // Velocidad

    // Si terminó de escribir → espera y luego borra
    if (!deleting && ci === word.length) {
      delay = 1800  // Pausa 1.8 segundos
      deleting = true
    }
    // Si terminó de borrar → pasa a la siguiente palabra
    else if (deleting && ci === 0) {
      deleting = false
      wi++
    }

    setTimeout(tick, delay)  // Repite
  }

  setTimeout(tick, 700)  // Inicia después de 0.7 segundos
}, [])
```

### 7.3 El AuthModal (Modal de inicio de sesión)

**Archivo:** `components/auth/AuthModal.tsx`

Este modal aparece cuando el usuario hace clic en "Sign In". Permite tres formas de autenticarse:

```
┌─────────────────────────────────┐
│         Welcome back        ×   │
│  Sign in to track your orders   │
│                                 │
│  [Sign In]  [Sign Up]  ← tabs   │
│                                 │
│  [🐙 GitHub]  [G Google]        │
│                                 │
│  ─── or continue with email ─── │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Email address            │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Password                 │    │
│  └─────────────────────────┘    │
│                                 │
│  [      Sign In       ]         │
└─────────────────────────────────┘
```

**La lógica de autenticación con OAuth (Google/GitHub):**

```tsx
async function handleOAuth(provider: 'github' | 'google') {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,  // 'google' o 'github'
    options: {
      // Después de autenticarse, redirige a esta URL
      redirectTo: `${siteUrl}/api/auth/user-callback`
    }
  })
  // Si hay error, lo muestra
  if (error) setError(error.message)
}
```

**El flujo completo de OAuth:**

```
1. Usuario hace clic en "Google"
           │
           ▼
2. supabase.auth.signInWithOAuth({ provider: 'google' })
   → Redirige a Google
           │
           ▼
3. Usuario selecciona su cuenta de Google
   → Google redirige a:
     https://proyecto.supabase.co/auth/v1/callback
           │
           ▼
4. Supabase verifica y crea la sesión
   → Redirige a nuestro callback:
     joshtvr.com/api/auth/user-callback?code=xxx
           │
           ▼
5. app/api/auth/user-callback/route.ts
   → Intercambia el código por una sesión real
   → Guarda la sesión en cookies
   → Redirige al usuario a la página de inicio
           │
           ▼
6. El usuario está logueado ✅
   El navbar muestra su avatar
```

### 7.4 El UserMenu (Menú de usuario)

**Archivo:** `components/auth/UserMenu.tsx`

Cuando el usuario está logueado, en lugar del botón "Sign In", aparece su avatar. Al hacer clic se abre un menú desplegable:

```
                         ┌─────────────────┐
                         │ Joshua Hernandez │
                         │ josh@email.com   │
                         ├─────────────────┤
[Avatar] ─── clic ────▶  │ ✓ My Orders      │
                         ├─────────────────┤
                         │ Sign Out         │
                         └─────────────────┘
```

```tsx
// El avatar muestra la foto de Google/GitHub o las iniciales del nombre
const initials = user.user_metadata?.full_name
  ?.split(' ')
  .map(n => n[0])      // Primera letra de cada palabra
  .slice(0, 2)          // Máximo 2 letras
  .join('')
  .toUpperCase()        // "Joshua Hernandez" → "JH"

const avatar = user.user_metadata?.avatar_url  // URL de la foto
```

---

## 8. Las páginas públicas

### 8.1 La página de inicio

**Archivo:** `app/[locale]/page.tsx`

Esta es la página principal. Es un **Server Component** — se genera en el servidor antes de mandarse al navegador.

```tsx
// app/[locale]/page.tsx
export default async function HomePage({ params }) {
  const locale = (await params).locale

  // 1. Conecta con Supabase
  const supabase = await createClient()

  // 2. Obtiene los datos que necesita
  const { data: projects }      = await supabase.from('projects').select('*').eq('published', true)
  const { data: experience }    = await supabase.from('experience').select('*')
  const { data: certifications } = await supabase.from('certifications').select('*')
  const { data: testimonials }  = await supabase.from('testimonials').select('*')

  // 3. Renderiza todas las secciones con esos datos
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection projects={projects ?? []} />
      <ExperienceSection experience={experience ?? []} />
      <GitHubStatsSection />
      <CertificationsSection certs={certifications ?? []} />
      <TestimonialsSection testimonials={testimonials ?? []} />
      <ContactSection />
    </main>
  )
}
```

**¿Por qué usar Server Components?**

```
Server Component:
  ✅ Los datos se obtienen en el servidor (más seguro)
  ✅ La página llega al navegador ya con contenido (SEO)
  ✅ No necesita JavaScript para mostrar datos
  ❌ No puede usar useState, useEffect, onClick

Client Component ('use client'):
  ✅ Puede usar useState, useEffect
  ✅ Puede responder a eventos del usuario
  ❌ Los datos se obtienen en el navegador (más lento)
```

### 8.2 La página de servicios

**Archivo:** `app/[locale]/services/page.tsx`

Esta página es un **formulario de 3 pasos** para contratar servicios:

```
PASO 1: Tipo de servicio + descripción del proyecto
                    │
                    ▼
PASO 2: Presupuesto + tiempo deseado + referencias
                    │
                    ▼
PASO 3: Nombre + email de contacto
                    │
                    ▼
ÉXITO: Número de seguimiento (UUID)
```

**Las 6 categorías de servicio:**

| Icono | Servicio | Precio base |
|-------|---------|-------------|
| 🥽 | VR/AR Development | $80,000+ |
| 🎨 | 3D Art & Animation | $30,000+ |
| ⚙️ | Backend & APIs | $50,000+ |
| 🤖 | Data Science & AI | $60,000+ |
| 🎭 | UI/UX Design | $25,000+ |
| 🌐 | Full-Stack Web Apps | $100,000+ |

**Cuando se envía el formulario:**

```tsx
async function handleSubmit() {
  const response = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:    contactName,
      email:   contactEmail,
      message: description,
      metadata: {
        service_category: selectedService.id,
        service_title:    selectedService.title,
        budget,
        timeline,
        references,
      }
    })
  })

  const data = await response.json()
  setTrackingId(data.id)  // El UUID para hacer seguimiento
  setStep('success')
}
```

**La página de seguimiento** en `app/[locale]/services/track/[id]/page.tsx` usa ese UUID para mostrar el estado de la consulta:

```
┌──────────────────────────────────────────┐
│  Consulta #a1b2c3d4                       │
│  Estado: En revisión 🟡                   │
│                                           │
│  ●─────●─────○─────○─────○              │
│  Enviado Revisión Propuesta Aceptado      │
│                                           │
│  Nota del admin:                          │
│  "Revisaremos tu proyecto esta semana"    │
└──────────────────────────────────────────┘
```

### 8.3 La tienda

**Archivo:** `app/[locale]/store/page.tsx`

Muestra productos de la base de datos con integración de Stripe:

```tsx
// Obtiene los productos activos de Supabase
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('active', true)
  .order('created_at', { ascending: false })
```

**El proceso de compra:**

```
1. Usuario hace clic en "Buy Now"
            │
            ▼
2. CheckoutButton.tsx
   → Llama a /api/stripe/checkout
   → Envía el price_id del producto
            │
            ▼
3. app/api/stripe/checkout/route.ts
   → Crea una sesión de Stripe Checkout
   → Retorna una URL de Stripe
            │
            ▼
4. Usuario va a la página de Stripe (segura y encriptada)
   → Ingresa sus datos de tarjeta
   → Completa el pago
            │
            ▼
5. Stripe redirige a joshtvr.com/store/success
            │
            ▼
6. Stripe envía un webhook a /api/stripe/webhook
   → La orden se guarda en la tabla orders
```

### 8.4 La página de órdenes

**Archivo:** `app/[locale]/orders/page.tsx`

Esta página requiere que el usuario esté autenticado. Si no lo está, lo redirige al inicio.

```tsx
useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    if (!data.user) {
      router.push(`/${locale}`)  // ← Redirige si no hay sesión
      return
    }
    // Si hay sesión, obtiene las órdenes de ese usuario
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', data.user.id)
      .order('created_at', { ascending: false })
      .then(({ data: rows }) => setOrders(rows ?? []))
  })
}, [])
```

---

## 9. Autenticación

### 9.1 Dos tipos de autenticación

Este proyecto tiene dos sistemas de login completamente separados:

```
┌─────────────────────────────────────────────────────────────┐
│  AUTENTICACIÓN ADMIN (solo Joshua)                           │
│                                                              │
│  Ruta:    /admin/login                                       │
│  Método:  GitHub OAuth únicamente                            │
│  Guarda:  Verifica que user_name === "JoshTVR"              │
│  Callback: /api/auth/callback                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  AUTENTICACIÓN USUARIOS (clientes del portafolio)            │
│                                                              │
│  Ruta:    Modal en navbar                                    │
│  Métodos: GitHub, Google, Email/contraseña                   │
│  Sin restricción de username                                 │
│  Callback: /api/auth/user-callback                           │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 El middleware: el guardia de seguridad

**Archivo:** `middleware.ts`

El middleware es código que se ejecuta ANTES de que cualquier página se cargue. Lo usamos como guardia de seguridad del panel admin.

```tsx
// middleware.ts — se ejecuta en CADA petición al servidor
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Si la ruta NO empieza con /admin, déjala pasar libremente
  if (!pathname.startsWith('/admin')) {
    return intlMiddleware(request)  // Solo maneja el idioma
  }

  // Si es /admin/login, también déjala pasar
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Para cualquier otra ruta /admin/*, verificar la sesión
  const supabase = createServerClient(/* ... */)
  const { data: { user } } = await supabase.auth.getUser()

  // Sin sesión → redirigir al login
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Verificar que el usuario es admin (solo JoshTVR)
  const username = user.user_metadata?.user_name
  if (username?.toLowerCase() !== adminUsername.toLowerCase()) {
    return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
  }

  // ✅ Todo bien, acceso permitido
  return NextResponse.next()
}
```

### 9.3 El callback de autenticación del admin

**Archivo:** `app/api/auth/callback/route.ts`

```tsx
export async function GET(request: Request) {
  const url    = new URL(request.url)
  const code   = url.searchParams.get('code')   // Código temporal de GitHub

  // Intercambia el código por una sesión real
  const { data } = await supabase.auth.exchangeCodeForSession(code)

  // GUARDIA: verifica que sea JoshTVR
  const githubUsername = data.user.user_metadata?.user_name
  const adminUsername  = process.env.ADMIN_GITHUB_USERNAME  // "JoshTVR"

  if (githubUsername?.toLowerCase() !== adminUsername.toLowerCase()) {
    // Si NO es JoshTVR → cierra la sesión y manda error
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/?error=unauthorized`)
  }

  // Si SÍ es JoshTVR → redirige al admin
  return NextResponse.redirect(`${origin}/admin`)
}
```

---

## 10. La base de datos

### 10.1 ¿Qué es Supabase?

Supabase es una alternativa open-source a Firebase. Incluye:
- **PostgreSQL**: Base de datos relacional poderosa
- **Auth**: Sistema de autenticación con OAuth
- **Storage**: Almacenamiento de archivos (como imágenes)
- **Realtime**: Actualizaciones en tiempo real
- **Studio**: Interfaz web para ver y editar datos

### 10.2 Las tablas de la base de datos

**Tabla: `projects`**
```sql
CREATE TABLE projects (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en    TEXT NOT NULL,    -- Título en inglés
  title_es    TEXT NOT NULL,    -- Título en español
  slug        TEXT UNIQUE,      -- URL amigable: "sistema-vr-medico"
  category    TEXT,             -- 'vr', 'ai', 'backend', 'design', 'web'
  description_en TEXT,          -- Descripción en inglés
  description_es TEXT,          -- Descripción en español
  tech_stack  TEXT[],           -- Array: ['Unity', 'C#', 'Blender']
  image_url   TEXT,             -- URL de la imagen en Supabase Storage
  demo_url    TEXT,             -- Link al demo
  github_url  TEXT,             -- Link al repositorio
  featured    BOOLEAN DEFAULT false,  -- ¿Aparece en destacados?
  published   BOOLEAN DEFAULT false,  -- ¿Es visible al público?
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

**Tabla: `products`** (tienda)
```sql
CREATE TABLE products (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name              TEXT NOT NULL,       -- Nombre del producto
  description       TEXT,
  price_cents       INTEGER NOT NULL,    -- Precio en centavos (2500 = $25.00)
  type              TEXT DEFAULT 'digital',  -- 'digital', 'physical', 'commission'
  image_url         TEXT,
  stock             INTEGER DEFAULT -1,  -- -1 = ilimitado
  active            BOOLEAN DEFAULT true,
  stripe_product_id TEXT,               -- ID del producto en Stripe
  stripe_price_id   TEXT,               -- ID del precio en Stripe
  created_at        TIMESTAMPTZ DEFAULT now()
);
```

**Tabla: `orders`** (órdenes de compra)
```sql
CREATE TABLE orders (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID REFERENCES auth.users(id),  -- Quién compró
  stripe_session_id   TEXT,            -- ID de la sesión de Stripe
  stripe_payment_intent TEXT,
  customer_email      TEXT,
  customer_name       TEXT,
  total_amount        INTEGER,         -- En centavos
  status              TEXT DEFAULT 'pending',  -- 'pending', 'paid', 'refunded'
  items               JSONB,           -- [{ name, quantity, price }]
  created_at          TIMESTAMPTZ DEFAULT now()
);
```

**Tabla: `inquiries`** (consultas de servicios)
```sql
CREATE TABLE inquiries (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT,
  status     TEXT DEFAULT 'new',
  -- Posibles: 'new', 'reviewing', 'proposal_sent', 'accepted', 'rejected'
  metadata   JSONB,  -- { service_category, budget, timeline, references, response_note }
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Tabla: `experience`**
```sql
CREATE TABLE experience (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company     TEXT NOT NULL,
  role_en     TEXT NOT NULL,
  role_es     TEXT NOT NULL,
  period      TEXT,
  description_en TEXT,
  description_es TEXT,
  skills      TEXT[],
  sort_order  INTEGER DEFAULT 0
);
```

**Tabla: `certifications`**
```sql
CREATE TABLE certifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  issuer      TEXT NOT NULL,
  date        TEXT,
  image_url   TEXT,
  verify_url  TEXT
);
```

**Tabla: `testimonials`**
```sql
CREATE TABLE testimonials (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT,
  content     TEXT NOT NULL,
  avatar_url  TEXT,
  published   BOOLEAN DEFAULT false
);
```

**Tabla: `settings`**
```sql
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,   -- 'store_visible', 'show_github_stats'
  value TEXT               -- 'true' / 'false'
);
```

### 10.3 Row Level Security (RLS)

**RLS** es una capa de seguridad en la base de datos. Define quién puede leer/escribir cada tabla.

**Analogía:** Imagina que la base de datos es un edificio de departamentos. RLS es el portero que decide quién puede entrar a qué piso.

```sql
-- Ejemplo: la tabla projects
-- Cualquiera puede LEER proyectos publicados
CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT
  USING (published = true);

-- Solo usuarios autenticados pueden CREAR proyectos
-- (en la práctica, solo el admin tiene la service_role_key para bypassear esto)
CREATE POLICY "Authenticated can insert"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### 10.4 Los tres clientes de Supabase

```tsx
// lib/supabase/client.ts — Para el NAVEGADOR (Client Components)
// Puede leer datos públicos, acceder a la sesión del usuario
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts — Para el SERVIDOR (Server Components, API Routes)
// Puede leer la sesión del usuario a través de cookies
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(/* URL, ANON_KEY, { cookies } */)
}

// lib/supabase/admin.ts — Para operaciones ADMINISTRATIVAS
// Tiene acceso total, bypasea RLS
// ⚠️ NUNCA usar en el cliente, solo en el servidor
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // ← La llave secreta
  )
}
```

---

## 11. El panel de administración

### 11.1 Estructura del admin

```
/admin                → Dashboard (estadísticas)
/admin/projects       → Lista de proyectos + CRUD
/admin/services       → Lista de servicios + CRUD
/admin/store          → Lista de productos + CRUD
/admin/orders         → Ver órdenes de clientes
/admin/inquiries      → Ver y gestionar consultas
/admin/settings       → Configuración global
```

### 11.2 El Dashboard

**Archivo:** `app/admin/page.tsx`

```tsx
// Obtiene estadísticas de la base de datos
const [
  { count: totalProjects },
  { count: published },
  { count: newInquiries },
  { count: orders },
] = await Promise.all([
  supabase.from('projects').select('*', { count: 'exact', head: true }),
  supabase.from('projects').select('*', { count: 'exact', head: true }).eq('published', true),
  supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  supabase.from('orders').select('*', { count: 'exact', head: true }),
])
```

### 11.3 CRUD de proyectos

**CRUD** significa **C**reate (Crear), **R**ead (Leer), **U**pdate (Actualizar), **D**elete (Borrar).

**Los Server Actions** son funciones del servidor que se pueden llamar directamente desde componentes React:

```tsx
// app/admin/projects/actions.ts
'use server'  // ← Esto corre en el servidor, no en el navegador

export async function createProject(formData: FormData) {
  const supabase = createAdminClient()

  // Extrae los datos del formulario
  const title_en  = formData.get('title_en') as string
  const title_es  = formData.get('title_es') as string
  const category  = formData.get('category') as string
  const published = formData.get('published') === 'true'

  // Inserta en la base de datos
  const { error } = await supabase.from('projects').insert({
    title_en, title_es, category, published,
    slug: slugify(title_en),  // Convierte "Mi Proyecto" → "mi-proyecto"
  })

  if (error) throw new Error(error.message)

  // Actualiza el caché de la página
  revalidatePath('/admin/projects')
  revalidatePath('/en')  // La página pública también se actualiza

  // Redirige de vuelta a la lista
  redirect('/admin/projects')
}
```

**El formulario del proyecto** usa **TipTap** — un editor de texto enriquecido como Word o Google Docs, pero dentro de la app:

```tsx
// components/admin/editors/TipTapEditor.tsx
// Permite escribir con formato: negritas, listas, headings, etc.
// El resultado se guarda como HTML en la base de datos
```

### 11.4 Gestión de consultas (Inquiries)

Cuando un visitante llena el formulario de servicios, aparece en `/admin/inquiries`. Joshua puede:

1. Cambiar el estado: `new` → `reviewing` → `proposal_sent` → `accepted`/`rejected`
2. Agregar una nota de respuesta (visible en la página de seguimiento del cliente)

```tsx
// app/admin/inquiries/actions.ts
export async function setInquiryStatus(id: string, status: string) {
  const supabase = createAdminClient()
  await supabase.from('inquiries').update({ status }).eq('id', id)
  revalidatePath('/admin/inquiries')
}

export async function setResponseNote(id: string, note: string) {
  // Actualiza el campo metadata (JSONB) con la nota
  const { data } = await supabase.from('inquiries').select('metadata').eq('id', id).single()
  const metadata = { ...(data?.metadata ?? {}), response_note: note }
  await supabase.from('inquiries').update({ metadata }).eq('id', id)
  revalidatePath('/admin/inquiries')
}
```

---

## 12. Gráficos 3D

### 12.1 ¿Qué es WebGL y Three.js?

**WebGL** es una tecnología del navegador que permite dibujar gráficos 3D usando la GPU (tarjeta gráfica).

**Three.js** es una biblioteca que hace que WebGL sea manejable para humanos normales.

**React Three Fiber** (R3F) es un wrapper de Three.js para React — permite usar componentes de React para describir la escena 3D.

```tsx
// Sin React Three Fiber (código Three.js puro — muy verbose)
const scene    = new THREE.Scene()
const camera   = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100)
const material = new THREE.MeshStandardMaterial({ color: 0xfacc15 })
const torus    = new THREE.Mesh(geometry, material)
scene.add(torus)
renderer.render(scene, camera)

// Con React Three Fiber — mucho más limpio
function MiEscena() {
  return (
    <Canvas>
      <mesh>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
    </Canvas>
  )
}
```

### 12.2 El Giroscopio 3D

**Archivo:** `components/three/HeroCanvas.tsx`

El giroscopio está formado por 3 anillos (tori) que giran en diferentes ejes:

```
         Eje Y (vertical)
              │
              │
  ────────────┼────────────  Eje X (horizontal)
              │
              │
    (Eje Z: hacia/desde la pantalla)

Los 3 anillos:
  🔵 Anillo exterior: gira en eje Y (como la Tierra girando)
  🟡 Anillo medio:   gira en eje X (como un aro de hula hoop)
  🔴 Anillo interior: gira en eje Z (como una rueda de bicicleta)
```

```tsx
// Cada anillo es este componente
function Ring({ radius, tube, axis, speed, offset = 0 }) {
  const ref = useRef()

  // useFrame se ejecuta ~60 veces por segundo (como un loop de animación)
  useFrame(({ clock }) => {
    // Rota continuamente basándose en el tiempo transcurrido
    ref.current.rotation[axis] = clock.getElapsedTime() * speed + offset
    //                 ↑           ↑
    //        'x', 'y' o 'z'   velocidad de rotación
  })

  return (
    <mesh ref={ref}>
      {/* torusGeometry: radio, grosor del tubo, segmentos */}
      <torusGeometry args={[radius, tube, 32, 160]} />
      <meshStandardMaterial
        color="#facc15"    // Amarillo de la marca
        metalness={0.88}   // 0 = plástico, 1 = metal puro
        roughness={0.10}   // 0 = espejo, 1 = mate
        envMapIntensity={1.8}  // Intensidad del reflejo del ambiente
      />
    </mesh>
  )
}
```

**¿Por qué el material funciona en modo claro y oscuro?**

Porque usa **PBR (Physically Based Rendering)** — simula cómo la luz real interactúa con los materiales. El metal amarillo refleja la luz del ambiente (el preset "studio") en lugar de emitir su propia luz. Así se ve bien sobre cualquier fondo.

```tsx
// La iluminación de la escena
<Canvas gl={{ alpha: true }}>  // alpha: true = fondo transparente
  <ambientLight intensity={0.12} />   // Luz ambiente suave
  <directionalLight
    position={[4, 6, 3]}
    intensity={2.2}
    color="#ffffff"    // Luz principal blanca desde arriba
  />
  <directionalLight
    position={[-4, -2, -3]}
    intensity={0.6}
    color="#facc15"    // Rebote amarillo desde abajo
  />
  <Environment preset="studio" />  // Reflejo de estudio fotográfico
</Canvas>
```

---

## 13. Internacionalización

### 13.1 ¿Cómo funciona el sistema de idiomas?

**next-intl** maneja la traducción automática de textos en EN/ES.

**Estructura:**

```
messages/
├── en.json    ← Todos los textos en inglés
└── es.json    ← Todos los textos en español
```

**Ejemplo de los archivos de traducción:**

```json
// messages/en.json
{
  "hero": {
    "greeting": "HI, I'M",
    "building": "Building",
    "subtitle": "VR & Digital Business Application Developer...",
    "cta-projects": "View Projects",
    "cta-contact": "Get in Touch"
  },
  "nav": {
    "about": "About",
    "skills": "Skills",
    "projects": "Projects"
  }
}
```

```json
// messages/es.json
{
  "hero": {
    "greeting": "HOLA, SOY",
    "building": "Construyendo",
    "subtitle": "Desarrollador de Aplicaciones VR y Negocios Digitales...",
    "cta-projects": "Ver Proyectos",
    "cta-contact": "Contáctame"
  },
  "nav": {
    "about": "Acerca",
    "skills": "Habilidades",
    "projects": "Proyectos"
  }
}
```

**Cómo usar las traducciones en un componente:**

```tsx
'use client'
import { useTranslations } from 'next-intl'

function MiComponente() {
  const t = useTranslations('hero')  // ← Sección del JSON

  return (
    <div>
      <p>{t('greeting')}</p>    {/* "HI, I'M" o "HOLA, SOY" */}
      <h1>Joshua Hernandez</h1>
      <p>{t('subtitle')}</p>
    </div>
  )
}
```

### 13.2 El toggle de idioma

**Archivo:** `components/ui/LanguageToggle.tsx`

```tsx
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export function LanguageToggle() {
  const locale   = useLocale()    // 'en' o 'es'
  const router   = useRouter()
  const pathname = usePathname()  // '/en/services'

  function switchLocale() {
    const nextLocale = locale === 'en' ? 'es' : 'en'
    // Reemplaza el locale en la URL actual
    // '/en/services' → '/es/services'
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`)
    router.push(newPath)
  }

  return (
    <button onClick={switchLocale}>
      {locale === 'en' ? 'ES' : 'EN'}
    </button>
  )
}
```

---

## 14. La tienda y pagos

### 14.1 ¿Cómo funciona Stripe?

Stripe es el procesador de pagos más confiable del mundo. Nunca tocamos los datos de la tarjeta del cliente — todo pasa por los servidores seguros de Stripe.

```
┌──────────────────────────────────────────────────────────────┐
│  FLUJO DE PAGO                                                │
│                                                              │
│  1. Usuario hace clic en "Buy Now"                           │
│           │                                                   │
│  2. Nuestro servidor crea una Checkout Session en Stripe     │
│     → Stripe retorna una URL única                           │
│           │                                                   │
│  3. Usuario es redirigido a stripe.com (seguro)              │
│     → Ingresa número de tarjeta, CVV, fecha                  │
│     → Nunca pasa por nuestros servidores                     │
│           │                                                   │
│  4. Stripe procesa el pago                                   │
│           │                                                   │
│  5. Stripe redirige al usuario a joshtvr.com/store/success   │
│           │                                                   │
│  6. Stripe envía un "webhook" a joshtvr.com/api/stripe/webhook│
│     → Notifica que el pago fue exitoso                       │
│     → Guardamos la orden en nuestra base de datos            │
└──────────────────────────────────────────────────────────────┘
```

### 14.2 Crear una Checkout Session

```tsx
// app/api/stripe/checkout/route.ts
export async function POST(request: Request) {
  const { price_id, product_name } = await request.json()

  const session = await stripe.checkout.sessions.create({
    mode:        'payment',         // Pago único (no suscripción)
    line_items: [{
      price:    price_id,           // El ID del precio en Stripe
      quantity: 1,
    }],
    success_url: `${siteUrl}/en/store/success`,
    cancel_url:  `${siteUrl}/en/store`,
    metadata: { product_name },     // Info extra que queremos guardar
  })

  return Response.json({ url: session.url })
}
```

### 14.3 El Webhook de Stripe

```tsx
// app/api/stripe/webhook/route.ts
export async function POST(request: Request) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')!

  // Verifica que el webhook viene REALMENTE de Stripe (seguridad)
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  // Cuando el pago fue exitoso
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Guarda la orden en Supabase
    await supabase.from('orders').insert({
      stripe_session_id: session.id,
      customer_email:    session.customer_details?.email,
      total_amount:      session.amount_total,
      status:            'paid',
      items:             JSON.parse(session.metadata?.items ?? '[]'),
    })
  }

  return Response.json({ received: true })
}
```

---

## 15. Despliegue en Vercel

### 15.1 ¿Qué es Vercel?

Vercel es la plataforma de hosting creada por los mismos creadores de Next.js. Cuando haces `git push`, Vercel automáticamente:

1. Detecta que tienes un proyecto Next.js
2. Instala las dependencias
3. Compila el código
4. Lo despliega en servidores en todo el mundo

### 15.2 El proceso de despliegue

```
Tu computadora          GitHub              Vercel
     │                     │                  │
     │── git push ─────────▶│                  │
     │                     │── webhook ────────▶│
     │                     │                  │── npm install
     │                     │                  │── npm run build
     │                     │                  │── Deploy
     │                     │                  │── joshtvr.com live ✅
```

### 15.3 Vercel.json: configuración del servidor

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        // Evita que tu sitio sea cargado dentro de un iframe (clickjacking)

        { "key": "X-Content-Type-Options", "value": "nosniff" },
        // Evita que el navegador adivine el tipo de archivo

        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
        // Controla qué info se envía cuando navegas desde tu sitio
      ]
    }
  ]
}
```

---

## 16. Variables de entorno

Las variables de entorno son configuraciones secretas que el código necesita pero que no deben estar en el repositorio.

```
┌─────────────────────────────────────────────────────────────────┐
│  VARIABLE                          │ DÓNDE LA OBTIENES           │
├────────────────────────────────────┼─────────────────────────────┤
│ NEXT_PUBLIC_SUPABASE_URL           │ Supabase → Settings → API   │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY      │ Supabase → Settings → API   │
│ SUPABASE_SERVICE_ROLE_KEY          │ Supabase → Settings → API   │
│ GITHUB_TOKEN                       │ GitHub → Settings → Dev →   │
│                                    │ Personal Access Tokens       │
│ GITHUB_USERNAME                    │ Tu username de GitHub        │
│ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY │ Stripe → Developers → API   │
│ STRIPE_SECRET_KEY                  │ Stripe → Developers → API   │
│ STRIPE_WEBHOOK_SECRET              │ Stripe → Webhooks → Secret  │
│ NEXT_PUBLIC_SITE_URL               │ Tu dominio: joshtvr.com      │
│ ADMIN_GITHUB_USERNAME              │ Tu username de GitHub        │
│ NOTIFICATION_EMAIL                 │ Tu email                     │
└─────────────────────────────────────────────────────────────────┘
```

**¿Por qué algunas tienen `NEXT_PUBLIC_`?**

```
NEXT_PUBLIC_SUPABASE_URL    ← El navegador NECESITA saber la URL
                              para conectarse a Supabase directamente

SUPABASE_SERVICE_ROLE_KEY   ← NUNCA debe llegar al navegador
                              Solo el servidor la usa
                              Si alguien la obtiene → acceso total a la DB
```

---

## 17. Flujo completo de datos

### Un visitante carga la página de inicio

```
1. Navegador pide GET https://joshtvr.com/en
           │
           ▼
2. Vercel enruta a Next.js
           │
           ▼
3. middleware.ts se ejecuta
   → ¿Es ruta /admin? No → next-intl detecta locale 'en'
           │
           ▼
4. app/[locale]/layout.tsx (Server Component)
   → Lee cookie de Supabase (¿hay sesión activa?)
   → Lee 'store_visible' de settings en Supabase
   → Renderiza Navbar + children
           │
           ▼
5. app/[locale]/page.tsx (Server Component)
   → Consulta Supabase: projects, experience, certifications...
   → Renderiza todas las secciones con los datos
           │
           ▼
6. HTML completo se envía al navegador
           │
           ▼
7. React "hidrata" el HTML (le agrega interactividad)
   → Typewriter empieza a escribir
   → ThemeToggle lee localStorage y aplica tema
   → Three.js renderiza el giroscopio 3D
   → Navbar empieza a escuchar el scroll
```

### Un usuario compra un producto

```
1. Usuario no logueado hace clic en "Buy Now"
   → AuthModal se abre (requiere login)

2. Usuario elige "Sign in with Google"
   → Redirigido a Google
   → Regresa a /api/auth/user-callback
   → Sesión creada, cookie guardada

3. Usuario hace clic en "Buy Now" de nuevo
   → CheckoutButton llama a POST /api/stripe/checkout
   → Supabase verifica que el user existe (opcional)

4. Servidor crea Stripe Session
   → Retorna URL de Stripe

5. Usuario va a Stripe
   → Ingresa tarjeta
   → Pago exitoso

6. Stripe redirige a /en/store/success
   → Página de éxito

7. Stripe envía webhook a /api/stripe/webhook
   → Verificamos firma
   → Guardamos orden en tabla orders con user_id

8. Usuario va a /en/orders
   → Ve su orden con estado "paid"
```

---

## 18. Solución de problemas comunes

### Error: "Cannot find module './xxxx.js'"
```bash
# Solución: borrar el caché y reiniciar
rm -rf .next
npm run dev
```

### Error: "Text content does not match server-rendered HTML"
```
Causa: Un `<style>` tag inline con caracteres especiales (>) que el
       servidor escapa como &gt; pero el cliente pone literal.

Solución: Mover los estilos a globals.css en lugar de inline styles.
```

### Error: "Unsupported provider: provider is not enabled"
```
Causa: El proveedor OAuth (Google/GitHub) no tiene Client ID/Secret
       guardados en Supabase.

Solución:
1. Supabase → Authentication → Sign In / Providers → Google
2. Verificar que Client ID y Client Secret estén escritos
3. Hacer clic en Save
```

### La tienda muestra 404
```
Causa: store_visible = false en la base de datos, y en desarrollo
       el código intentaba leer de Supabase pero fallaba.

Solución ya aplicada: en NODE_ENV=development, store_visible
                      siempre es true.
```

### El admin no guarda la sesión al hacer login
```
Causa: La URL de callback en el GitHub OAuth App no coincide
       con la URL de Supabase.

Solución: Verificar que en GitHub → Developer Settings → OAuth Apps
          el Authorization callback URL sea:
          https://[proyecto].supabase.co/auth/v1/callback
```

---

## 19. Glosario técnico

| Término | Definición simple |
|---------|------------------|
| **API** | Un "mesero" que conecta dos sistemas de software |
| **App Router** | La forma moderna de organizar páginas en Next.js 14 |
| **Auth** | Abreviación de "Authentication" (verificar quién eres) |
| **CRUD** | Create, Read, Update, Delete — las 4 operaciones básicas |
| **Client Component** | Componente que corre en el navegador |
| **Cookie** | Pequeño archivo que el servidor guarda en tu navegador |
| **CSS Variables** | Valores reutilizables en CSS (`--accent: #facc15`) |
| **Deploy** | Publicar el código en internet para que todos lo vean |
| **Edge Function** | Código que corre en servidores cercanos al usuario |
| **Environment Variable** | Variable de configuración secreta del servidor |
| **Framework** | Estructura base para construir aplicaciones |
| **Git** | Sistema de control de versiones (historial del código) |
| **Glassmorphism** | Efecto visual de vidrio translúcido |
| **Hook** | Función especial de React (useEffect, useState, etc.) |
| **Hydration** | Proceso de agregar interactividad a HTML pre-renderizado |
| **JSON** | Formato de datos ligero (como un diccionario) |
| **JWT** | Token seguro que prueba que el usuario está autenticado |
| **Locale** | Configuración regional: idioma + región ('en', 'es') |
| **Middleware** | Código que se ejecuta antes de cada petición |
| **OAuth** | Estándar para login con terceros (Google, GitHub) |
| **ORM** | Capa que convierte operaciones de JS a SQL |
| **PBR** | Physically Based Rendering — simulación realista de materiales |
| **Props** | Datos que se pasan de un componente padre a uno hijo |
| **RLS** | Row Level Security — seguridad a nivel de filas en la DB |
| **Server Component** | Componente que corre en el servidor |
| **Server Action** | Función del servidor llamada desde el cliente |
| **Slug** | URL amigable: "Mi Proyecto" → "mi-proyecto" |
| **SQL** | Lenguaje para hablar con bases de datos |
| **SSR** | Server Side Rendering — renderizar en el servidor |
| **State** | Datos que un componente recuerda y pueden cambiar |
| **Stripe** | Servicio de procesamiento de pagos |
| **Supabase** | Base de datos PostgreSQL + Auth + Storage en la nube |
| **Three.js** | Biblioteca para gráficos 3D en el navegador |
| **Token** | Código secreto que prueba identidad o autorización |
| **TypeScript** | JavaScript con tipos para evitar errores |
| **UUID** | Identificador único universal (ej: `a1b2c3d4-e5f6-...`) |
| **Vercel** | Plataforma de hosting especializada en Next.js |
| **Webhook** | Notificación automática entre servicios web |
| **WebGL** | API del navegador para gráficos 3D con la GPU |

---

## Apéndice A: El archivo next.config.mjs explicado

```javascript
// next.config.mjs — Configuración principal de Next.js
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
// ↑ Activa el plugin de internacionalización

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Necesario para que Three.js funcione con el bundler de Next.js
  transpilePackages: ['three'],

  // Permite cargar imágenes desde dominios externos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',  // Para imágenes en Supabase Storage
      },
    ],
  },
}

export default withNextIntl(nextConfig)
```

## Apéndice B: Cómo agregar un nuevo proyecto al portafolio

1. **Ve a** `https://joshtvr.com/admin`
2. **Clic** en "Projects" en el sidebar
3. **Clic** en "+ New Project"
4. **Rellena** el formulario:
   - Título en inglés y español
   - Categoría (VR, AI, Backend, Design, Web)
   - Descripción (con el editor TipTap — puedes usar formato)
   - Stack tecnológico (separado por comas)
   - URL de la demo y/o GitHub
   - Imagen (sube desde Supabase Storage)
   - ¿Es featured? ¿Está publicado?
5. **Guarda** y la página pública se actualiza automáticamente

## Apéndice C: Cómo agregar un producto a la tienda

1. Primero **crea el producto en Stripe** Dashboard → Products → Add product
2. Copia el **Price ID** (empieza con `price_...`)
3. Ve a `https://joshtvr.com/admin/store/new`
4. Rellena el formulario y pega el Price ID de Stripe
5. Guarda — el producto aparece en la tienda

---

*Documentación generada para JoshTVR Portfolio — March 2026*
*Stack: Next.js 14 + Supabase + Stripe + Three.js + Vercel*

---

## 20. ACTUALIZACIÓN: Rediseño Midnight — Sistema de Diseño Actual

> ⚠️ **NOTA:** La sección 6 de este documento describe el sistema de diseño original (tema amarillo/negro). **Ese tema ya no existe.** El diseño actual es el tema "Midnight" — implementado en marzo de 2026. Esta sección documenta el estado REAL del sistema de diseño.

### 20.1 ¿Por qué se rediseñó?

El primer diseño usaba un fondo negro profundo (`#0a0a0a`) con acentos amarillos (`#facc15`). Si bien era llamativo, no comunicaba el perfil técnico/creativo de Joshua con suficiente sofisticación. El rediseño "Midnight" adopta una paleta **slate azul-pizarra + gradiente azul-violeta** que es más profesional y menos genérica.

```
ANTES (Direction B — ya no existe):
  --bg-primary:  #0a0a0a    (negro)
  --accent:      #facc15    (amarillo)

AHORA (Midnight — actual):
  --bg-primary:  #0f172a    (slate-900)
  --accent:      #3b82f6    (blue-500)
  --accent-2:    #8b5cf6    (violet-500)
```

### 20.2 Variables CSS actuales completas

```css
/* app/globals.css — Estado actual (Midnight theme) */

:root {
  /* ── Backgrounds (modo oscuro — default) ── */
  --bg-primary:    #0f172a;    /* slate-900: fondo principal */
  --bg-secondary:  #1e293b;    /* slate-800: fondo secundario */
  --bg-card:       #1e293b;    /* fondo de tarjetas */
  --bg-card-hover: #263350;    /* tarjetas al hacer hover */

  /* ── Acentos: gradiente azul → violeta ── */
  --accent:        #3b82f6;    /* blue-500: color principal */
  --accent-2:      #8b5cf6;    /* violet-500: color secundario */
  --accent-light:  #60a5fa;    /* blue-400: versión clara */
  --accent-dark:   #2563eb;    /* blue-600: versión oscura */
  --accent-glow:   rgba(59, 130, 246, 0.22);   /* resplandor azul */
  --accent-glow-2: rgba(139, 92, 246, 0.18);   /* resplandor violeta */
  --grad-accent:   linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);

  /* ── Texto ── */
  --text-primary:  #f1f5f9;    /* slate-100: texto principal */
  --text-muted:    #94a3b8;    /* slate-400: texto secundario */
  --text-dim:      #64748b;    /* slate-500: texto terciario */

  /* ── Bordes ── */
  --border-glass:  rgba(148, 163, 184, 0.1);
  --border-hover:  rgba(59, 130, 246, 0.35);

  /* ── Tipografía ── */
  --font-body:     var(--font-inter), system-ui, sans-serif;
  --font-heading:  var(--font-space-grotesk), system-ui, sans-serif;

  /* ── Spacing ── */
  --section-pad:   clamp(80px, 10vw, 140px);
  --container-max: 1200px;

  /* ── Transiciones ── */
  --transition-fast: 150ms ease;
  --transition-mid:  280ms ease;
  --transition-slow: 600ms cubic-bezier(0.16, 1, 0.3, 1);

  /* ── Glassmorphism ── */
  --glass-bg:     rgba(30, 41, 59, 0.6);
  --glass-border: 1px solid rgba(148, 163, 184, 0.1);
  --glass-blur:   blur(16px);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --radius:       14px;

  /* ── Navbar ── */
  --navbar-bg:     rgba(15, 23, 42, 0.9);
  --hero-gradient: linear-gradient(135deg, #f1f5f9 20%, #3b82f6 60%, #8b5cf6 100%);
}

/* ── Modo claro (light mode) ── */
[data-theme="light"] {
  --bg-primary:    #c8d4e3;    /* azul-grisáceo suave */
  --bg-secondary:  #bac8d9;
  --bg-card:       #d4dce9;
  --bg-card-hover: #b8c8db;

  --accent:        #2563eb;    /* blue-600 (más oscuro para contraste en claro) */
  --accent-2:      #7c3aed;    /* violet-600 */
  --accent-light:  #3b82f6;
  --accent-dark:   #1d4ed8;
  --accent-glow:   rgba(37, 99, 235, 0.2);
  --accent-glow-2: rgba(124, 58, 237, 0.15);

  --text-primary:  #0f172a;    /* slate-900 en claro */
  --text-muted:    #334155;    /* slate-700 */
  --text-dim:      #64748b;

  --border-glass:  rgba(15, 23, 42, 0.1);
  --border-hover:  rgba(37, 99, 235, 0.3);

  --glass-bg:     rgba(238, 242, 247, 0.85);
  --glass-border: 1px solid rgba(15, 23, 42, 0.1);
  --glass-shadow: 0 8px 32px rgba(15, 23, 42, 0.1);

  --navbar-bg:     rgba(238, 242, 247, 0.95);
  --hero-gradient: linear-gradient(135deg, #0f172a 20%, #2563eb 60%, #7c3aed 100%);
}
```

### 20.3 Clases utilitarias del tema Midnight

```css
/* Estas clases están definidas en globals.css y se usan en toda la app */

.glass {
  background:    var(--glass-bg);
  border:        var(--glass-border);
  backdrop-filter: var(--glass-blur);
  box-shadow:    var(--glass-shadow);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.btn-primary {
  background: var(--grad-accent);
  color: white;
  border: none;
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-glass);
}

.skill-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 500;
  background: rgba(59, 130, 246, 0.1);
  color: var(--accent-light);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.container-site {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 clamp(16px, 5vw, 48px);
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
  margin-bottom: 12px;
}
```

### 20.4 RevealObserver — animaciones de entrada

**Archivo:** `components/ui/RevealObserver.tsx`

Este componente es cliente y usa `IntersectionObserver` para detectar cuando los elementos entran al viewport. Cuando un elemento con clase `reveal` entra a la pantalla, se le agrega la clase `visible` que activa la animación CSS.

```tsx
'use client'
// Se monta una sola vez al cargar la app (en layout.tsx)
// Usa MutationObserver para re-observar elementos nuevos cuando cambia la ruta

useEffect(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        io.unobserve(e.target)
      }
    })
  }, { threshold: 0.08 })

  // Observa elementos .reveal existentes y nuevos (mutaciones)
  const observe = () => document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el))
  observe()

  const mo = new MutationObserver(observe)
  mo.observe(document.body, { childList: true, subtree: true })

  return () => { io.disconnect(); mo.disconnect() }
}, [])
```

```css
/* En globals.css */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}
```

**¿Por qué usar MutationObserver además de IntersectionObserver?**

En Next.js App Router, cuando navegas de página (ej: de `/projects/clubit-vr` de regreso a `/`), React no destruye y recrea el DOM completo — simplemente monta los nuevos componentes. Esto significa que los elementos `.reveal` nuevos no son observados por el `IntersectionObserver` inicial. El `MutationObserver` detecta cuando se agregan nodos nuevos al DOM y los observa inmediatamente.

---

## 21. ESQUEMA REAL DE BASE DE DATOS (Estado actual)

> ⚠️ **NOTA:** La sección 10 de este documento tiene el esquema original. Las tablas han cambiado significativamente. Este esquema refleja el estado REAL actual.

### 21.1 Tabla: `projects` (esquema actual)

```sql
CREATE TABLE projects (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         text UNIQUE NOT NULL,           -- URL amigable: "clubit-vr"
  title_en     text NOT NULL,
  title_es     text NOT NULL,
  description_en text,
  description_es text,
  content_en   text,                           -- HTML rico (TipTap) en inglés
  content_es   text,                           -- HTML rico (TipTap) en español
  category     text,                           -- 'vr','3d','data','design','github','video'
  tech_tags    text[] DEFAULT '{}',            -- ['Unity','C#','Blender']
  github_url   text,
  demo_url     text,
  model_url    text,                           -- URL de archivo .glb para visor 3D
  cover_image  text,                           -- URL imagen portada
  images       text[] DEFAULT '{}',            -- URLs galería de imágenes
  video_url    text[] DEFAULT '{}',            -- URLs de videos (soporte multi-video)
  is_published boolean NOT NULL DEFAULT false,
  is_featured  boolean NOT NULL DEFAULT false,
  sort_order   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
```

**Cambios importantes respecto al esquema original:**
- `image_url` → reemplazado por `cover_image` (una imagen) + `images[]` (galería)
- `video_url` cambió de `TEXT` a `TEXT[]` para soportar múltiples videos
- Se agregó `model_url TEXT` para el visor 3D interactivo
- `tech_stack` → renombrado a `tech_tags`
- `featured` / `published` → renombrado a `is_featured` / `is_published`
- Se agregaron `content_en`, `content_es`, `sort_order`

### 21.2 Tabla: `services`

```sql
CREATE TABLE services (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en      text NOT NULL,
  title_es      text NOT NULL,
  description_en text,
  description_es text,
  price_usd     numeric,
  delivery_days integer,
  features_en   text[],
  features_es   text[],
  category      text,
  is_active     boolean DEFAULT true,
  sort_order    integer DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);
```

**Los servicios actuales del portafolio:**
| Servicio | Precio USD | Días entrega |
|----------|-----------|--------------|
| 3D Modeling | $80 | 7 días |
| 3D Animation | $150 | 10 días |
| VR Experience Prototype | $500 | 21 días |
| Data Dashboard & Analysis | $150 | 7 días |
| Custom Python Visualization | $80 | 5 días |
| UI Design (Figma) | $100 | 5 días |

### 21.3 Tabla: `experience` (esquema actual)

```sql
CREATE TABLE experience (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company        text NOT NULL,
  role_en        text NOT NULL,
  role_es        text NOT NULL,
  description_en text,
  description_es text,
  tags           text[] DEFAULT '{}',    -- tecnologías/habilidades
  start_date     date,
  end_date       date,                   -- NULL = "present" (trabajo actual)
  sort_order     integer DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);
```

**Diferencias con el esquema original:**
- `period TEXT` → reemplazado por `start_date DATE` + `end_date DATE` (más preciso)
- `skills TEXT[]` → renombrado a `tags TEXT[]`

**Entradas actuales:**

| Empresa | Rol | Periodo |
|---------|-----|---------|
| Universidad Tecnológica de Zimapán | VR Developer — Internship | Ene 2024 – Jun 2024 |
| Vortex Editorial / Plandi | Pixel Art Game Developer (Internship) | Ene 2026 – Present |
| Roboarts Club | VR Game Developer (Internship) | Feb 24, 2026 – Mar 21, 2026 |

### 21.4 Tabla: `certifications` (esquema actual)

```sql
CREATE TABLE certifications (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en    text NOT NULL,
  name_es    text,
  issuer     text NOT NULL,
  year       integer,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**Diferencias con el esquema original:**
- `title` → renombrado a `name_en`
- Se agregó `name_es` para el nombre en español
- `date TEXT` → reemplazado por `year INTEGER`
- `image_url` y `verify_url` → eliminados
- Se agregó `sort_order`

**Certificaciones actuales:**
| Nombre | Emisor | Año |
|--------|--------|-----|
| Python Essentials 1 | Cisco Networking Academy / Python Institute (via UTT) | 2025 |

### 21.5 Tabla: `inquiries` (esquema actual)

```sql
CREATE TABLE inquiries (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       text NOT NULL,
  email      text NOT NULL,
  message    text,
  budget     text,
  status     text DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
-- RLS DESACTIVADO: ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
```

**Cambios importantes:**
- `metadata JSONB` → **eliminada** (causaba errores 500 en el API route)
- Se agregó `budget TEXT` para el presupuesto del cliente
- RLS desactivado para permitir inserts anónimos del formulario de contacto

### 21.6 Tabla: `notes` (nueva — marzo 2026)

```sql
CREATE TABLE notes (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      text NOT NULL,
  body       text,                   -- Contenido en texto plano
  status     text NOT NULL DEFAULT 'idea'
             CHECK (status IN ('idea', 'planning', 'in-progress', 'done')),
  tags       text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
```

Esta tabla es exclusiva del admin — no tiene presencia pública. Se usa para planificación personal y seguimiento de ideas de negocio.

### 21.7 Tabla: `products` (sin cambios significativos)

```sql
CREATE TABLE products (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              text NOT NULL,
  description       text,
  price_cents       integer NOT NULL,  -- 2500 = $25.00 USD
  type              text DEFAULT 'digital',
  image_url         text,
  stock             integer DEFAULT -1,  -- -1 = ilimitado
  active            boolean DEFAULT true,
  stripe_product_id text,
  stripe_price_id   text,
  created_at        timestamptz NOT NULL DEFAULT now()
);
```

### 21.8 RLS — Estado actual

```
projects      → RLS activo    (anon puede leer publicados, admin usa service_role)
services      → RLS activo
products      → RLS activo
orders        → RLS activo    (usuario solo ve sus propias órdenes)
inquiries     → RLS DESACTIVADO (para permitir inserts del formulario de contacto)
experience    → RLS activo
certifications → RLS activo
notes         → RLS DESACTIVADO (solo accesible desde admin con service_role)
```

---

## 22. SISTEMA DE SCRIPTS DE DATOS

Esta es una parte crucial del proyecto que no existía en la documentación original. En lugar de ingresar datos manualmente al admin, se usan scripts de Node.js que leen variables de entorno y operan directamente sobre Supabase con la `SUPABASE_SERVICE_ROLE_KEY`.

### 22.1 Cómo ejecutar scripts

```bash
# Sintaxis general
node --env-file=.env.local scripts/nombre-del-script.mjs

# --env-file=.env.local  → carga las variables de entorno desde .env.local
# scripts/               → directorio donde viven los scripts
```

### 22.2 `scripts/update-data.mjs`

**Propósito:** Sube videos de la animación de células, actualiza proyectos de GitHub, y actualiza servicios.

**Lo que hace:**
1. **Videos de Cells Animation** — lee `_project-assets/cells-animation/` y sube dos archivos MP4 a Supabase Storage:
   - `Cells Animations.mp4` (17MB, EEVEE) → `cells-animation/cells-eevee.mp4`
   - `Cells-Animations.mp4` (23MB, Cycles realista) → `cells-animation/cells-realistic.mp4`
   - Actualiza `video_url` del proyecto en BD como `[realistic_url, eevee_url]` (realista primero)

2. **Proyectos de GitHub** — hace upsert de tres proyectos de repos:
   - `business-intelligence`
   - `matplotlib-zero-to-hero`
   - `data-analytics-digital-business`

3. **Servicios** — hace upsert de los 6 servicios con precios, días de entrega y características.

```bash
# Ejecutar:
node --env-file=.env.local scripts/update-data.mjs
```

### 22.3 `scripts/add-content.mjs`

**Propósito:** Agregar contenido inicial al portafolio (certificación, experiencias, proyectos nuevos).

**Lo que hace:**
1. **Certificación Python Essentials 1** — insert en tabla `certifications`
2. **Experiencias de internship** — insert de Vortex/Plandi y Roboarts Club en tabla `experience`
3. **Proyectos nuevos** — upsert de Clubit VR y Alien Mothership en tabla `projects`

> ⚠️ **IMPORTANTE:** Este script usa `upsert` con `onConflict: 'slug'` para proyectos (evita duplicados), pero usa `insert` directo para certificaciones y experiencias. Si se ejecuta más de una vez, puede crear duplicados en esas tablas. Verificar antes de ejecutar.

### 22.4 Patrón de los scripts

Todos los scripts siguen el mismo patrón:

```javascript
import { createClient } from '@supabase/supabase-js'

// 1. Crear cliente con service_role (bypasea RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

// 2. Verificar conexión
const { error: pingError } = await supabase.from('projects').select('id').limit(1)
if (pingError) { console.error('Conexión fallida'); process.exit(1) }

// 3. Operaciones
// Para subir archivos:
const buffer = readFileSync('ruta/al/archivo.mp4')
await supabase.storage.from('project-images').upload('carpeta/archivo.mp4', buffer, {
  contentType: 'video/mp4',
  upsert: true  // Sobreescribe si ya existe
})

// Para obtener URL pública:
const { data: { publicUrl } } = supabase.storage
  .from('project-images')
  .getPublicUrl('carpeta/archivo.mp4')

// Para actualizar BD:
await supabase.from('projects').update({ video_url: [publicUrl] }).eq('slug', 'cells-animation')
```

### 22.5 Estructura de Supabase Storage

```
bucket: project-images/
├── cells-animation/
│   ├── cells-realistic.mp4    (video Cycles realista)
│   └── cells-eevee.mp4        (video EEVEE)
├── cubit-vr/
│   ├── cover.png
│   ├── gallery-01-piano-displays.png
│   ├── gallery-02-polyrhythm-gameplay.png
│   ├── gallery-03-unity-piano-scene.png
│   ├── gallery-04-song-selection.png
│   ├── gallery-05-unity-editor.png
│   ├── gallery-06-poly-game-manager.png
│   └── cubit-demo.mp4
└── alien-mothership/
    ├── cover.png              (Final-Render.jpg — el render más potente)
    ├── gallery-01-ring-interior.png
    ├── gallery-02-hull-spires.png
    ├── gallery-03-concentric-rings.png
    ├── gallery-04-curved-hull.png
    └── gallery-05-clay-overview.png
```

**Nota sobre el bucket name:** El bucket se llama `project-images` aunque almacena también videos y modelos 3D.

---

## 23. VISOR 3D INTERACTIVO EN PÁGINAS DE PROYECTO

### 23.1 El componente ModelViewer

**Archivo:** `components/three/ModelViewer.tsx`

```tsx
'use client'  // Requiere cliente porque usa WebGL

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Center, Html } from '@react-three/drei'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)   // Carga el archivo .glb
  // Activa sombras en todas las mallas del modelo
  scene.traverse(child => {
    if (child.isMesh) { child.castShadow = true; child.receiveShadow = true }
  })
  return <Center><primitive object={scene} dispose={null} /></Center>
}

export function ModelViewer({ url, height = 420, autoRotate = true }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} shadows dpr={[1, 2]}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, 4, 4]} intensity={0.6} color="#8b5cf6" />  {/* Violeta Midnight */}

      <Suspense fallback={<Html center>Cargando modelo...</Html>}>
        <Model url={url} />
        <Environment preset="city" />  {/* Iluminación ambiental */}
      </Suspense>

      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={2.5}
        enableZoom
        enablePan={false}
        minDistance={1.5}
        maxDistance={10}
      />
    </Canvas>
  )
}
```

### 23.2 Integración en la página de proyecto

**Archivo:** `app/[locale]/projects/[slug]/page.tsx`

El ModelViewer se carga con `dynamic import` para evitar errores de SSR (Three.js requiere el navegador para acceder a WebGL):

```tsx
import dynamic from 'next/dynamic'

// SSR: false — No renderizar en el servidor (WebGL no existe allí)
const ModelViewer = dynamic(
  () => import('@/components/three/ModelViewer').then(m => m.ModelViewer),
  { ssr: false }
)

// En el JSX, aparece automáticamente si el proyecto tiene model_url:
{project.model_url && (
  <div>
    <h2>Interactive 3D Model</h2>
    <ModelViewer url={project.model_url} height={480} autoRotate />
    <p>Drag to rotate · Scroll to zoom</p>
  </div>
)}
```

### 23.3 Formato del archivo 3D

El ModelViewer acepta archivos **GLB** (binary glTF). El GLB es el formato estándar para modelos 3D en la web porque:
- Es binario (más compacto que GLTF JSON)
- Embebe texturas dentro del mismo archivo
- Compatible con Three.js directamente

**Limitaciones de tamaño:**
- Supabase Storage: máximo 50MB por archivo (plan gratuito)
- El modelo Alien Mothership original (1.4M triángulos) pesa 104MB — excede el límite
- Solución: decimarlo en Blender con Decimate modifier (ratio ~0.05) + exportar con compresión Draco

**Cómo exportar desde Blender:**
```
File → Export → glTF 2.0 (.glb/.gltf)
Opciones:
  ✓ Draco mesh compression  ← Reduce el tamaño drásticamente
  ✓ Apply modifiers
Guardar como: Alien-Mothership-optimized.glb
```

---

## 24. PANEL ADMIN — MÓDULO NOTAS Y PLANES

### 24.1 ¿Qué es y para qué sirve?

El módulo **Notes & Plans** es una sección privada del admin para que Joshua pueda documentar, planificar y dar seguimiento a ideas de negocio, estrategias de contenido, y cualquier concepto que quiera desarrollar. No tiene presencia pública.

**Acceso:** `/admin/notes`

### 24.2 Estructura de archivos

```
app/admin/notes/
├── page.tsx              ← Lista de todas las notas
├── actions.ts            ← Server Actions (crear, actualizar, eliminar)
├── NoteRowActions.tsx    ← Botón de eliminar (cliente)
├── new/
│   └── page.tsx          ← Formulario para crear nota nueva
└── [id]/edit/
    └── page.tsx          ← Formulario para editar nota existente
```

### 24.3 Los estados de una nota

```
💡 idea          → Idea inicial, sin desarrollar
📋 planning      → En proceso de planificación
🚀 in-progress   → Siendo ejecutada activamente
✅ done          → Completada
```

### 24.4 Server Actions del módulo

```tsx
// app/admin/notes/actions.ts
'use server'

export async function createNote(formData: FormData) {
  // Extrae: title, body, status, tags (comma-separated → array)
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
  await supabase.from('notes').insert({ title, body, status, tags })
  revalidatePath('/admin/notes')
  redirect('/admin/notes')
}

export async function updateNote(id: string, formData: FormData) {
  await supabase.from('notes').update({
    title, body, status, tags,
    updated_at: new Date().toISOString()
  }).eq('id', id)
  redirect('/admin/notes')
}

export async function deleteNote(id: string) {
  await supabase.from('notes').delete().eq('id', id)
  revalidatePath('/admin/notes')
}
```

---

## 25. MAPA COMPLETO DE RUTAS DEL PROYECTO

### 25.1 Rutas públicas

```
Dominio base: joshtvr.com (en producción) | localhost:3000 (en desarrollo)

/                          → Redirige a /{locale} según el navegador
/{locale}                  → Página de inicio (all-in-one: Hero, About, Skills,
                             Projects, Experience, GitHub Stats, Certifications,
                             Testimonials, Contact)
  Ejemplo: /es, /en

/{locale}/projects/{slug}  → Página de detalle de proyecto
  Ejemplos:
    /es/projects/clubit-vr
    /es/projects/alien-mothership
    /es/projects/cells-animation
    /es/projects/torturama
    /es/projects/business-intelligence
    /es/projects/matplotlib-zero-to-hero
    /es/projects/data-analytics-digital-business
    /es/projects/steam-train
    /es/projects/filtration-process-animation
    /es/projects/zgen-freasky
    /es/projects/tie-fighter
    /es/projects/mr-meeseek
    /es/projects/cartoon-bread

/{locale}/services          → Página de servicios con formulario de contacto
/{locale}/services/track/{id} → Seguimiento de servicio contratado
/{locale}/store             → Tienda de productos digitales
/{locale}/store/success     → Página de confirmación de compra
/{locale}/orders            → Historial de órdenes del usuario (requiere auth)

/og                         → Generación de imagen OG (Open Graph)
                              (excluido del i18n middleware para evitar /es/og 404)
```

### 25.2 Rutas de API

```
POST /api/inquiries                → Guarda mensaje del formulario de contacto
GET  /api/auth/callback            → Callback OAuth para el ADMIN (GitHub → JoshTVR)
GET  /api/auth/user-callback       → Callback OAuth para USUARIOS normales
POST /api/stripe/checkout          → Inicia sesión de pago en Stripe
POST /api/stripe/webhook           → Recibe confirmación de pago de Stripe
GET  /api/github/stats             → Estadísticas de GitHub (con caché)
```

### 25.3 Rutas del admin (requieren autenticación como JoshTVR)

```
/admin                         → Dashboard (stats + inquiries recientes)
/admin/login                   → Login con GitHub OAuth

/admin/projects                → Lista de todos los proyectos
/admin/projects/new            → Crear proyecto nuevo
/admin/projects/{id}/edit      → Editar proyecto existente

/admin/services                → Lista de servicios
/admin/services/new            → Crear servicio nuevo
/admin/services/{id}/edit      → Editar servicio existente

/admin/store                   → Lista de productos de la tienda
/admin/store/new               → Crear producto nuevo
/admin/store/{id}/edit         → Editar producto existente

/admin/orders                  → Lista de órdenes de clientes
/admin/inquiries               → Lista de consultas del formulario de contacto

/admin/notes                   → Lista de notas y planes personales
/admin/notes/new               → Crear nota nueva
/admin/notes/{id}/edit         → Editar nota existente

/admin/settings                → Configuración global del sitio
```

### 25.4 Cómo funciona el middleware (guardián de rutas)

**Archivo:** `middleware.ts`

El middleware se ejecuta en CADA petición HTTP antes de que llegue a la página. Hace tres cosas:

```
Petición entrante
        │
        ▼
¿La ruta está en la lista de exclusiones?
  (/_next/*, /api/*, /og, /favicon.ico, /imgs/*)
        │
   SÍ ─┼─ Pasa directamente (sin tocar)
        │
   NO ──┼──▶ ¿Empieza con /admin?
              │
         NO ──┼──▶ Aplica middleware de i18n (agrega /es o /en al path)
              │
         SÍ ──┼──▶ ¿Es exactamente /admin/login?
                   │
              SÍ ──┼──▶ Pasa (no requiere auth)
                   │
              NO ──┼──▶ Verifica sesión en Supabase
                         │
                    Sin sesión ──▶ Redirige a /admin/login
                         │
                    Con sesión ──▶ Verifica username === "JoshTVR"
                                   │
                              No match ──▶ Redirige a /?error=unauthorized
                                   │
                              Match ──▶ Acceso permitido ✅
```

---

## 26. TIMELINE DE CAMBIOS (Historia del proyecto)

Esta sección documenta cronológicamente todos los cambios significativos realizados al proyecto. Es especialmente útil para entender cómo evolucionó el sistema y qué decisiones se tomaron en cada momento.

---

### Fase 0 — Configuración inicial (Antes de enero 2026)
- Creación del proyecto Next.js 14 con App Router + TypeScript + Tailwind
- Configuración de Supabase (PostgreSQL + Auth + Storage)
- Integración de Stripe para pagos
- Sistema de autenticación dual (admin vía GitHub OAuth, usuarios vía email/Google/GitHub)
- Three.js + @react-three/fiber para gráficos 3D
- next-intl para internacionalización EN/ES
- Deploy inicial en Vercel

---

### Fase 1 — Primer diseño: Direction B (Enero–Febrero 2026)

**Commit:** `feat: Direction B redesign — developer portfolio premium aesthetic`

Primer diseño completo. Tema oscuro con fondo negro profundo (`#0a0a0a`) y acentos amarillos (`#facc15`).

**Componentes creados:**
- HeroSection con canvas 3D orbital (HeroCanvas.tsx)
- AboutSection, SkillsSection, ProjectsSection
- ExperienceSection, CertificationsSection, TestimonialsSection
- ContactSection con formulario funcional
- Navbar con toggle de idioma y modo claro/oscuro

---

### Fase 2 — Rediseño completo: Tema Midnight (Febrero–Marzo 2026)

**Commit:** `redesign: Midnight theme — slate/blue-violet palette, orb hero, editorial sections`

El usuario solicitó un rediseño total desde cero. Nuevo sistema de colores:
- Fondo: `#0f172a` (slate-900)
- Acento primario: `#3b82f6` (blue-500)
- Acento secundario: `#8b5cf6` (violet-500)

**Cambios técnicos:**
- Reescritura completa de `app/globals.css` con nuevo sistema de variables CSS
- Nuevo HeroSection con efecto de orbes flotantes y typewriter animado
- HeroCanvas simplificado (partículas flotantes en lugar de orbital)
- Sections rediseñadas con nueva tipografía (Space Grotesk + Inter)

---

### Fase 3 — Corrección de bugs críticos (Marzo 2026)

**Bug 1: Light mode**
`Commit: fix: reveal on theme change, Spanish typewriter, softer light mode background`

El modo claro tenía fondo `#fafaf0` (crema) que contrastaba brutalmente con el tema oscuro.
- Solución: cambiar a `#dce4ef` → posteriormente a `#c8d4e3` (azul-grisáceo)
- También se corrigió el typewriter para leer palabras desde `messages/es.json`

**Bug 2: Secciones con opacity:0 permanente**
`Commits: fix: global RevealObserver + softer light mode background`
`fix: RevealObserver re-runs on route change, fixing blank sections after navigation`

Las secciones tenían clase `reveal` (opacity:0) pero el IntersectionObserver no las detectaba tras la navegación entre rutas.
- Solución: crear `RevealObserver.tsx` como Client Component global montado en `layout.tsx`
- Agregar `MutationObserver` para re-observar elementos nuevos cuando cambia el DOM tras navegación

**Bug 3: OG Image 404**
`Commits: feat: update OG image to Midnight theme, fix metadata URL`
`fix: exclude /og route from i18n middleware, disable inquiries RLS`

La ruta `/og` generaba 404 porque el middleware de i18n la convertía a `/es/og` o `/en/og`.
- Solución: agregar `/og` a la lista de exclusiones del matcher del middleware

**Bug 4: Formulario de contacto "Failed to save inquiry"**
`Commit: fix: remove metadata field from inquiries insert (column doesn't exist)`
`fix: use server client for inquiries API instead of admin client`
`Supabase SQL: ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY`

Dos causas simultáneas:
1. RLS bloqueaba inserts anónimos → Solución: `DISABLE ROW LEVEL SECURITY` en tabla `inquiries`
2. El API route intentaba insertar campo `metadata` que no existe en la tabla → Solución: eliminar `metadata` del `.insert()`

---

### Fase 4 — Contenido y base de datos (Marzo 2026)

**Migración de video_url a TEXT[]**

El proyecto cells-animation necesitaba dos videos. La columna era `TEXT`, se migró a `TEXT[]`:
```sql
ALTER TABLE projects ALTER COLUMN video_url TYPE TEXT[]
USING CASE WHEN video_url IS NULL THEN NULL ELSE ARRAY[video_url] END;
```

**Corrección de mapeo de videos**

Los dos videos de células estaban con etiquetas invertidas:
- `Cells Animations.mp4` (17MB) → es EEVEE (más ligero, menos detallado)
- `Cells-Animations.mp4` (23MB) → es Cycles realista (más pesado, más detallado)

El script `update-data.mjs` los tenía al revés. Se corrigió para que el realista aparezca primero.

**Adición de columna `delivery_days` y `features_en` en `services`**
```sql
ALTER TABLE services ADD COLUMN IF NOT EXISTS delivery_days INTEGER;
ALTER TABLE services ADD COLUMN IF NOT EXISTS features_en TEXT[];
```

**Actualización de años de proyectos**

Se verificó mediante la API de GitHub que los repos de Business Intelligence, Matplotlib y Data Analytics fueron creados en 2025. Torturama y Clubit son proyectos de 2026.

---

### Fase 5 — Nuevos proyectos y contenido (Marzo 2026)

**Clubit VR (cubit-vr)**

Proyecto de internship en Roboarts Club. Juego VR de polirritmo standalone para Meta Quest 3S.

Detalles técnicos:
- Motor: Unity 6 (URP), XR Interaction Toolkit 3.4.0
- Lenguaje: C#
- Piano 3D interactivo de 88 teclas (modelo Blender, teclas nombradas WhiteKey_X/BlackKey_X)
- Motor de polirritmo: 4 patrones simultáneos (triángulo/3, cuadrado/4, pentágono/5, hexágono/6) dibujados en Texture2D
- Modos: FreePlay (15-30s) y SongPlay (20 canciones en JSON en StreamingAssets/Songs/)
- Integración n8n webhook para captura de sesiones
- Deploy: SideQuest + ADB a Meta Quest 3S

Imágenes subidas a Supabase Storage. Video demo de 39MB subido.

**Alien Mothership**

Modelo 3D hard-surface original creado en Blender. 1,413,366 triángulos (sin texturas).
- GLB original: 104MB (demasiado para web, pendiente optimización)
- Renders finales subidos: Final-Render.jpg como portada, 5 vistas adicionales
- Estado: publicado
- Visor 3D: pendiente de GLB optimizado

**Python Essentials 1 (certificación)**

Emitida por Cisco Networking Academy / Python Institute (vía UTT). Completada el 2 de septiembre de 2025.

**Experiencias de internship**

1. Vortex Editorial / Plandi — Pixel Art Game Developer (Ene 2026 – presente)
   - Proyecto: Torturama (videojuego voxel en desarrollo)

2. Roboarts Club — VR Game Developer (Feb 24 – Mar 21, 2026)
   - Proyecto: Clubit VR

---

### Fase 6 — Admin Notes & Plans + mejoras (Marzo 2026)

**Módulo de Notas y Planes**

Nueva sección del admin para planificación personal. Permite crear, editar y eliminar notas con:
- Título, contenido (texto plano), estado y tags
- Estados: idea → planning → in-progress → done
- Primera nota creada: Plan de Marca Personal (estrategia de cursos y contenido)

**Visor 3D integrado en páginas de proyecto**

`model_url TEXT` agregado a la tabla `projects`:
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS model_url TEXT;
```

`ModelViewer` integrado en `app/[locale]/projects/[slug]/page.tsx` con `dynamic import` (ssr: false). Aparece automáticamente cuando el proyecto tiene `model_url`.

**Corrección del nombre "Clubit"**

El nombre correcto del proyecto VR es **Clubit**, no "Cubit". Se corrigió en:
- Tabla `projects` (title_en, title_es, description_en, description_es)
- Tabla `experience` (description_en, description_es de la entrada Roboarts Club)
- Script `scripts/add-content.mjs`

**Corrección de duplicado en certificaciones**

El script `add-content.mjs` se ejecutó dos veces, creando dos entradas de "Python Essentials 1". Se eliminó el duplicado y se corrigió el nombre en español a "Fundamentos de Python 1".

**Corrección de fechas de experiencia**

- Roboarts Club / Clubit: `2026-02-24` → `2026-03-21`
- Vortex Editorial / Plandi (Torturama): `2026-01-01` → presente (end_date = NULL)

**Página pública de servicios — conectada a DB y agrupada por categoría**

`app/[locale]/services/page.tsx` convertido a Server Component. Ya no usa un array estático hardcodeado — lee directamente de Supabase y agrupa los servicios por `category`. Arquitectura:

- `page.tsx` (Server): fetch a Supabase → agrupa por `category` → pasa `groups` + `groupOrder` a `ServicesClient`
- `ServicesClient.tsx` (Client): recibe los datos, renderiza secciones por categoría, gestiona el formulario multi-step de propuesta

Para crear sub-servicios/variantes (ej: "Modelado Realista" y "Low Poly Game Art"): crear dos servicios en `/admin/services` con la misma `category` (ej: `3d-art`). Aparecerán agrupados bajo la misma sección en el sitio público con heading "3D Art & Modeling".

Sin cambios de schema — se aprovecha el campo `category` existente.

**Errores de producción y sus causas raíz (Marzo 2026)**

Los siguientes bugs impidieron el deploy durante varios commits consecutivos (ccca7a1 → 40687c3). Se documentan para referencia futura:

| # | Commit donde apareció | Error | Causa raíz | Solución |
|---|---|---|---|---|
| 1 | 40687c3 | Build error: `Type does not satisfy constraint { [x: string]: never }` en `/admin/notes/new` | `NoteForm` exportado como named export desde un archivo `page.tsx` — Next.js solo permite `default` en páginas | Mover `NoteForm` a `app/admin/notes/NoteForm.tsx` separado |
| 2 | Anterior a ccca7a1 | Application error (digest: 2438100093) al entrar a `/admin/projects` | `onMouseEnter`/`onMouseLeave` en un Server Component — React no puede serializar funciones en componentes de servidor | Reemplazar handlers por clase CSS `.admin-table-row:hover` |
| 3 | 40687c3 | TypeScript: `React.CSSProperties` usado sin importar React | Archivos `notes/new/page.tsx` y `notes/[id]/edit/page.tsx` referenciaban el namespace `React` sin importarlo | Cambiar a `import type { CSSProperties } from 'react'` y usar `CSSProperties` directamente |
| 4 | Múltiples commits | Secciones del portfolio invisibles al regresar desde admin | `RevealObserver` corre su `useEffect` antes de que los elementos `.reveal` estén en el DOM (la página pública pasa por Suspense mientras carga) | Agregar `MutationObserver` en `document.body` que detecta cuando se agregan elementos `.reveal` y los observa con debounce de 60ms |

**Regla derivada de estos bugs:**
- Nunca poner event handlers (`onClick`, `onMouseEnter`, etc.) en Server Components — usar clases CSS o extraer a un Client Component separado
- Nunca exportar componentes con nombre desde archivos `page.tsx` en Next.js App Router
- Siempre correr `npm run build` localmente antes de hacer push

---

## 28. SISTEMA DE CVS

### Arquitectura

El portfolio incluye un sistema completo para gestionar múltiples versiones de CV, con links públicos únicos por versión, módulo admin para subir PDFs, y Footer dinámico.

**Versiones disponibles (8 archivos HTML en `public/cv/`):**

| Archivo | Rol | Color accent |
|---|---|---|
| `vr-developer-en.html` | VR/XR Developer | Violeta `#7c3aed` |
| `vr-developer-es.html` | Desarrollador VR/XR | Violeta `#7c3aed` |
| `3d-artist-en.html` | 3D Artist & Animator | Azul `#2563eb` |
| `3d-artist-es.html` | Artista 3D y Animador | Azul `#2563eb` |
| `data-scientist-en.html` | Data Scientist | Ámbar `#d97706` |
| `data-scientist-es.html` | Científico de Datos | Ámbar `#d97706` |
| `general-en.html` | Developer & Digital Creator | Slate `#334155` |
| `general-es.html` | Desarrollador y Creador Digital | Slate `#334155` |

**Diseño:** Fondo blanco, ATS-friendly, sin JS, ancho 794px (A4), `@media print` optimizado para 1 página exacta. Para generar el PDF: abrir el HTML en browser → Ctrl+P → Guardar como PDF → Subir en `/admin/cvs`.

### Flujo de trabajo

1. Abrir `public/cv/[version].html` en el navegador
2. Ctrl+P → "Save as PDF" (sin márgenes, escala 100%)
3. Ir a `/admin/cvs` → "Upload CV" → seleccionar el PDF
4. El sistema sube el PDF a Supabase Storage bucket `cvs`
5. Se crea un registro en la tabla `cvs` con el slug y locale
6. El CV queda disponible en `/{locale}/cv/{slug}` (ej: `/en/cv/vr-developer`)

### Schema SQL (`cvs`)

```sql
CREATE TABLE cvs (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       text NOT NULL,
  role        text NOT NULL,
  locale      text NOT NULL DEFAULT 'en',
  slug        text NOT NULL,
  file_url    text NOT NULL,
  is_featured boolean NOT NULL DEFAULT false,
  is_active   boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE cvs DISABLE ROW LEVEL SECURITY;
```

### URLs públicas

| Slug | EN | ES |
|---|---|---|
| VR Developer | `/en/cv/vr-developer` | `/es/cv/vr-developer` |
| 3D Artist | `/en/cv/3d-artist` | `/es/cv/3d-artist` |
| Data Scientist | `/en/cv/data-scientist` | `/es/cv/data-scientist` |
| General | `/en/cv/general` | `/es/cv/general` |

### Footer dinámico

`components/layout/Footer.tsx` recibe el `locale` desde `app/[locale]/layout.tsx` y consulta el CV con `is_featured = true` para ese locale. Si existe, muestra el botón de descarga apuntando al PDF en Supabase Storage. Si no existe ningún CV featured, el botón simplemente no se muestra.

Para marcar un CV como featured: ir a `/admin/cvs` → click en "☆ Feature" del CV deseado. Solo puede haber un featured por locale a la vez.

### Archivos del sistema

| Archivo | Descripción |
|---|---|
| `public/cv/*.html` | 8 CVs HTML/CSS listos para imprimir a PDF |
| `app/admin/cvs/page.tsx` | Tabla admin con lista de CVs subidos |
| `app/admin/cvs/actions.ts` | Server actions: create, delete, toggleFeatured, toggleActive |
| `app/admin/cvs/CvRowActions.tsx` | Botones de toggle/delete (Client Component) |
| `app/admin/cvs/CvUploadForm.tsx` | Formulario de upload a Supabase Storage (Client Component) |
| `app/[locale]/cv/[slug]/page.tsx` | Página pública minimalista con botón de descarga |
| `components/layout/Footer.tsx` | Footer con botón CV dinámico según featured |
| `components/layout/AdminSidebar.tsx` | Sidebar admin con enlace a /admin/cvs |

---

## 27. GLOSARIO ADICIONAL

| Término | Definición en contexto del proyecto |
|---------|-------------------------------------|
| **GLB** | Binary glTF — formato estándar para modelos 3D en web. Embebe geometría + texturas en un solo archivo binario |
| **Draco** | Algoritmo de compresión para mallas 3D. Reduce el tamaño de GLBs entre 60-90% sin pérdida visual notable |
| **Decimate** | Modificador de Blender que reduce el número de polígonos de un modelo. Ratio 0.05 = 5% de los triángulos originales |
| **URP** | Universal Render Pipeline de Unity. Pipeline de renderizado moderno, optimizado para VR y móvil |
| **XR Interaction Toolkit** | Paquete de Unity para VR/AR. Maneja controllers, ray casting, grab/poke interactions |
| **Polyrhythm** | Superposición de múltiples ritmos simultáneos con diferentes divisiones (ej: 3 contra 4 contra 5) |
| **n8n** | Plataforma de automatización de flujos (como Zapier). Recibe webhooks y ejecuta acciones |
| **SideQuest** | Tienda alternativa para Meta Quest. Permite instalar APKs sin pasar por la Meta Store |
| **ADB** | Android Debug Bridge. Herramienta de línea de comandos para comunicarse con dispositivos Android (y Quest) |
| **MutationObserver** | API del navegador que detecta cambios en el DOM (agregar/quitar nodos) |
| **IntersectionObserver** | API del navegador que detecta cuando un elemento entra o sale del viewport |
| **upsert** | Operación de BD: inserta si no existe, actualiza si ya existe (INSERT OR UPDATE) |
| **service_role_key** | Llave maestra de Supabase que bypasea todas las políticas RLS. Solo usar en el servidor |
| **revalidatePath** | Función de Next.js que invalida el caché de una ruta, forzando que se regenere |
| **dynamic import** | Importación lazy en JavaScript. Con `{ ssr: false }` evita que un módulo se ejecute en el servidor |
| **OG Image** | Open Graph image — la imagen que aparece cuando compartes un link en redes sociales |
| **Slug** | Versión URL-friendly de un nombre: "Alien Mothership" → "alien-mothership" |

---

*Documentación actualizada — Marzo 2026. Secciones 1–19 reflejan el estado inicial del proyecto. Secciones 20–27 documentan el estado actual y todos los cambios realizados.*
