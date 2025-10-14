import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {

    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const navigate = useNavigate();
    const {URL} = useContext(StoreContext)
    
    const verifyPayment = async() =>{
        const respone = await axios.post(URL+"/api/order/verify",{success,orderId});
        if(respone.data.success){
            navigate("/myorders")
        }
        else{
            navigate("/")
        }
    }

    useEffect(()=>{
        verifyPayment()
    },[])

  return (
    <div className='verify'>
    <div className="spinner">

    </div>
    </div>
  )
}

export default Verify
