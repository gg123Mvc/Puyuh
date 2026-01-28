import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"

import ErrorBoundary from "./ErrorBoundary"
import { ToastProvider } from "./components/Toast"
import { ConfirmProvider } from "./components/ConfirmDialog"

const path = window.location.pathname

// LOGIC: If path starts with /admin, we show React App and hide Landing
// Otherwise, we do nothing (React won't render, Landing stays visible)
if (path.startsWith('/admin')) {
  // Hide Landing View if it exists
  const landing = document.getElementById('landing-view')
  if (landing) landing.style.display = 'none'

  // ensure root exists or create it if missing (recovery)
  let root = document.getElementById("root")
  if (!root) {
     root = document.createElement('div')
     root.id = 'root'
     document.body.appendChild(root)
  }

  // Render React App
  ReactDOM.createRoot(root).render(
    <ErrorBoundary>
      <ToastProvider>
        <ConfirmProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConfirmProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}
