import foodModel from "../models/foodModel.js";
import fs from 'fs'


const addFood = async(req,res) =>{

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })

    try{
        await food.save();
        res.json({success:true,message:"Food added Successfully"})
    }
    catch(error){
        res.json({success:false,message:"Error"})
    }

}

// all food list 
const listFood = async(req,res)=>{
    try{
        const foods = await foodModel.find({})
            res.status(200).json({success:true,data:foods})
        
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//remove food item
const removeFood = async(req,res)=>{

    try{
        const removeFood = await foodModel.findById(req.body.id);
            fs.unlink(`uploads/${removeFood.image}`,()=>{})
            await foodModel.findByIdAndDelete(req.body.id)
            res.status(200).json({success:true,message:"Item deleted Sucessfully"})
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false,message:"Error"})
    }
}


export {addFood,listFood,removeFood};