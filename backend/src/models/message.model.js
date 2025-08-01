import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
type:mongoose.Schema.ObjectId,
ref:"User",
required: true,
    },
    receiverId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    text: {
        type:String,
    },
    image:{
        type:String,
    }
},{
    timestamps:true
});


const Message =mongoose.model("Message",messageSchema);

export default Message;
