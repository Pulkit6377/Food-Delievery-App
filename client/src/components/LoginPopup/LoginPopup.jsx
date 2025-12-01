import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const LoginPopup = ({setShowLogin}) => {

const {URL,setToken} = useContext(StoreContext)

const[currState,setCurrState] = useState("Login")
const[data,setData] = useState({
  name:"",
  email:"",
  password:""
})

  const onChangeHandler = (event) =>{
    const name = event.target.name
    const value = event.target.value

    setData(data=>({...data,[name]:value}))
  }

  const onLogin = async(event) =>{
    event.preventDefault();
    let newUrl = URL;
    if(currState=="Login"){
      newUrl += "/api/user/login"
    }
    else{
      newUrl += "/api/user/register"
    }

    const response = await axios.post(newUrl,data)

    if(response.data.success){
      setToken(response.data.token);
      localStorage.setItem("token",response.data.token)
      setShowLogin(false)
    }
    else{
      alert(response.data.message);
    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(`${URL}/api/user/google-login`, {
        token: credentialResponse.credential
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        setShowLogin(false);
      } else {
        alert("Google Login Failed");
      }

    } catch (err) {
      console.log(err);
      alert("Google authentication error");
    }
  };



  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popoup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=""  />
        </div>
        <div className="login-popup-input">
            {currState==="Login"?<></>:<input name='name'onChange={onChangeHandler} value={data.name} type="text" placeholder='Enter Your Name' required />}
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Enter Your mail' required />
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Enter Password' required />
        </div>
        <button type='submit'> {currState==="Sign Up"?"Create Account":"Login"} </button>
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google Login Failed")}
          />
        </div>
        <div className="login-popup-condition">
            <input type='checkbox' required />
            <p>By continuing, i agree to the terms of use & privacy policy</p>
        </div>
        {currState === "Login"?<p>Create a new Account? <span onClick={()=>setCurrState("Sign Up")} >Click here</span> </p>
        :<p>Already have an Account? <span onClick={()=>setCurrState("Login")} >Login here</span> </p>}
      </form>
    </div>
  )
}

export default LoginPopup
