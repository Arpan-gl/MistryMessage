import mongoose,{Schema,Document} from "mongoose";

export interface message extends Document{
    content:string,
    createdAt:Date
}

const messageSchema:Schema<message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
});

export interface user extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessage:boolean,
    messages:message[],
    createdAt:Date,
    updatedAt:Date
}

const userSchema:Schema<user> = new Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        match:[/.+\@.+\..+/,"Please use valid email"]
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    verifyCode:{
        type:String,
        required:true,
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    },
    messages:[messageSchema]
},{timestamps:true});

const messageModel = (mongoose.models.Message as mongoose.Model<message>) || mongoose.model("Message",messageSchema);
const userModel = (mongoose.models.User as mongoose.Model<user>) || mongoose.model("User",userSchema);

export {userModel};
export {messageModel};