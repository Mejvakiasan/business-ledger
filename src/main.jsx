import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GroceryProvider } from './context/GroceryProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GroceryProvider>
          <App />
        </GroceryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)