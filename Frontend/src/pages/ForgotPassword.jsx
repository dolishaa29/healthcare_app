import { useState,useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'

const ForgotPassword = () => {
    const role = useParams().role
    console.log(role)
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!email) {
            setMessage("Please enter your email");
            setLoading(false);
            return;
        }

        try{
            if(role==="user"){
                const response = await axios.post(import.meta.env.VITE_API_URL + "/userforgotpassword", 
                    { email , role }, 
                    { headers: { "Content-Type": "application/json" , Authorization: `Bearer ${Cookies.get("token")}` }, withCredentials: true }
                );
                setMessage(response.data.message || "OTP sent to your email");
            }           

            else if(role==="doctor"){
                const response = await axios.post(import.meta.env.VITE_API_URL + "/doctorforgotpassword", 
                    { email , role }, 
                    { headers: { "Content-Type": "application/json" , Authorization: `Bearer ${Cookies.get("emstoken")}` }, withCredentials: true }
                );
                setMessage(response.data.message || "OTP sent to your email");
            }
        } catch (err) {
            console.error("Forgot Password Error:", err.response ? err.response.data : err.message);
            setMessage(err.response?.data?.message || "Failed to send OTP! Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const [otp, setOtp] = useState("");
    const [otpMessage, setOtpMessage] = useState("");
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!otp) {
            setOtpMessage("Please enter the OTP");
            setLoading(false);
            return;
        }
        try {
            if(role==="user"){
                const response = await axios.post(import.meta.env.VITE_API_URL + "/userverifyotp",
                    { email, otp, role },
                    { headers: { "Content-Type": "application/json" , Authorization: `Bearer ${Cookies.get("token")}` }, withCredentials: true }
                );
                setOtpMessage(response.data.message || "OTP verified successfully");
            }
            else if(role==="doctor"){
                const response = await axios.post(import.meta.env.VITE_API_URL + "/doctorverifyotp",
                    { email, otp, role },
                    { headers: { "Content-Type": "application/json" , Authorization: `Bearer ${Cookies.get("emstoken")}` }, withCredentials: true }
                );
                setOtpMessage(response.data.message || "OTP verified successfully");
            }
        } catch (err) {
            console.error("OTP Verification Error:", err.response ? err.response.data : err.message);
            setOtpMessage(err.response?.data?.message || "Failed to verify OTP! Please try again.");
        }
        finally {
            setLoading(false);
        }
    }


  return (
    <div>
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
            <input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
            </button>
        </form>
        {message && <p>{message}</p>}
         
         <form onSubmit={handleVerifyOtp}>
            <input 
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit" disabled={loading}>
                {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
        </form>
        {otpMessage && <p>{otpMessage}</p>}



      
    </div>
  )
}

export default ForgotPassword
