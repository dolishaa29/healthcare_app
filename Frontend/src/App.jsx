import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import PrivateRoute from './components/priroutes';
import Userpri from './components/Userpri';
import Doctorpri from './components/Doctorpri';
import UserLayout from './components/UserLayout';
import DoctorLayout from './components/DoctorLayout';
import AdminLayout from './components/AdminLayout';

const Admindashboard = lazy(() => import('./pages/Admindashboard'));
const Doctorregister = lazy(() => import('./pages/Doctorregister'));
const Docterdashboard = lazy(() => import('./pages/Docterdashboard'));
const Userregister = lazy(() => import('./pages/Userregister'));
const Userdashboard = lazy(() => import('./pages/Userdashboard'));
const Viewusers = lazy(() => import('./pages/Viewusers'));
const Viewdoctors = lazy(() => import('./pages/Viewdoctors'));
const DoctorRequest = lazy(() => import('./pages/Doctorrequest'));
const Approved = lazy(() => import('./pages/Approved'));
const RejectedDoctors = lazy(() => import('./pages/RejectedDoctors'));
const ViewAppointment = lazy(() => import('./pages/ViewAppointment'));
const Login = lazy(() => import('./pages/Login'));
const Userviewapp = lazy(() => import('./pages/Userviewapp'));
const Doctorviewapp = lazy(() => import('./pages/Doctorviewapp'));
const Adminregister = lazy(() => import('./pages/Adminregister'));
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'));
const Changepassworddoc = lazy(() => import('./pages/changepassworddoc'));
const ViewDoctorss = lazy(() => import('./pages/ViewDoctor'));
const ProfileDocterForAll = lazy(() => import('./pages/ProfileDocterForAll'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Viewuserall = lazy(() => import('./pages/Viewuserall'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Changepassuser = lazy(() => import('./pages/Changepassuser'));
const Rating = lazy(() => import('./pages/Rating'));
const Bot = lazy(() => import('./components/bot'));
const UserChat = lazy(() => import('./pages/UserChat'));
const DoctorChat = lazy(() => import('./pages/DoctorChat'));
const ReportAnalysis = lazy(() => import('./pages/ReportAnalysis'));
const LiveCapture = lazy(() => import('./pages/LiveCapture'));
const SlotBooking = lazy(() => import('./pages/SlotBooking'));
const Landing = lazy(() => import('./pages/Landing'));
const Meeting = lazy(() => import('./pages/Meeting'));
const NearbyHospitals = lazy(() => import('./pages/NearbyHospitals'));

function App() {
  return (
    <div>
      <BrowserRouter>
      <Suspense fallback={null}>
      <Routes>
        <Route path='/hehe' element={<Adminregister/>}/>
        <Route path='/' element={<Landing/>}/>
        <Route path='/login' element={<Login/>}/>

        <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route path='/Admindashboard' element={<Admindashboard/>}/>
          <Route path='/Viewdoctor' element={<Viewdoctors/>}/>
          <Route path='/Viewusers' element={<Viewusers/>}/>
          <Route path='/Doctorrequest' element={<DoctorRequest/>}/>
          <Route path='/ViewAppointment' element={<ViewAppointment/>}/>
        </Route>

        <Route path='/Doctorregister' element={<Doctorregister/>}/>
        <Route path='/Userregister' element={<Userregister/>}/>
        <Route path='/Approveddoctors' element={<Approved/>}/>
        <Route path='/Rejecteddoctors' element={<RejectedDoctors/>}/>
        <Route path='*' element={<h1>No Such Router Exist</h1>} />
        <Route path='/doctorprofileview/:id' element={<ProfileDocterForAll/>}/>
        <Route path='/forgotpassword/:role' element={<ForgotPassword/>}/>
        <Route path='/userbyid/:id' element={<Viewuserall/>}/>
        <Route path='/changepassworduser' element={<Changepassuser/>}/>
        <Route path='/rating/:doctorId' element={<Rating/>}/>
        <Route path='/Bot' element={<Bot/>}/>

        <Route element={<Doctorpri><DoctorLayout /></Doctorpri>}>
          <Route path='/Doctordashboard' element={<Docterdashboard/>}/>
          <Route path='/doctorviewapp' element={<Doctorviewapp/>}/>
          <Route path='/doctorprofile' element={<DoctorProfile/>}/>
          <Route path='/changepassword' element={<Changepassworddoc/>}/>
          <Route path='/doctorchat' element={<DoctorChat/>}/>
          <Route path='/meeting/:appointmentId' element={<Meeting/>}/>
        </Route>

        <Route element={<Userpri><UserLayout /></Userpri>}>
          <Route path='/Userdashboard' element={<Userdashboard/>}/>
          <Route path='/userviewapp' element={<Userviewapp/>}/>
          <Route path='/ViewDoctorss' element={<ViewDoctorss/>}/>
          <Route path='/userprofile' element={<UserProfile/>}/>
          <Route path='/userchat' element={<UserChat/>}/>
          <Route path='/ReportAnalysis' element={<ReportAnalysis/>}/>
          <Route path='/LiveCapture' element={<LiveCapture/>}/>
          <Route path='/SlotBooking' element={<SlotBooking/>}/>
          <Route path='/meeting/:appointmentId' element={<Meeting/>}/>
          <Route path='/NearbyHospitals' element={<NearbyHospitals/>}/>
        </Route>

      </Routes>
      </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App
