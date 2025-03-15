import { dbConnection } from "@/lib/DBConnection";
import { message } from "@/models/User.models";
import { userModel } from "@/models/User.models";

export async function POST(req:Request){
    await dbConnection();

    try {
        const {username,content} = await req.json();
        const user = await userModel.findOne({username});
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404});
        }
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User can't accept message"
            },{status:401});
        }
        const newMessage = {
            content:content, 
            createdAt:new Date()
        }
        user.messages.push(newMessage as message);
        await user.save();

        return Response.json({
            success:true,
            message:"Message send Successfully"
        },{status:201});
    } catch (error) {
        console.error(error);
        return Response.json({
            success:false,
            message:"Can't send message to user."
        },{status:500});
    }
}