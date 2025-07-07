import Register from "./components/Register";
import { Route, Routes } from 'react-router-dom';
import './app.css'
import Login from "./components/Login";
import Layout from "./components/Layout";
function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout/>}/>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
