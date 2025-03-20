import { dbConnection } from "@/lib/DBConnection";
import { userModel } from "@/models/User.models";
import { auth } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(){
    await   dbConnection();
    const session = await auth();
    const user = session?.user as User | undefined;
    
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401});
    }

    const userId = new mongoose.Types.ObjectId(user?._id);

    try {
        const user = await userModel.aggregate([
            {$match:{id:userId}},
            {$unwind:"$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id:"$_id",messages:{$push:"$messages"}}}
        ]);
        if(!user || user.length === 0){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:401});
        }
        return Response.json({
            success:true,
            messages:user[0].messages
        },{status:200});
    } catch (error) {
        console.error(error);
        return Response.json({
            success:false,
            message:"Can't get message from the user"
        },{status:500});
    }
}