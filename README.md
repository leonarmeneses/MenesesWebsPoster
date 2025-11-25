# 🤖 Meneses Webs Facebook Auto-Poster

Este bot automatiza la publicación de contenido en la página de Facebook de **Meneses Webs** (Playa del Carmen). Utiliza Inteligencia Artificial para analizar imágenes de proyectos web y generar contenido promocional atractivo sobre servicios digitales.

## 🚀 Funcionalidades

*   **Publicación Automática:** Se ejecuta cada hora (cron job).
*   **Inteligencia Artificial (Gemini Vision):**
    *   Selecciona una imagen al azar de una carpeta de Google Drive.
    *   Analiza la imagen para entender qué proyecto o servicio representa.
    *   Genera contenido promocional persuasivo sobre desarrollo web, e-commerce, apps móviles o sistemas empresariales.
*   **Enfoque Local:** Incluye siempre los datos de contacto de Playa del Carmen.

## 🛠️ Tecnologías

*   Node.js
*   Google Gemini AI (Modelo `gemini-2.5-flash`)
*   Facebook Graph API
*   Google Drive API

---

## 📋 Configuración Inicial (Paso a Paso)

Antes de correr el bot, necesitas obtener las credenciales.

### 1. Facebook (Meta for Developers)

**Crear la App:**
1.  Ve a [developers.facebook.com](https://developers.facebook.com/) e inicia sesión.
2.  Click en **"Mis Apps"** → **"Crear App"**.
3.  Selecciona tipo **"Negocios"** → Siguiente.
4.  Nombre: `MenesesWebsPoster` (o el que prefieras).
5.  Email: Tu correo de contacto.
6.  Click en **"Crear App"**.

**Obtener el Token de Acceso:**
1.  Ve al [Explorador de la API Graph](https://developers.facebook.com/tools/explorer/).
### 3. Google Drive

**Crear y Configurar la Carpeta:**
1.  Ve a [drive.google.com](https://drive.google.com).
2.  Crea una nueva carpeta (ej: "Meneses Webs Imagenes").
3.  Sube imágenes de tus proyectos web, diseños, capturas de pantalla, etc.
4.  Click derecho en la carpeta → **"Compartir"**.
5.  Cambia a **"Cualquier persona con el enlace"** (modo Lector).
6.  Copia el enlace. El ID está después de `/folders/`:
    ```
    https://drive.google.com/drive/folders/1pgme1SAuZ28cfVuR_OrkseGC6h3th0-b
                                            ↑ Este es el ID
    ```

**Obtener la API Key:**
1.  Ve a [console.cloud.google.com](https://console.cloud.google.com).
2.  Crea un nuevo proyecto (ej: "Meneses Webs Bot").
3.  Ve a **"APIs y servicios"** → **"Biblioteca"**.
4.  Busca **"Google Drive API"** y habilítala.
5.  Ve a **"Credenciales"** → **"+ Crear credenciales"** → **"Clave de API"**.
6.  Copia la clave generada (empieza con `AIza...`).
    *   `pages_manage_posts`
    *   `pages_read_engagement`
    *   `pages_show_list`
6.  Click en **"Generate Access Token"** y copia el token largo.

**Obtener el ID de tu Página:**
1.  En el mismo Explorador, cambia la consulta a: `me/accounts`
2.  Click en **"Submit"**.
3.  Busca tu página en la respuesta JSON y copia el valor de `"id"`.

### 2. Google AI (Gemini)
1.  Ve a [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Crea una API Key gratuita.

### 3. Google Drive
1.  Crea una carpeta en Drive y ponla como "Pública" (Cualquiera con el enlace).
2.  Copia el ID de la carpeta (es la parte final de la URL).
3.  Usa una API Key de Google Cloud con la "Google Drive API" habilitada.

### 4. Archivo de Entorno (.env)
Crea un archivo llamado `.env` en la raíz del proyecto y pega tus datos:

```env
FACEBOOK_PAGE_ID=Tu_ID_De_Pagina
FACEBOOK_ACCESS_TOKEN=Tu_Token_Largo
GEMINI_API_KEY=Tu_Clave_Gemini
GOOGLE_DRIVE_FOLDER_ID=Tu_ID_Carpeta_Drive
GOOGLE_DRIVE_API_KEY=Tu_Clave_Drive_API
```

---

## 📦 Instalación y Uso Local

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPO>
    cd fb-auto-poster
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el bot (Modo Automático):**
    ```bash
    npm start
    ```
    *El bot se quedará corriendo y publicará cada hora.*

4.  **Prueba Manual (Publicar YA):**
    ```bash
    node src/test-run.js
    ```

---

## ☁️ Guía de Despliegue (Railway)

Para subir este bot a la nube y que funcione 24/7 sin tener tu PC encendida:

1.  **Subir a GitHub:**
    Crea un repositorio en GitHub y sube estos archivos (el `.env` no se subirá por seguridad).

2.  **Crear Proyecto en Railway:**
    *   Ve a [Railway.app](https://railway.app/).
    *   "New Project" > "Deploy from GitHub repo".
    *   Selecciona este repositorio.

3.  **Configurar Variables:**
    **IMPORTANTE:** En el panel de Railway, ve a la pestaña **Variables** y añade manualmente las mismas claves que tienes en tu `.env` local (`FACEBOOK_PAGE_ID`, `GEMINI_API_KEY`, etc.).

4.  **Listo:**
    Railway detectará el comando `npm start` y mantendrá tu bot vivo.
