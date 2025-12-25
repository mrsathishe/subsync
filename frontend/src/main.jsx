import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RouteProvider } from '@/providers/RouteProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import App from '@/App'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <RouteProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </RouteProvider>
        </BrowserRouter>
    </React.StrictMode>
)
