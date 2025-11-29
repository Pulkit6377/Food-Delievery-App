import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import Transporter from "../utils/mailer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


//placing user order from frontend

const placeOrder = async (req, res) => {
    const frontend_url = 'https://food-delievery-app-murex.vercel.app';

    try {
        const newOrder = new orderModel({
            userId: req.userId,           // 🔥 FIXED: userId from token
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();

        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });  // 🔥 FIXED

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Charges" },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        return res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Place Order Error" });
    }
};


const verifyOrder = async(req,res) =>{
    const { orderId, success } = req.body;
    const userId = req.userId;

    try {
        if(success == "true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true})

          
            const user = await userModel.findById(userId);

            const order = await orderModel.findById(orderId);
            console.log(user);

            const mailOptions = {
            from: process.env.MAIL_USER,
            to: user.email,
            subject:`your order has been palaced ${orderId}`,
            html:`
                <h2>You have Placed a order</h2>
                <p><strong>Order Items:</strong> ${order.items.length}</p>
                <p><strong>Total AMount:</strong> ${order.items.length}</p>
                <hr />
                <p>We will deilver it to fastest</p>
                <hr/>
                <p> Keep Tomato going </p>
        `};
        try{
            await Transporter.sendMail(mailOptions);
            return res.json({success:true,message:"Order Placed and mail sent"});
        } catch (err) {
            console.log("Email failed:", err);
            return res.json({success:false,message:"Order Placed but email failed"});
        }
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Error"})
        
    }

}

//userOrder for frotend

const userOrders = async(req,res) =>{
try {
    const orders = await orderModel.find({userId:req.userId})
    res.json({success:true,data:orders})
} 
catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
}
}



// listing order for admin panel 

const listOrders = async(req,res)=>{
try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
}
}

// api for updating order status

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // 1. Update order status
        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // 2. Get user email
        const user = await userModel.findById(order.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // 3. Email content based on status
        let msg = "";
        if (status === "Food Processing") msg = "Your food is being prepared! Wait for a while we serve your food";
        if (status === "Out For Delivery") msg = `Your food is on the way 🚴‍♂️! Keep $ ${order.amount} ready with you`;
        if (status === "Delivered") msg = "Your order has been delivered! Enjoy your meal ❤️";

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: user.email,
            subject: `Update on your order #${orderId}`,
            html: `
                <h2>Dear ${user.name}, </h2>
                <h3>Order Status Update</h3>
                <p><strong>Current Status:</strong> ${status}</p>
                <p>${msg}</p>
                <hr/>
                <p>Thank you for ordering with Tomato 🍅</p>
            `
        };

        await Transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Status updated + mail sent" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Status update failed" });
    }
};

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus};