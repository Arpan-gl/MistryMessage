import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnection } from "@/lib/DBConnection";
import { userModel } from "@/models/User.models";
import { User,Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { user } from "@/models/User.models";

export const authOptions = {
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
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }
                    throw new Error('An unknown error occurred');
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
        signIn:"/signIn"
    },
    session:{
        strategy:"jwt" as const
    },
    secret:process.env.NEXTAUTH_SECRET
}; 