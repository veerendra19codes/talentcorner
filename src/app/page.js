"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoArrowRight } from "react-icons/go";

export default function HomePage() {
  const { data: session, status } = useSession();
  // console.log("session on home:", session);
  // console.log("status:", status); //loading or authenticated
  const router = useRouter();

  useEffect(() => {   
        if (status !== "loading" && !session) {
            router.push("/login")
        }
    }, [session, status, router]);

  let route = "";

  if (status !== "loading") {
    if (session?.user?.role === "ad") {
      route = "/dashboardad";
    }
    else if (session?.user?.role === "bd") {
      route = "/dashboardbd";
    }
    else if (session?.user?.role === "sh") {
      route = "/mails";
    }
    else if (session?.user?.role === "tl") {
      route = "/assign";
    }
    else {
      route = "dashboardfr"
    }
  }
  // console.log("route:", route);

  return (
    <div className="hero flex lg:flex-col justify-center items-center gap-4 w-full  min-h-screen py-24 lg:py-0 -mt-8">
      <div className="left w-1/2 h-auto flex flex-col gap-4 justify-center items-start pl-24 lg:px-4 lg:w-full lg:gap-0 lg:items-center">
        <p className="text-5xl font-black text-white lg:text-3xl">Welcome to</p>
        <h1 className="text-5xl font-black text-blue-300  lg:text-4xl">Task Manager</h1>
        <p className="text-xl  lg:pb-0 text-slate-100 lg:text-[15px] lg:text-center lg:pt-2 lg:px-0">Your go-to app for tracking statistics, tasks delegation,seamless communication, improving efficiency and much more...</p>
        <Link href={`${process.env.NEXTAUTH_URL}/${route}`} className="rounded-2xl py-2 px-8 text-white flex font-semibold items-center text-2xl bg-gradient-to-r from-[#6157ff] to-[#ee49fd] border-[1px] border-[#6157ff] hover:shadow-2xl lg:hidden mt-8">Get started <GoArrowRight size={50} /></Link>
      </div>

      <div className="right flex justify-center items-center w-1/2 lg:w-[80%] flex-col">
        <Image src="/hero.png" width={500} height={500} alt="hero" priority={true} className="size-auto" />
      </div>

      <Link href={`${process.env.NEXTAUTH_URL}/${route}`} className="hidden  lg:flex justify-center items-center text-white gap-2 bg-gradient-to-r from-[#6157ff] to-[#ee49fd] border-[1px] border-[#6157ff] rounded-xl px-4 text-xl py-2">Get started <GoArrowRight size={30} /></Link>


    </div>
  );
}

