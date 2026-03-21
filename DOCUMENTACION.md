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
