import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar from './components/navbar/Navbar'
import { Routes ,Route } from 'react-router-dom'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Add from './pages/Add/Add'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {

    const URL = "https://food-delievery-app-1.onrender.com";

  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className="app-content">
      <Sidebar/>
      <Routes>
        <Route path='/add' element={<Add URL={URL}/>}/>
        <Route path='/list' element={<List URL={URL}/>}/>
        <Route path='/order' element={<Orders URL={URL}/>}/>

      </Routes>
      </div>
    </div>
  )
}

export default App

