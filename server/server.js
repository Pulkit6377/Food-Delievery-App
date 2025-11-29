import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import Transporter from "./utils/mailer.js";
import 'dotenv/config.js'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//app config
const app = express()
const port = 4000

//middleware
app.use(express.json());
app.use(cors());

//DB connection
connectDB();

//API Endpoint
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get("/",(req,res)=>{
    res.send("API Working")
})

app.get("/test-mail", async (req, res) => {
  try {
    await Transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: "Test Email",
      text: "This is a test mail"
    });

    res.send("Mail Sent");
  } catch (err) {
    console.log("Mail Error:", err);
    res.send("Mail Failed");
  }
});


app.listen(port,'0.0.0.0', ()=>{
    console.log(`Server Started on http://localhost:${port}`);
    
})
