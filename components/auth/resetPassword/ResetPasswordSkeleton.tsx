"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ResetPasswordSkeleton = () => {
  return (
    <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
      <div className="grid lg:grid-cols-2 gap-4 items-center">
        {/* Form Skeleton */}
        <div className="my-10" style={{ direction: "ltr" }}>
          {/* Title */}
          <Skeleton className="h-10 w-2/3 mx-auto mb-8" />

          <div className="p-4 w-[95%] md:w-[80%] mx-auto">
            {/* Password */}
            <div className="mb-4">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Button */}
            <Skeleton className="h-12 w-40 rounded-lg mt-6" />
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="relative lg:block">
          <Skeleton className="w-full h-105 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSkeleton;
