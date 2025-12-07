import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LocationProvider } from './context/LocationContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LocationProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </LocationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

