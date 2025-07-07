import Register from "./components/Register";
import { Route, Routes } from 'react-router-dom';
import './app.css'
import Login from "./components/Login";
function App() {

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
