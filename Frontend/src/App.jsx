import { BrowserRouter, Route, Routes } from 'react-router-dom'
import react from 'react'
import Adminlogin from './pages/Adminlogin'
import Admindashboard from './pages/Admindashboard';
import Doctorregister from './pages/Doctorregister';
import Doctorlogin from './pages/Doctorlogin';
import Docterdashboard from './pages/Docterdashboard';
import Userregister from './pages/Userregister';
import Userlogin from './pages/Userlogin';
import Userdashboard from './pages/Userdashboard';
import Viewusers from './pages/Viewusers';
import Viewdoctors from './pages/Viewdoctors';
import DoctorRequest from './pages/doctorrequest';
import Approved from './pages/Approved';
import RejectedDoctors from './pages/RejectedDoctors';
import Appointment from './pages/Appointment';
import ViewAppointment from './pages/ViewAppointment';
import Login from './pages/Login';
import PrivateRoute from './components/priroutes';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/Adminlogin' element={<Adminlogin/>}/>
        <Route path='/Admindashboard' element={<PrivateRoute><Admindashboard/></PrivateRoute>}/>
        <Route path='/Doctorregister' element={<Doctorregister/>}/>
        <Route path='/Doctorlogin' element={<Doctorlogin/>}/>
        <Route path='/Doctordashboard' element={<Docterdashboard/>}/>
        <Route path='/Userregister' element={<Userregister/>}/>
        <Route path='/Userlogin' element={<Userlogin/>}/>
        <Route path='/Userdashboard' element={<Userdashboard/>}/>
        <Route path='/Viewusers' element={<Viewusers/>}/>
        <Route path='/Viewdoctor' element={<Viewdoctors/>}/>
        <Route path='/Doctorrequest' element={<DoctorRequest/>}/>
        <Route path='/Approveddoctors' element={<Approved/>}/>
        <Route path='/Rejecteddoctors' element={<RejectedDoctors/>}/>
        <Route path='/Appointment' element={<Appointment/>}/>
        <Route path='/ViewAppointment' element={<ViewAppointment/>}/>
        <Route path='*' element={<h1>No Such Router Exist</h1>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
