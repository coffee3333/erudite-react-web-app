import './styles/App.css'
import AppRouter from "./router.jsx";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
      <HelmetProvider>
          <Toaster />
          <AppRouter />
      </HelmetProvider>
  )
}

export default App
