import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
      type: String,
      required: function () {
        return this.authType === "local"; // password required ONLY for normal users
      },
    },
    authType: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    cartData:{
        type:Object,
        default:{}
    }
},{minimize:false})

const userModel = mongoose.model.user || mongoose.model("user",userSchema);

export default userModel;