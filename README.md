# Guía para Ejecutar la Aplicación Salarix

Este documento te guiará a través del proceso de configuración y ejecución de la aplicación en tu entorno local.

## Prerrequisitos

Asegúrate de tener instalados los siguientes programas:

- **MySQL** (con acceso a una base de datos local)
- **Laragon** (o cualquier servidor local compatible con PHP)
- **Node.js** y **pnpm**

## Pasos para Ejecutar la Aplicación

### 1. Configurar la Base de Datos

1. **Ejecutar el Script SQL:**
   - Navega a la carpeta `docs` en el directorio de tu backend.
   - Encuentra el archivo `script.sql` (o el nombre correspondiente) que contiene la estructura de la base de datos.
   - Abre tu cliente de MySQL (como phpMyAdmin o MySQL Workbench) y ejecuta el script para crear las tablas necesarias.

### 2. Iniciar Laragon

1. **Iniciar Laragon:**
   - Abre Laragon.
   - Asegúrate de que el servidor esté corriendo. Puedes iniciar el servidor desde el panel de control de Laragon.

2. **Agregar el Proyecto:**
   - Copia la carpeta del backend en la carpeta `www` de Laragon. Por ejemplo: `C:\laragon\www\nombre-del-proyecto-backend`.

### 3. Configurar el Proyecto Angular

1. **Abrir la Terminal:**
   - Navega a la carpeta del frontend de tu aplicación Angular.

2. **Instalar Dependencias:**
   ```bash
   pnpm install
   ng serve -o
