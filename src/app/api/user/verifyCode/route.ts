import { dbConnection } from "@/lib/DBConnection";
import { userModel } from "@/models/User.models";

export async function POST(req:Request){
    await dbConnection();
    try {
        const {username,verifyCode} = await req.json();

        const decodedUsername = decodeURIComponent(username);
        const userExist = await userModel.findOne({username:decodedUsername});
        if(!userExist){
            return Response.json({
                success:false,
                message:"User not Exist"
            },{status:500});
        }

        const isValidCode = verifyCode === userExist.verifyCode;
        const isCodeNotExpired = new Date(userExist.verifyCodeExpiry) > new Date();
        if(!isValidCode){
            return Response.json({
                success:false,
                message:"user does't give valid code."
            },{status:400});
        }
        else if(!isCodeNotExpired) 
            return Response.json({
                success:false,
                message:"user code is Expire. Please again generate code."
            },{status:400}); 
        userExist.isVerified = true;
        await userExist.save();

        return Response.json({
            success:true,
            message:"Account verify Successfully"
        },{status:201});
    } catch (error) {
        console.error("Error verify user",error);
        return Response.json({
            success:false,
            message:"Error verify user"
        },{status:500});
    }
}