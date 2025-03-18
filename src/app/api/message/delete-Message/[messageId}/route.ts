import { dbConnection } from "@/lib/DBConnection";
import { userModel } from "@/models/User.models";
import { authOptions } from "../../../user/auth/[...nextauth]/options";
import { User } from "next-auth";
import {getServerSession} from "next-auth";

export async function DELETE(req: Request,{params}:{params:{messageId:string}}){
    const {messageId} = params;
    await   dbConnection();
    const session = await getServerSession(authOptions);
    const user:User = session?.user;
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401});
    }

    try {
        const updateResult = await userModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageId}}}
        );

        if(updateResult.modifiedCount === 0){
            return Response.json({
                success:false,
                message:"Failed to delete message or already delete"
            },{status:401});
        }

        return Response.json({
            success:true,
            message:"Message deleted successfully"
        },{status:200});
    } catch (error) {
        console.error(error);
        return Response.json({
            success:false,
            message:"Failed to delete message"
        },{status:500});
    }
}