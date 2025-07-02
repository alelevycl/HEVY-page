# Hevy Page - Formulario de Subida

Un formulario moderno construido con Next.js que permite a los usuarios enviar información junto con archivos adjuntos. Los archivos se suben automáticamente a Google Drive y se envía una notificación por email a través de Formspree.

## Características

- ✨ Interfaz moderna y responsiva
- 📁 Subida de archivos a Google Drive
- 📧 Notificaciones por email con Formspree
- 🔄 Indicador de progreso de subida
- 📱 Diseño responsive para móviles
- 🎨 UI moderna con Tailwind CSS

## Tecnologías utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Google Drive API** - Subida de archivos
- **Formspree** - Envío de emails
- **Googleapis** - Cliente de Google APIs

## Configuración

Antes de ejecutar el proyecto, necesitas configurar las APIs de Google Drive y Formspree. Consulta el archivo [SETUP.md](./SETUP.md) para instrucciones detalladas.

### Configuración rápida

1. **Google Drive API**:
   - Crea un proyecto en Google Cloud Console
   - Habilita la Google Drive API
   - Crea credenciales de servicio
   - Descarga el archivo JSON y guárdalo como `google-credentials.json`

2. **Formspree**:
   - Crea una cuenta en [Formspree.io](https://formspree.io/)
   - Crea un nuevo formulario
   - Copia el endpoint

3. **Variables de entorno**:
   Crea un archivo `.env.local`:
   ```env
   GOOGLE_DRIVE_FOLDER_ID=tu_id_de_carpeta_aqui
   GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
   FORMSPREE_ENDPOINT=https://formspree.io/f/tu_endpoint_aqui
   ```

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   └── submit-form/
│   │       └── route.ts          # API endpoint para el formulario
│   ├── components/
│   │   └── UploadProgress.tsx    # Componente de progreso
│   ├── types/
│   │   └── index.ts              # Definiciones de tipos
│   ├── page.tsx                  # Página principal
│   └── layout.tsx                # Layout de la aplicación
├── SETUP.md                      # Instrucciones de configuración
└── README.md                     # Este archivo
```

## Uso

1. Abre la aplicación en tu navegador
2. Completa el formulario con tu nombre y descripción
3. Opcionalmente, adjunta un archivo
4. Haz clic en "Enviar formulario"
5. El archivo se subirá a Google Drive y recibirás una notificación por email

## Formato de archivos soportados

- Documentos: PDF, DOC, DOCX
- Imágenes: JPG, JPEG, PNG, GIF

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
