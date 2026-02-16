import { LogInForm } from "@/components/auth-component";
import Image from "next/image";
import Link from "next/link";

const LoginPage = async () => {
  return (
    <div className="flex-center md:justify-stretch">
      <div className="flex flex-col items-center justify-center">
        <LogInForm />

        <Link
          href="/monit"
          className="mx-6 mt-4 rounded-md bg-blue-100 px-4 py-1.5 text-sm text-blue-500 hover:bg-blue-200"
        >
          WIP Monitor
        </Link>
      </div>

      <div className="relative hidden h-[400px] w-[350px] p-2 md:block">
        <Image src="/assets/images/CI-10.jpg" alt="ciimage" fill />
      </div>
    </div>
  );
};

export default LoginPage;
