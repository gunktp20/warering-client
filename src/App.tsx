import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Register, Login, ForgetPass , Landing} from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-pass" element={<ForgetPass />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
