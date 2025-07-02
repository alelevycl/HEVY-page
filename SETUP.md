# Configuración del Proyecto

Este proyecto requiere configuración de Google Drive API y Formspree para funcionar correctamente.

## 1. Configuración de Google Drive API

### Paso 1: Crear un proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la Google Drive API

### Paso 2: Crear credenciales de servicio
1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "Service Account"
3. Completa la información del servicio
4. Descarga el archivo JSON de credenciales
5. Coloca el archivo en la raíz del proyecto como `google-credentials.json`

### Paso 3: Obtener el ID de la carpeta de Google Drive
1. Ve a Google Drive
2. Crea una nueva carpeta o selecciona una existente
3. Comparte la carpeta con el email del servicio (encontrado en el archivo JSON)
4. Copia el ID de la carpeta de la URL

### Paso 4: Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
GOOGLE_DRIVE_FOLDER_ID=tu_id_de_carpeta_aqui
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

## 2. Configuración de Formspree

### Paso 1: Crear cuenta en Formspree
1. Ve a [Formspree.io](https://formspree.io/)
2. Crea una cuenta gratuita
3. Crea un nuevo formulario

### Paso 2: Obtener el endpoint
1. En tu formulario de Formspree, copia el endpoint
2. Agrega la variable de entorno:

```env
FORMSPREE_ENDPOINT=https://formspree.io/f/tu_endpoint_aqui
```

## 3. Archivo .env.local completo

```env
# Google Drive Configuration
GOOGLE_DRIVE_FOLDER_ID=tu_id_de_carpeta_aqui
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Formspree Configuration
FORMSPREE_ENDPOINT=https://formspree.io/f/tu_endpoint_aqui
```

## 4. Instalación y ejecución

```bash
npm install
npm run dev
```

## Notas importantes

- Asegúrate de que el archivo `google-credentials.json` esté en la raíz del proyecto
- El email del servicio debe tener permisos de escritura en la carpeta de Google Drive
- Para producción, considera usar variables de entorno del servidor en lugar de archivos locales 