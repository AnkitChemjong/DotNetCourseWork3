import React from 'react';
import UserNavbar from '../../Components/UserNavbar';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';
import axiosService from '@/Services/Axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(50),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const SignUp = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  const navigate=useNavigate();

  const onSubmit =async (values) => {
    try{
      const finalData={Name:values?.username,Email:values?.email,Password:values?.password};
      const response=await axiosService.post('/api/user/register',finalData);
      console.log(response);
      if(response?.status===201){
          toast.success(response?.data?.message);
          navigate('/sign-in');
      }
    }
    catch(error){
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

 
  return (
    <div className="min-h-screen max-w-screen flex flex-col">
      <UserNavbar />

      <main className="flex-1 flex items-center justify-center p-4 min-w-screen  mt-10">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="w-full shadow-xl ">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Branding */}
              <div className="hidden lg:flex bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex-col justify-center items-center text-center">
                <div className="max-w-md">
                  <div className="mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Welcome to BookStoreNepal</h2>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    Join our community of book lovers. Discover, read, and share your favorite books with thousands of readers.
                  </p>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="p-8">
                <CardHeader className="text-center space-y-2 p-0 mb-6">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Create Account
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Start your reading journey today
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="john_doe" 
                                {...field} 
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="you@example.com" 
                                {...field} 
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full h-11 mt-2 text-black "
                      >
                        Register Now
                      </Button>
                    </form>
                  </Form>
                </CardContent>

                <CardFooter className="p-0 mt-6">
                  <div className="w-full flex flex-col">
                    <Separator className="my-4" />
                    <p className="text-sm text-gray-500 text-center">
                      Already have an account?{' '}
                      <Link
                        to="/sign-in"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </CardFooter>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SignUp;