import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AuthError = () => {
  return (
    <div className="flex-center flex-col gap-10">
      <h1 className="text-lg">Error</h1>

      <Link href="/login">
        <Button>Go Back</Button>
      </Link>
    </div>
  );
};

export default AuthError;
