import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './Store'
import { Provider } from 'react-redux'
import { Toaster } from './Components/ui/sonner'

createRoot(document.getElementById('root')).render(
  <>
<Provider store={store}>
    <App />
    <Toaster position="top-right"/>
</Provider>
  </>,
)
