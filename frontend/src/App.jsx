import { Route, Routes } from 'react-router-dom';
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home"
import Layout from "./components/Layout"
import ManageRoom from "./components/ManageRoom";
import KeepLoggedin from "./components/KeepLoggedin"
import RequireAuth from "./components/RequireAuth"
import './app.css'
function App() {

  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      {/* <Route path="/register" element={<Register />} /> */}

      {/* <Route element={<KeepLoggedin />}> */}
        {/* <Route element={<RequireAuth />}> */}
          <Route path="/" element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="manage-room" element={<ManageRoom />} />
          {/* </Route> */}
        {/* </Route> */}
      </Route>
    </Routes>
  )
}

export default App
