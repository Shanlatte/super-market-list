---
description: Cómo desplegar esta aplicación en Vercel
---

# Guía de Despliegue en Vercel

Sigue estos pasos para llevar tu **Lista de Supermercado** a producción:

## Opción 1: Usando GitHub (Recomendado)

1.  **Sube tu código a GitHub**:
    - Crea un repositorio en GitHub.
    - Sube tu proyecto local a ese repositorio.
2.  **Conéctalo a Vercel**:
    - Entra en [Vercel](https://vercel.com) e inicia sesión.
    - Haz clic en **"Add New"** > **"Project"**.
    - Selecciona tu repositorio de GitHub.
3.  **Configura Variables de Entorno**:
    - Durante la configuración, verás una sección llamada **"Environment Variables"**.
    - Añade las variables que tienes en tu archivo `.env.local`:
      *   `NEXT_PUBLIC_SUPABASE_URL`
      *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4.  **Despliega**:
    - Haz clic en **"Deploy"**. ¡Listo!

## Opción 2: Usando Vercel CLI

Si tienes instalado el CLI de Vercel (`npm i -g vercel`), sigue estos pasos en tu terminal:

1.  **Iniciar sesión**: `vercel login`
2.  **Ejecutar el despliegue**: `vercel`
3.  **Seguir las instrucciones**: Vercel te preguntará si quieres configurar el proyecto. Responde que **Sí**.
4.  **Configurar Variables**: Una vez el proyecto esté creado en el dashboard de Vercel, asegúrate de añadir las variables de entorno de Supabase antes del despliegue final.

> [!IMPORTANT]  
> Recuerda que para que la aplicación funcione en producción, tu base de datos en **Supabase** debe estar configurada (usando el archivo `supabase_setup.sql`).
