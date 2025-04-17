import React from 'react';
import { Skeleton } from '../ui/skeleton';
import Load from "@/assets/load.svg";



export default function CommonSkeleton() {
  return (
   <Skeleton className="w-screen h-screen flex justify-center items-center">
      <img src={Load} alt="Loading..." className="w-40 h-40" />
   </Skeleton>
  )
}