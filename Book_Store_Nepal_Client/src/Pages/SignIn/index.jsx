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
import { useDispatch } from 'react-redux';
import { getUser } from '@/Store/Slice/UserSlice';

const SignIn = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const formSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters").max(50)
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit =async(values) => {
    try{
      const finalData={Email:values?.email,Password:values?.password};
      const response=await axiosService.post('/api/user/login',finalData);
      console.log(response);
      if(response?.status===200){
        alert(response?.data?.message);
        dispatch(getUser());
        if(response?.data?.role==='admin'){

          navigate('/admin/dashboard');
        }
        else{
          navigate('/');
        }
      }
    }
    catch(error){
      console.log(error);
      alert(error?.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />

      <main className="flex-1 flex items-center justify-center p-4 min-w-screen  mt-10">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="w-full shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="hidden lg:flex bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex-col justify-center items-center text-center">
                <div className="max-w-md">
                  <div className="mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Welcome Back</h2>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    Continue your reading journey with BookStoreNepal
                  </p>
                </div>
              </div>

              <div className="p-8">
                <CardHeader className="text-center space-y-2 p-0 mb-6">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Sign In
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Access your account
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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


                      <Button 
                        type="submit" 
                        className="w-full h-11 mt-2 text-black"
                      >
                        Sign In
                      </Button>
                    </form>
                  </Form>
                </CardContent>

                <CardFooter className="p-0 mt-6">
                  <div className="w-full flex flex-col">
                    <Separator className="my-4" />
                    <p className="text-sm text-gray-500 text-center">
                      Don't have an account?{' '}
                      <Link
                        to="/sign-up"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Sign up
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

export default SignIn;