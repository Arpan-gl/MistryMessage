import { dbConnection } from "@/lib/DBConnection";
import { auth } from "@/app/api/auth/[...nextauth]/options";
import { userModel } from "@/models/User.models";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    await dbConnection();

    const session = await auth();
    const user = session?.user as User | undefined;

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"Not Authenticated"
        },{status:401});
    }

    const userId = user?._id;
    const {acceptMessages} = await req.json();

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $set:{
                    isAcceptingMessage:acceptMessages
                }
            },
            {new:true}
        );
        if(!updatedUser){
            return NextResponse.json({
                success:false,
                message:"failed to update user status"
            },{status:401});
        }
        return NextResponse.json({
            success:true,
            message:"Message acceptance status updated successfully",
            data:updatedUser
        },{status:201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success:false,
            message:"failed to update user status to accept message"
        },{status:500});
    }
}

export async function GET(){
    await dbConnection();

    const session = await auth();
    const user = session?.user as User | undefined;

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"Not Authenticated"
        },{status:401});
    }

    const userId = user?._id;

    try {
        const foundUser = await userModel.findById(userId);
        if(!foundUser){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404});
        }
        return NextResponse.json({
            success:true,
            isAcceptingMessage:foundUser.isAcceptingMessage,
        },{status:201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success:false,
            message:"Error is getting message acceptance status"
        },{status:500});
    }
}