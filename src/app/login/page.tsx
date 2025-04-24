"use client";

import { LoginForm } from "@/components/client-ui/login-form";
import { Loader } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const LoginPage = () => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <Loader className="h-10 w-10 animate-spin" />
      </main>
    );
  }

  if (status === "authenticated") {
    redirect("/");
  }

  console.log(status);

  const handleSubmit = async (data: { email: string; password: string }) => {
    console.log(data);

    const res = await signIn("credentials", {
      email: data?.email,
      password: data?.password,
      redirect: false,
    });

    if (res?.error) {
      console.error("Login failed:", res.error); // ← Debug
      // setError("Invalid email or password");
    }
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <section className="w-full max-w-sm md:max-w-3xl">
        <LoginForm onSubmit={handleSubmit} />
      </section>
    </main>
  );
};

export default LoginPage;
