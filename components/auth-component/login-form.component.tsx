"use client";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useTransition } from "react";
import { LoginFormSchema } from "@/lib/validations/auth.validation";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useRouter, useSearchParams } from "next/navigation";

export const LogInForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const router = useRouter();
  const searchParams = useSearchParams();

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      pin: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    startTransition(async () => {
      try {
        const validated = LoginFormSchema.safeParse(values);

        if (!validated.success) return;

        const conAuth = await signIn("credentials", {
          username: validated.data.username,
          pin: validated.data.pin,
          redirectTo: DEFAULT_LOGIN_REDIRECT,
        });

        if (conAuth) {
          toast({
            variant: "success",
            title: "success",
            description: `Login success`,
            duration: 3000,
          });
        }
      } catch (err: any) {
        console.error("[ERROR]", err.message);
        toast({
          variant: "destructive",
          title: `${err}`,
          description: `Incorrect username or password`,
        });
      } finally {
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    const err = searchParams.get("error") || "";

    if (err.length > 0) {
      router.replace("/login");
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description:
          "The username or password you entered is incorrect. Please try again.",
        duration: 3000,
      });
    }
  }, [router, searchParams, toast]);

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(handleSubmit)} autoComplete="off">
        <div className="flex-center h-[400px] w-[350px] flex-col bg-white p-4">
          <div className="">
            <h1 className="text-center text-3xl font-bold">CREATUS</h1>
            <p className="text-balance text-center text-muted-foreground">
              Login
            </p>
          </div>

          <div className="mt-6 flex w-full flex-col gap-6">
            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      id="Username"
                      placeholder="username"
                      disabled={isPending || isLoading}
                      required
                    />
                  </FormControl>
                  <FormMessage className=" text-xs italic" />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="Password"
                      type="password"
                      placeholder="password"
                      disabled={isPending || isLoading}
                      required
                    />
                  </FormControl>
                  <FormMessage className=" text-xs italic" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isLoading}
            >
              {isPending ? "Loading..." : "Login"}
            </Button>
          </div>

          <div className="mt-4 w-full text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};
