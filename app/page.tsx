"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const HomePage = () => {
  const router = useRouter();
  const [progress, setProgress] = React.useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          clearInterval(interval);
          return 100;
        }
        return value + 20;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      router.push("/login");
    }
  }, [progress, router]);

  return (
    <div className="screen-size flex flex-col items-center justify-around">
      <div className="grid justify-items-center  gap-y-20 ">
        <Image
          src="/assets/images/cweetlabs/CWEETLAB_512x512.svg"
          alt="logo"
          width={512}
          height={512}
        />
        <Progress value={progress} className="w-1/2" />
      </div>
    </div>
  );
};

export default HomePage;
