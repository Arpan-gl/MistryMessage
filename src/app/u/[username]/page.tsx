"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


const page = () => {
  const {username} = useParams<{username:string}>();
  const [messages, setMessages] = useState(["What's your favorite movie?","Do you have any pets?","What's your dream job?"]);
  const [isLoadingSuggestMessage, setIsLoadingSuggestMessage] = useState(false);
  const [isLoadingAcceptMessage, setIsLoadingAcceptMessage] = useState(false);

  const form = useForm({
    resolver:zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  const messageContent = form.watch("content");
  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const handleSuggestMessage = async () => {
    setIsLoadingSuggestMessage(true);
    try {
      await axios.get("/api/message/suggest-messages")
        .then((res) => {
          setMessages(res.data.split('||'));
          toast.success("Messages suggested successfully");
        });
    } catch (err) {
      console.log(err);
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsLoadingSuggestMessage(false);
    }

    const onSubmit = async (data:z.infer<typeof messageSchema>) => {
      setIsLoadingAcceptMessage(true);
      try {
        await axios.post("api/message/send-message",{username,content:data.content})
        .then((res) => {
          toast.success(res.data.message);
          form.reset({...form.getValues(),content:""});
        })
      } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message);
      } finally {
        setIsLoadingAcceptMessage(false);
      }
    } 
    return (
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoadingAcceptMessage ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={isLoadingAcceptMessage || !messageContent}>
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>
  
        <div className="space-y-4 my-8">
          <div className="space-y-2">
            <Button
              onClick={handleSuggestMessage}
              className="my-4"
              disabled={isLoadingSuggestMessage}
            >
              Suggest Messages
            </Button>
            <p>Click on any message below to select it.</p>
          </div>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                {messages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              }
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default page;