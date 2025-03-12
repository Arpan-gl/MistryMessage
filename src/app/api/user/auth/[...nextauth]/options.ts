import NextAuth, { NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnection } from "@/lib/DBConnection";
import { userModel } from "@/models/User.models";

export const authOptions:NextAuthResult = NextAuth({
    providers:[
        Credentials({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"email"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials):Promise<any>{
                await dbConnection();
                try {
                    const userExistByEmail = await userModel.findOne({email:credentials.email});
                    if(!userExistByEmail){
                        throw new Error("No user find with this email");
                    }
                    if(userExistByEmail.isVerified){
                        throw new Error("Please Verify Your account first");
                    }

                    const verifyPassword = await bcrypt.compare(
                        credentials?.password as string,
                        userExistByEmail.password
                    );
                    if(!verifyPassword){
                        throw new Error("Please give valid password");
                    }
                    
                    return userExistByEmail;
                } catch (error:any) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({session,token}){
            if(token){
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessage as boolean;
                session.user.username = token.username as string;
            }
            return session;
        }
    },
    pages:{
        signIn:"/signIn"
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}); 