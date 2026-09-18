import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WorkkarProvider } from './context/WorkkarContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <WorkkarProvider>
        <App />
      </WorkkarProvider>
    </LanguageProvider>
  </StrictMode>,
)
