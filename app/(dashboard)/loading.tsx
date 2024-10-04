import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <Skeleton className="h-60" />
        <Skeleton className="h-60" />
        <Skeleton className="h-60" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <Skeleton className="h-96" />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
