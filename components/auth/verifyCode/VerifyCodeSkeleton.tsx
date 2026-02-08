"use client";

import { Skeleton } from "@/components/ui/skeleton";

const CODE_LENGTH = 4;

const VerifyCodeSkeleton = () => {
  return (
    <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
      <div className="grid lg:grid-cols-2 gap-4 items-center">
        {/* Form Skeleton */}
        <div className="my-10" style={{ direction: "ltr" }}>
          {/* Title */}
          <Skeleton className="h-10 w-2/3 mx-auto mb-8" />

          <div className="p-4 w-[95%] md:w-[80%] mx-auto">
            {/* Email */}
            <div className="mb-6">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>

            {/* OTP */}
            <div className="mb-6">
              <Skeleton className="h-4 w-32 mb-3" />

              <div className="flex gap-3 justify-center">
                {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-14 h-14 rounded-md"
                  />
                ))}
              </div>
            </div>

            {/* Button */}
            <Skeleton className="h-12 w-full rounded-lg mb-4" />

            {/* Resend */}
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="relative lg:block hidden">
          <Skeleton className="w-full h-105 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default VerifyCodeSkeleton;
