# 📝 Todo App - Gestiona tus tareas

Una aplicación moderna y completa de gestión de tareas construida con **Nuxt 4**, **Vue 4**, **Pinia** y **TailwindCSS**.

![Todo App Preview](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Todo+App+Preview)

## ✨ Características

### 🔹 Funcionalidades Principales

- ✅ **CRUD completo** de tareas (crear, leer, editar, eliminar)
- 🏷️ **Gestión completa**: título, descripción opcional, estado y fecha de creación
- 🔍 **Filtros inteligentes**: todas las tareas, solo pendientes, solo completadas
- 💾 **Persistencia local**: guardado automático en localStorage
- ⚡ **Acciones en lote**: marcar todas como completadas, eliminar completadas
- 📊 **Estadísticas**: contadores y porcentaje de progreso

### 🔹 Tecnologías y Librerías

- ⚡ **Nuxt 4** - Framework full-stack para Vue.js
- 🖖 **Vue 3** - Framework progresivo de JavaScript
- 🍍 **Pinia** - Gestión de estado moderna y intuitiva
- 🎨 **TailwindCSS** - Framework CSS utility-first
- 🎯 **HeadlessUI** - Componentes accesibles sin estilos
- 🦾 **TypeScript** - Tipado estático para JavaScript

### 🔹 Diseño y UX

- 🌓 **Dark Mode** completo usando TailwindCSS
- 📱 **Diseño responsive** para todos los dispositivos
- ✨ **Animaciones suaves** con `<TransitionGroup>` de Vue
- ♿ **Accesibilidad** con HeadlessUI y buenas prácticas
- 🎭 **Feedback visual** con notificaciones y estados

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm, yarn, pnpm o bun

### Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/nuxt-todo-app.git
cd nuxt-todo-app
```

2. **Instalar dependencias**

```bash
# Con npm
npm install

# Con yarn
yarn install

# Con pnpm
pnpm install

# Con bun
bun install
```

3. **Ejecutar en modo desarrollo**

```bash
# Con npm
npm run dev

# Con yarn
yarn dev

# Con pnpm
pnpm dev

# Con bun
bun run dev
```

4. **Abrir en el navegador**

```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
📂 nuxt-todo-app/
├── 📂 assets/
│   └── 📂 css/
│       └── 📄 main.css          # Estilos principales y personalizados
├── 📂 components/
│   ├── 📄 AppHeader.vue         # Header con título y dark mode
│   ├── 📄 TodoForm.vue          # Formulario para agregar tareas
│   ├── 📄 TodoFilters.vue       # Filtros y acciones en lote
│   ├── 📄 TodoItem.vue          # Componente individual de tarea
│   └── 📄 TodoList.vue          # Lista principal con animaciones
├── 📂 layouts/
│   └── 📄 default.vue           # Layout principal de la aplicación
├── 📂 pages/
│   └── 📄 index.vue             # Página principal
├── 📂 stores/
│   └── 📄 todo.ts               # Store de Pinia para gestión de tareas
├── 📄 app.vue                   # Archivo principal de la aplicación
├── 📄 nuxt.config.ts            # Configuración de Nuxt 4
├── 📄 tailwind.config.js        # Configuración de TailwindCSS
├── 📄 package.json              # Dependencias y scripts
└── 📄 README.md                 # Documentación del proyecto
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run generate     # Generar sitio estático
npm run preview      # Preview de la build de producción
```

## 🔧 Configuración

### Dark Mode

El dark mode se activa automáticamente basado en:

1. Preferencia guardada en localStorage
2. Preferencia del sistema operativo
3. Botón manual en el header

### Persistencia de Datos

- Las tareas se guardan automáticamente en `localStorage`
- Los filtros activos se mantienen entre sesiones
- Las preferencias de tema se persisten

### Personalización

Puedes personalizar fácilmente:

- Colores en `tailwind.config.js`
- Animaciones en `assets/css/main.css`
- Textos y mensajes en cada componente

## 🏗️ Arquitectura

### Store de Pinia (`stores/todo.ts`)

- **Estado**: Lista de tareas y filtro activo
- **Getters**: Tareas filtradas, contadores, estadísticas
- **Actions**: CRUD de tareas, filtros, persistencia

### Componentes

- **AppHeader**: Título, estadísticas y toggle de dark mode
- **TodoForm**: Formulario con validación para nuevas tareas
- **TodoFilters**: Filtros y acciones en lote con confirmación
- **TodoItem**: Tarea individual con edición inline y eliminación
- **TodoList**: Lista con animaciones y estados vacíos

### Características Técnicas

- ✅ TypeScript en todos los archivos
- ✅ Composables de Vue 3
- ✅ Gestión de estado reactiva
- ✅ Animaciones CSS y JS
- ✅ Accesibilidad (ARIA labels, focus management)
- ✅ Responsive design
- ✅ Error handling

## 🎨 Características de Diseño

### Animaciones

- Entrada/salida de tareas con `<TransitionGroup>`
- Hover effects en botones y tarjetas
- Loading states y spinners
- Notificaciones deslizantes

### Responsive Design

- Mobile-first approach
- Breakpoints de TailwindCSS
- Layout adaptable
- Touch-friendly en dispositivos móviles

### Dark Mode

- Transiciones suaves entre temas
- Colores optimizados para ambos modos
- Persistencia de preferencias
- Detección automática del sistema

## 🚀 Deployment

### Vercel (Recomendado)

```bash
npm run build
# Subir la carpeta .output a Vercel
```

### Netlify

```bash
npm run generate
# Subir la carpeta dist a Netlify
```

### Servidor propio

```bash
npm run build
npm run preview
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más información.

## 👨‍💻 Autor

Creado con ❤️ por [Tu Nombre](https://github.com/tu-usuario)

---

⭐ ¡No olvides darle una estrella al repo si te gustó el proyecto!

## 📸 Capturas de Pantalla

### Modo Claro

![Modo Claro](https://via.placeholder.com/600x400/F3F4F6/1F2937?text=Modo+Claro)

### Modo Oscuro

![Modo Oscuro](https://via.placeholder.com/600x400/1F2937/F9FAFB?text=Modo+Oscuro)

### Responsive

![Vista Mobile](https://via.placeholder.com/300x600/3B82F6/FFFFFF?text=Vista+Mobile)
