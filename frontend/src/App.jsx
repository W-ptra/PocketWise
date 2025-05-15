import { BrowserRouter, Routes, Route } from "react-router-dom"
import RequestChangePassword from "./pages/requestChangePassword"
import TransactionHistory from "./pages/transactionHitory"
import ChangePassword from "./pages/changePassword"
import LandingPage from "./pages/landingPage"
import Dashboard from './pages/dashboard'
import Register from "./pages/register"
import Analysis from "./pages/analysis"
import Profile from "./pages/profile"
import Login from "./pages/login"
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <LandingPage/> } />
        <Route path="/login" element={ <Login/> } />
        <Route path="/register" element={ <Register/> } />
        <Route path="/request-change-password" element={ <RequestChangePassword/> } />
        <Route path="/change-password/:id" element={ <ChangePassword/> } />
        <Route path="/dashboard" element={ <Dashboard/> } />
        <Route path="/transaction-history" element={ <TransactionHistory/> } />
        <Route path="/analysis" element={ <Analysis/> } />
        <Route path="/profile" element={ <Profile/> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
