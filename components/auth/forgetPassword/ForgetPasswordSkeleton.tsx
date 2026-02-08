"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import whiteAuthBk from "@/public/assets/images/Vector.svg";

const ForgetPasswordSkeleton = () => {
  return (
    <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
      <div className="grid lg:grid-cols-2 gap-4 items-center">
        {/* Form Skeleton */}
        <div className="my-10" style={{ direction: "ltr" }}>
          {/* Title */}
          <Skeleton className="h-10 w-64 mx-auto mb-8" />

          <div className="p-4 w-[95%] md:w-[80%] mx-auto relative">
            {/* Email */}
            <div className="mb-4">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Button */}
            <Skeleton className="h-12 w-full rounded-lg mt-6" />
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="relative lg:block">
          <Image src={whiteAuthBk} className="w-full" alt="bg" />
          <Skeleton className="absolute inset-0 m-auto w-[70%] h-[50%] rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordSkeleton;
