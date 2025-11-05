import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const url = "https://food-delievery-appp.onrender.com"

const PlaceOrder = () => {
  const {getTotalCartAmount,token,food_list,cartItems,URL} = useContext(StoreContext)

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    house:"",
    street:"",
    city:"",
    state:"",
    pincode:"",
    phone:""

  })

  console.log(data);
  

  const onChangehandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

const placeOrder = async(event) => {
  event.preventDefault();
  let orderItems = [];
  food_list.map((item)=>{
    if(cartItems[item._id]>0){
      let itemInfo = item;
      itemInfo["quantity"] = cartItems[item._id];
      orderItems.push(itemInfo)
    }
  })
  let orderData = {
    address:data,
    items:orderItems,
    amount:getTotalCartAmount()+2
  }  

  
  let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}})
  if(response.data.success){
    const {session_url} = response.data;
    window.location.replace(session_url)
  }
  else{
    alert("Error")
  }
}

const navigate = useNavigate();

useEffect(()=>{
  if(!token){
      alert('Login to Proceed')
      navigate('/cart')
  }
  else if(getTotalCartAmount()===0){
    alert('Add Items to Cart')
    navigate('/cart')
  }
},[token])


  return (
    <form onSubmit={placeOrder} className='palce-order'>
      <div className="place-order-left">
      <p className="title">Delievry Information</p>
      <div className="multi-fields">
        <input name='firstName' onChange={onChangehandler} value={data.firstName} type="text" placeholder='First Name' required/>
        <input name='lastName' onChange={onChangehandler} value={data.lastName} type="text" placeholder='Last Name' required/>
      </div>
      <div className="multi-fields">
      <input name='email' onChange={onChangehandler} value={data.email} type="email" placeholder='Enter Your Email' required/>
      <input name='house' onChange={onChangehandler} value={data.house} type="text" placeholder='House No./Flat No.' required/>
      </div>
      <div className="multi-fields">
        <input name='street' onChange={onChangehandler} value={data.street} type="text" placeholder='Street' required />
        <input name='city' onChange={onChangehandler} value={data.city} type="text" placeholder='City' required/>
      </div>
      <div className="multi-fields">
        <input name='state' onChange={onChangehandler} value={data.state} type="text" placeholder='State' required/>
        <input name='pincode' onChange={onChangehandler} value={data.pincode} type="text" placeholder='Pincode' required />
      </div>
      <input name='phone' onChange={onChangehandler} value={data.phone} type="text"  placeholder='Phone Number' required/>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
              <h2>Cart Total</h2>
              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>${getTotalCartAmount()}</p>
                </div>
                <hr/>
                <div className="cart-total-details">
                  <p>Delivery Fee</p>
                  <p>${getTotalCartAmount()===0?0:2}</p>
                </div>
                <hr/>
                <div className="cart-total-details">
                  <b>Total</b>
                  <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
                </div>
              </div>
              <button type='submit'>Proceed To Payment</button>
         </div>
      </div>
    </form>
  )
}

export default PlaceOrder
