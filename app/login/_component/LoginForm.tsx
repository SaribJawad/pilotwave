"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { CiLock, CiMail } from "react-icons/ci";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";

const loginFormScehma = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Invalid password" }),
});

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginFormScehma),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormScehma>) => {
    try {
      setIsLoading(true);
      const response = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (response!.ok) {
        router.push("/dashboard");
      } else {
        toast.error(response!.error);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (errors: FieldErrors) => {
    if (Object.values(errors).length === 2) {
      toast.error("Please fill in all fields!");
      return;
    } else {
      Object.values(errors).forEach((error) => {
        toast.error(error!.message as string);
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(onSubmit, handleError)}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative flex items-center ">
                  <span
                    className="absolute left-2 text-foreground
                  "
                  >
                    <CiMail size={17} />
                  </span>
                  <Input
                    disabled={isLoading}
                    placeholder="you@example.com"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative flex items-center ">
                  <span
                    className="absolute left-2 text-foreground
                  "
                  >
                    <CiLock size={20} />
                  </span>
                  <Input
                    disabled={isLoading}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="placeholder:text-xs pr-10 pl-10"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3  text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Button
            disabled={isLoading}
            type="button"
            size="sm"
            variant="link"
            className="self-end text-xs font-medium"
          >
            Forgot password?
          </Button>
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? <LoadingSpinner /> : "Sign in"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
