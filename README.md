# PomodoroBySpotify <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify" width="30"/>

Pomodoro esencial para estudiar o trabajar progresivamente con pausas activas mientras escuchas tu musica de Spotify

El desarrollo de este proyecto fue  creado con [Next.js](https://nextjs.org/) que incluye todas las configuraciones necesarias para comenzar rápidamente con desarrollo moderno en React.

---

## 🚀 Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu máquina local:

```bash
# 1. Clona el repositorio
git clone https://github.com/tuusuario/nombre-del-repo.git

# 2. Entra en el directorio del proyecto
cd nombre-del-repo

# 3. Instala las dependencias
npm install
# o si usas Yarn
# yarn install

# 4. Inicia el servidor de desarrollo
npm run dev
# o
# yarn dev

## 🌐 Requisitos
Node.js v18 o superior

npm o yarn

⚙️ Variables de entorno
Debes crear un archivo .env.local en la raíz del proyecto con tus variables necesarias. Ejemplo:

NEXT_PUBLIC_API_URL=https://api.tuservicio.com
API_KEY=123456789abcdef

________________________________________________________________________________________________________________-
## 🎧 Crear una App en Spotify

Para usar esta aplicación necesitas una cuenta de desarrollador en Spotify y crear tu propia app para obtener tus credenciales (Client ID y Client Secret).

1. Ve a la página de desarrolladores de Spotify:
   👉 [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)

2. Inicia sesión con tu cuenta de Spotify.

3. Haz clic en **"Create an App"** y completa los datos (nombre, descripción).

4. Una vez creada, entra a tu app y copia:
   - `Client ID`
   - `Client Secret`

5. Agrega una **Redirect URI** (por ejemplo, en desarrollo): http://localhost:3000/api/auth/callback/spotify

6. Pega tus credenciales en tu archivo `.env.local`:

```env
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
NEXTAUTH_URL=http://localhost:3000
____________________________________________


## 🎇 Animación de fondo con Particles.js
para visualizar correctamente el background de particulas flotantes es necesario instalar la libreria particle.js

![particles.js](https://raw.githubusercontent.com/VincentGarreau/particles.js/master/img/particlesjs-logo.png)

### Instalación
1.- npm install react-tsparticles@2.12.0 tsparticles@2.12.0



