import userModel from '../models/userModel.js'

//add items to user cart

const addToCart = async (req, res) => {
    try {
        const userId = req.userId;                      // 🔥 FIX

        let userData = await userModel.findById(userId);
        let cartData = userData.cartData;

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });  // 🔥 FIX

        res.json({ success: true, message: "Item Added to Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// remove items from user cart

const removeFromCart = async(req,res) =>{
    try{
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData

        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -= 1;

        }

        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({success:true,message:"Item Removed From Cart"})

    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

// get items form user cart

const getFromCart = async (req, res) => {
    try {
        const userId = req.userId; // 🔥 FIX

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            cartData: userData.cartData || {}
        });

    } catch (error) {
        console.log(error);
        res.json({ success:false, message:"Error" });
    }
}


export {addToCart,removeFromCart,getFromCart}