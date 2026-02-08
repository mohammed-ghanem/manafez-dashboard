"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import whiteAuthBk from "@/public/assets/images/Vector.svg";

const LoginSkeleton = () => {
  return (
    <div className="relative grdianBK font-cairo" dir="rtl">
      <div className="grid lg:grid-cols-2 gap-4 items-center">
        {/* Form Skeleton */}
        <div className="my-10" dir="ltr">
          {/* Title */}
          <Skeleton className="h-10 w-56 mx-auto mb-8" />

          <div className="p-4 w-[95%] md:w-[80%] mx-auto">
            {/* Email */}
            <div className="mb-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Password */}
            <div className="mb-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Forget password */}
            <Skeleton className="h-4 w-32 mb-6" />

            {/* Button */}
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="relative hidden lg:block">
          <Image src={whiteAuthBk} alt="bg" priority />
          <Skeleton className="absolute inset-0 m-auto w-[70%] h-[50%] rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default LoginSkeleton;
