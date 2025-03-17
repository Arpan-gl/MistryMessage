"use client";
import {useState} from 'react';
import {signIn} from "next-auth/react";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const page = () => {
  const Router = useRouter();
  const [loading,setLoading] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      email:"",
      password:""
    }
  });

  const onSubmit = async (data:z.infer<typeof signInSchema>) => {
    setLoading(true);
    const response = await signIn("credentials",{
      email:data.email,
      password:data.password,
      redirect:false
    });
    if(response?.error){
      toast(response.error);
      setLoading(false);
    } else{
      toast("Login Successful");
      setLoading(false);
    }
    if(response?.url){
      toast("Login Successful");
      Router.push("/dashboard");
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Welcome Back to True Feedback
        </h1>
        <p className="mb-4">Sign in to continue your secret conversations</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Email' {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input placeholder='Password' {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className='w-full' type="submit">Sign In</Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Not a member yet?{' '}
          <Link href="/signUp" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default page;