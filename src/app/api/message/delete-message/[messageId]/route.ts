import { dbConnection } from "@/lib/DBConnection";
import { userModel } from "@/models/User.models";
import { auth } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest,{params}:{params:{messageId:string}}){
    const {messageId} = params;
    await   dbConnection();
    const session = await auth();
    const user = session?.user as User | undefined;

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"Not Authenticated"
        },{status:401});
    }

    try {
        const updateResult = await userModel.updateOne(
            {_id:user?._id},
            {$pull:{messages:{_id:messageId}}}
        );

        if(updateResult.modifiedCount === 0){
            return NextResponse.json({
                success:false,
                message:"Failed to delete message or already delete"
            },{status:401});
        }

        return NextResponse.json({
            success:true,
            message:"Message deleted successfully"
        },{status:200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success:false,
            message:"Failed to delete message"
        },{status:500});
    }
}