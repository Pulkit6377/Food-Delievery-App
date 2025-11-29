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
            const token = localStorage.getItem("token");

            console.log("VERIFY PAGE LOADED");
            console.log("success:", success);
            console.log("orderId:", orderId);
            console.log("token:", token);

            const res = await axios.post(
                `${url}/api/order/verify`,
                { success, orderId },
                { headers: { token: token } }
            );

            console.log("VERIFY RESPONSE:", res.data);

            if (res.data.success) {
                navigate("/myorders");
            } else {
                navigate("/");
            }

        } catch (err) {
            console.log("VERIFY ERROR:", err);
            navigate("/");
        }
    }

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;


