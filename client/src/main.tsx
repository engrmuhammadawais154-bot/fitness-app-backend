import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log("Main.tsx starting...");

try {
  const rootElement = document.getElementById('root');
  console.log("Root element found:", rootElement);
  
  if (!rootElement) {
    throw new Error("Root element not found!");
  }
  
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log("App rendered successfully");
} catch (error) {
  console.error("Error rendering app:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>App Error</h1>
      <p>Failed to start the app. Error: ${error}</p>
      <pre>${JSON.stringify(error, null, 2)}</pre>
    </div>
  `;
}
