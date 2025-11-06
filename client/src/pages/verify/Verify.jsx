import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const url = "https://food-delievery-appp.onrender.com"

const Verify = () => {

    const [searchParams,setSearchParams] = useSearchParams();
    const orderId = req.body.orderId || req.query.orderId;
    const success = req.body.success || req.query.success;
    const navigate = useNavigate();
    
    const verifyPayment = async() =>{
        const respone = await axios.post(url+"/api/order/verify",{success,orderId});
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
