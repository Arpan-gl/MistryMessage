import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerifyEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Hello world',
            react: VerificationEmail(username,verifyCode),
        });

        return {success:true,message:"verification email successfully"};
    } catch (error) {
        console.error("Error sending verification email",error);
        return {success:false,message:"failed to send verification email"}
    }
}