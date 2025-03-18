"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import React from 'react'
import { Button } from "@react-email/components";
import { X } from "lucide-react";
import { message } from "@/models/User.models";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

interface MessageCardProps{
    message:message,
    onMessageDelete:(messageId:string) => void,
}

const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
    const handleDeleteMessage = async () => {
        try {
            await axios.delete<ApiResponse>(`/api/message/delete-Message/${message._id}`)
            .then((res) => {
                toast(res.data.message);
                onMessageDelete(message._id);
            })
        } catch (error) {
            console.error("Error in deleting message", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const axiosErrorMessage = axiosError.response?.data.message;
            toast(axiosErrorMessage);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <X className="w-5 h-5"/>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteMessage}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}

export default MessageCard;