import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnection } from "@/lib/DBConnection";
import { userModel } from "@/models/User.models";
import { User,Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { user } from "@/models/User.models";
import NextAuth from "next-auth";

export const auth = NextAuth({
    providers:[
        Credentials({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"email"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials):Promise<user | any>{
                await dbConnection();
                try {
                    const userExistByEmail = await userModel.findOne({email:credentials?.email});
                    if(!userExistByEmail){
                        return null;
                    }
                    if(!userExistByEmail.isVerified){
                        return null;
                    }

                    const verifyPassword = await bcrypt.compare(
                        credentials?.password as string,
                        userExistByEmail.password
                    );
                    if(!verifyPassword){
                        return null;
                    }
                    return userExistByEmail;
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks:{
        async jwt({token, user}: {token: JWT, user: User}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({session,token}:{session:Session,token:JWT}){
            if(token){
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }
            return session;
        }
    },
    pages:{
        signIn:"/signIn",
        signOut:"/signOut",
        error:"/error",
    },
    session:{
        strategy:"jwt" as const
    },
    secret:process.env.NEXTAUTH_SECRET
});