import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Register, Login, ForgetPass , Landing , ResetPass} from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-pass" element={<ForgetPass />} />
        <Route path="/reset-password/:token" element={<ResetPass/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
