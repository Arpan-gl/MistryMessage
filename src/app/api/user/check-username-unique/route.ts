import { dbConnection } from "@/lib/DBConnection";
import { userModel } from "@/models/User.models";
import { z } from "zod"; 
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username:usernameValidation
});

export async function GET(req:Request){
    await dbConnection();

    try { 
        const {searchParams} = new URL(req.url);
        const queryParams = {
            username:searchParams.get("username"),
        }
        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log(result);

        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message:usernameError?.length > 0?usernameError.join(', ') : "Invalid query parameter",
            },{status:400});
        }

        const {username} = result.data;

        const verifiedUserExist =  await userModel.findOne({username,isVerified:true});
        if(verifiedUserExist){
            return Response.json({success:false,message:"username is already exist"},{status:400});
        }
        return Response.json({
            success:true,
            message:"Username is unique and you take it"
        },{status:201});
    } catch (error) {
        console.error("Error checking username",error);
        return Response.json({
            success:false,
            message:"Error checking username"
        },{status:500});
    }
}