import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
console.log('Loading index.css...')
import './index.css'
console.log('index.css loaded')
console.log('Loading print.css...')
import './print.css'
console.log('print.css loaded')
import App from './App.tsx'

console.log('Main.tsx is executing')
const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

try {
  createRoot(rootElement!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log('App rendered successfully')
} catch (error) {
  console.error('Error rendering the app:', error)
}
