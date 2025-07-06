import Register from "./components/Register";
import { Route, Routes } from 'react-router-dom';
import './app.css'
function App() {

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
