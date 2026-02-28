import { BrowserRouter, Route, Routes } from 'react-router-dom'
import react from 'react'
import Adminlogin from './pages/adminlogin'
import Admindashboard from './pages/Admindashboard';
import Doctorregister from './pages/Doctorregister';
import Doctorlogin from './pages/Doctorlogin';
import Docterdashboard from './pages/Docterdashboard';
import Userregister from './pages/Userregister';
import Userlogin from './pages/Userlogin';
import Userdashboard from './pages/Userdashboard';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Adminlogin/>}/>
        <Route path='/AdminDashboard' element={<Admindashboard/>}/>
        <Route path='/Doctorregister' element={<Doctorregister/>}/>
        <Route path='/Doctorlogin' element={<Doctorlogin/>}/>
        <Route path='/Doctordashboard' element={<Docterdashboard/>}/>
        <Route path='/Userregister' element={<Userregister/>}/>
        <Route path='/Userlogin' element={<Userlogin/>}/>
        <Route path='/Userdashboard' element={<Userdashboard/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
