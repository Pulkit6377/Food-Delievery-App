import React, { useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios';

const url = "https://food-delievery-appp.onrender.com";

const Verify = () => {

    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const success = searchParams.get("success");
    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            const response = await axios.post(`${url}/api/order/verify`, {
                success,
                orderId
            });

            if (response.data.success) {
                navigate("/myorders");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.log(err);
            navigate("/");
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [])

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify;

