"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
  }
  return (
    <main className="h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <Header />
        <section className="flex-1 w-full h-full p-4">
          <h1>Home</h1>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </section>
        <Footer />
      </div>
    </main>
  );
};

export default Home;
