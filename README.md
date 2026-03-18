# Cosmic AI

Welcome to **Cosmic AI**, a transcendent chat and journaling application that bridges the gap between human curiosity and universal wisdom. Explore the cosmos, manifest new entities, and record your journey through the ether.

Built by [@mnlawrence3-byte](https://github.com/mnlawrence3-byte).

## Features

- 🌌 **Cosmic Map**: Navigate through a visual representation of AI personalities and cosmic entities.
- 🗣️ **Resonant Echoes**: Chat with various AI manifestations, each with their own unique voice, personality, and cosmic alignment.
- 📓 **Ether Journal**: Save, search, and reflect upon your conversations and personal notes in a beautifully designed timeline.
- 🎙️ **Voice Synthesis**: Listen to the cosmic entities speak with integrated Text-to-Speech (TTS) capabilities.
- 🛠️ **Manifestation Engine**: Create and customize your own AI entities with unique prompts, avatars, and colors.
- 📱 **Responsive Design**: A fluid, glassmorphism-inspired UI that works seamlessly across desktop and mobile devices.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (v4), Framer Motion (for fluid animations)
- **Icons**: Lucide React
- **AI Integration**: Google GenAI SDK (Gemini)
- **Markdown**: React Markdown & Syntax Highlighter

## Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mnlawrence3-byte/cosmic-ai.git
   cd cosmic-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Pure HTTP Server

If you need to run the application using a pure HTTP Node.js server (e.g., for deployment on platforms like Render, Railway, or a basic VPS), a `server.js` file is included.

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the pure HTTP server:
   ```bash
   npm start
   ```
   The server will serve the static files from the `dist` directory on `http://0.0.0.0:3000`.

## Publishing to GitHub Pages (Free Hosting)

This project is pre-configured to be easily published to GitHub Pages for free.

1. Ensure your `package.json` has the correct `homepage` URL:
   ```json
   "homepage": "https://mnlawrence3-byte.github.io/cosmic-ai"
   ```
   *(Note: If your repository is named something other than `cosmic-ai`, update the URL accordingly).*

2. Update `vite.config.ts` to include the base path if you are deploying to a project repository:
   ```typescript
   export default defineConfig({
     base: '/cosmic-ai/', // Must match your repository name
     // ... rest of config
   })
   ```
   *(Note: If you are deploying to `mnlawrence3-byte.github.io` directly as a User Page, you can remove the `base` property or set it to `/`).*

3. Deploy the app:
   ```bash
   npm run deploy
   ```
   This command will automatically build the project and push the `dist` folder to the `gh-pages` branch, publishing your site!

## License

MIT License - feel free to use, modify, and distribute this cosmic creation.
