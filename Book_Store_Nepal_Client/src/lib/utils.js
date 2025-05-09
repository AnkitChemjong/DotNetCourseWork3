import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// Book categories
export const categories = [
  "Fiction", "Non-Fiction", "Mystery", "Science Fiction", 
  "Fantasy", "Biography", "History", "Romance", 
  "Self-Help", "Children's Books", "Cookbooks", "Poetry"
];

export const discountData={
  discount:"",
  discountStartDate:"",
  discountEndDate:""
}