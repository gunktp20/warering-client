import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {  Landing , ResetPass} from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/reset-password/:token" element={<ResetPass/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
