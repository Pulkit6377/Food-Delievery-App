import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://pulkitgarg9070:Pulkit9070@cluster1.iss2ygi.mongodb.net/FOOD-DELIEVEY-APP')
    .then(()=>console.log(`DataBase connected to port`))
}