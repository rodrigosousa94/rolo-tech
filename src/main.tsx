import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './App'
import { RouterProvider } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext'

import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
