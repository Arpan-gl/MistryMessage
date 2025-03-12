import { NextRequest,NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req:NextRequest){
    const token = await getToken({req:req});
    const url = req.nextUrl;

    if(token && (
        url.pathname.startsWith("/signIn") ||
        url.pathname.startsWith("/signUp") ||
        url.pathname.startsWith("/verify") ||
        url.pathname.startsWith("/")
    )){
        return NextResponse.redirect(new URL("/dashboard",req.url));
    }
}

export const config = {
    matcher:[
        "/signIn",  
        "/signUp",
        "/",
        "/dashboard/:path*",
        "/verify/:path*" 
    ]
}