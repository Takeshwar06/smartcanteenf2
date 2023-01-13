import React from 'react'
import { useState } from 'react'
import foodContext from './foodContext'
import axios from 'axios';
import { addorder,
 EmployeeId, 
 getAllFoodsRoute,
 getkey,
 host,
 ordergenerate,
 paymentVarification,
 } from '../../../utils/APIRoutes';

// import { useNavigate } from 'react-router-dom';
export default function FoodState(props) {
  // const navigate=useNavigate();

  const [message,setMessage]=useState(true);
  const [refreshAfterAddFood,setRefreshAfterAddFood]=useState(null);
  const [foods,setfoods]=useState([]);
  const [available,setAvailable]=useState([]);
  // fetch all fooditems to database

  const showAllFoods=async()=>{
    
    const response= await fetch(getAllFoodsRoute,{
        method:'GET',
        headers:{
          "Content-Type":"application/json",
        },
      })
      const json=await response.json();
      setfoods(json);
      
  }
  
  // payment process code
  const paymentProcess=async(food,foodcount)=>{

    try{
      const {data:{key}} =await axios.get(getkey);
      const {data:{order}}= await axios.post(ordergenerate,{
      amount:food.foodprice*foodcount
     }) //first generate order 


    // varification
    const options = {
      key: key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "mr.tiger",
      description: "Test Transaction",
      image: '../../../../public/images/rungtaLogo.jpg',
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: paymentVarification,
      prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9691382427"
      },
      notes: {
          "address": "Razorpay Corporate Office"
      },
      theme: {
          "color": "black"
      }
  };
  
  const razor = new window.Razorpay(options);
    razor.open();
    }
    catch(err){
        console.log(err);
    }
  }

  const addOrder=async(food,foodcount,order_id)=>{
         const response= await axios.post(addorder,{
         foodname:food.foodname,
         UserId:localStorage.getItem("UserId"),
         EmployeeId:EmployeeId,
         foodQuantity:foodcount,
         foodprice:food.foodprice,
         foodimg:food.foodimg,
         placed:false,
         order_id:order_id
        })
       
      if(response){
        setRefreshAfterAddFood(order_id);
      }
     
  }

  return (
       <foodContext.Provider value={{
       addOrder,
       setfoods,
       refreshAfterAddFood,
       message,setMessage,
       showAllFoods,
       foods,    
       available,
       paymentProcess,
       setAvailable}}>
           {props.children}
       </foodContext.Provider>
  )
}
