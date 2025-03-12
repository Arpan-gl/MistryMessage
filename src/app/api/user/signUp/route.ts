import { dbConnection } from "@/lib/DBConnection";
import { sendVerifyEmail } from "@/helper/sendVerificationEmail";
import { userModel } from "@/models/User.models";
import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest){
    await dbConnection();
    try {
        const {username,email,password} = await req.json();

        const userExistAndVerified = await userModel.findOne({username:username,isVerified:true});
        if(userExistAndVerified) return NextResponse.json({message:"User already exist and verified"},{status:404});
        
        const userExistByEmail = await userModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();
        if(userExistByEmail){
            if(userExistByEmail.isVerified){
                return NextResponse.json({
                    succees:false,
                    message:"User already Exist with this email"
                },{status:400});
            }
            else {
                const hashPassword = await bcrypt.hash(password,10);

                userExistByEmail.password = hashPassword;
                userExistByEmail.verifyCode = verifyCode;
                userExistByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await userExistByEmail.save();
            }
        } else {
            const salt = bcrypt.getSalt("10");
            const hashPassword = await bcrypt.hash(password,salt);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            await userModel.create({
                username,
                email,
                password:hashPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            });
        }
        const emailVerificationResponse = await sendVerifyEmail(email,username,verifyCode);

        if(!emailVerificationResponse.success){
            return NextResponse.json({
                success:false,
                message:emailVerificationResponse.message 
            },{status:500});
        }
        return NextResponse.json({
            succees:true,
            message:"User register Successfully and virify also."+emailVerificationResponse.message
        },{status:201});
    } catch (error) {
        console.error("Error in register user",error);
        return NextResponse.json({
            success:false,
            message:"Error in register user"
        },{status:500}); 
    }
}