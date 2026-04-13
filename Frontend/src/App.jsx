import { BrowserRouter, Route, Routes } from 'react-router-dom'
import react from 'react'
import Admindashboard from './pages/Admindashboard';
import Doctorregister from './pages/Doctorregister';
import Docterdashboard from './pages/Docterdashboard';
import Userregister from './pages/Userregister';
import Userdashboard from './pages/Userdashboard';
import Viewusers from './pages/Viewusers';
import Viewdoctors from './pages/Viewdoctors';
import DoctorRequest from './pages/Doctorrequest';
import Approved from './pages/Approved';
import RejectedDoctors from './pages/RejectedDoctors';
import Appointment from './pages/Appointment';
import ViewAppointment from './pages/ViewAppointment';
import Login from './pages/Login';
import PrivateRoute from './components/priroutes';
import Userviewapp from './pages/Userviewapp';
import Doctorviewapp from './pages/Doctorviewapp';
import Adminregister from './pages/Adminregister';
import DoctorProfile from './pages/DoctorProfile';
import Changepassworddoc from './pages/changepassworddoc';
import ViewDoctorss from './pages/ViewDoctor';
import ProfileDocterForAll from './pages/ProfileDocterForAll';
import ForgotPassword from './pages/ForgotPassword';
import Viewuserall from './pages/Viewuserall';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/hehe' element={<Adminregister/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='/Admindashboard' element={<PrivateRoute><Admindashboard/></PrivateRoute>}/>
        <Route path='/Doctorregister' element={<Doctorregister/>}/>
        <Route path='/Doctordashboard' element={<Docterdashboard/>}/>
        <Route path='/Userregister' element={<Userregister/>}/>
        <Route path='/Userdashboard' element={<Userdashboard/>}/>
        <Route path='/Viewusers' element={<Viewusers/>}/>
        <Route path='/Viewdoctor' element={<Viewdoctors/>}/>
        <Route path='/Doctorrequest' element={<DoctorRequest/>}/>
        <Route path='/Approveddoctors' element={<Approved/>}/>
        <Route path='/Rejecteddoctors' element={<RejectedDoctors/>}/>
        <Route path='/Appointment' element={<Appointment/>}/>
        <Route path='/ViewAppointment' element={<ViewAppointment/>}/>
        <Route path='*' element={<h1>No Such Router Exist</h1>} />
        <Route path='/userviewapp' element={<Userviewapp/>}/>
        <Route path='/doctorviewapp' element={<Doctorviewapp/>}/>
        <Route path='/doctorprofile' element={<DoctorProfile/>}/>
        <Route path='/changepassword' element={<Changepassworddoc/>}/>
        <Route path='/ViewDoctorss' element={<ViewDoctorss/>}/>
        <Route path='/doctorprofileview/:id' element={<ProfileDocterForAll/>}/>
        <Route path='/forgotpassword/:role' element={<ForgotPassword/>}/>
        <Route path='/userbyid/:id' element={<Viewuserall/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
