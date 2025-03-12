import {message} from "@/models/User.models";

export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessage?:boolean,
    messages?:Array<message>
}