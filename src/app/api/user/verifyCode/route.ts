import { dbConnection } from "@/lib/DBConnection";
import { userModel } from "@/models/User.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    await dbConnection();
    try {
        const {username,verifyCode} = await req.json();

        const decodedUsername = decodeURIComponent(username);
        const userExist = await userModel.findOne({username:decodedUsername});
        if(!userExist){
            return NextResponse.json({
                success:false,
                message:"User not Exist"
            },{status:500});
        }

        const isValidCode = verifyCode === userExist.verifyCode;
        const isCodeNotExpired = new Date(userExist.verifyCodeExpiry) > new Date();
        if(!isValidCode){
            return NextResponse.json({
                success:false,
                message:"user does't give valid code."
            },{status:400});
        }
        else if(!isCodeNotExpired) 
            return NextResponse.json({
                success:false,
                message:"user code is Expire. Please again generate code."
            },{status:400}); 
        userExist.isVerified = true;
        await userExist.save();

        return NextResponse.json({
            success:true,
            message:"Account verify Successfully"
        },{status:201});
    } catch (error) {
        console.error("Error verify user",error);
        return NextResponse.json({
            success:false,
            message:"Error verify user"
        },{status:500});
    }
}