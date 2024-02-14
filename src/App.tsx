import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {  Landing , ResetPass , TermAndCondition} from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/reset-password/:token" element={<ResetPass/>} />
        <Route path="/term-condition" element={<TermAndCondition/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
