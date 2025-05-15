import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from './pages/dashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={ <Dashboard/> } />
        {/*<Route path="/login" element={ <Login/> } />*/}
      </Routes>
    </BrowserRouter>
  )
}

export default App
