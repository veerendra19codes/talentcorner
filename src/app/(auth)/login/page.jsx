"use client";

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import { signIn, useSession } from "next-auth/react"
import { CgProfile } from 'react-icons/cg';
import { MdLockOutline } from 'react-icons/md';
import { FaLink } from 'react-icons/fa';
import { FiExternalLink } from "react-icons/fi";
import Image from "next/image"

const LoginPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [info, setInfo] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    useEffect(() => {
        if (session?.user) {
            router.push("/")
        }
    }, [status, session, router])

    const handleInput = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("")
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // console.log({ info });
        if (!info.email || !info.password) {
            // console.log("provide all details")
            setError("Must provide all credentials");
        }
        else {

            try {
                setPending(true);
                // console.log({ info })
                // console.log("callback url:", process.env.NEXTAUTH_URL);
                const res = await signIn("credentials",
                    {
                        redirect: false,
                        callbackUrl: process.env.NEXTAUTH_URL,
                        // callbackUrl: `${window.location.origin}`,
                        email: info.email,
                        password: info.password,
                    })
                // console.log("res from signIn:", res); //undefined // not valid json
                if (!res || res.error) {
                    // console.log("res.error:", res);
                    setError("Invalid Credentials.")
                    setPending(false);
                    return;
                }

                router.push("/");
                // console.log("redirected succcessfuly")
                // }, 1000);
                setPending(false);
            } catch (err) {
                // console.log("Error while logging user in page.jsx", err);
                setError("Something went wrong");
                setPending(false);
            }
        }
    }

    return (
        <div className="login h-screen overflow-y-auto py-12 flex justify-center items-center sm:px-4  bg-purple lg:text-[12px]">

            <div className="w-[500px] m-auto p-12 border-gray-400 border-[1px] rounded-lg flex flex-col justify-center items-center bg-white gap-4 sm:w-full sm:py-4 sm:px-4 sm:m-0 sm:gap-0 ">

                <div className="logo size-32 flex justify-center items-center sm:size-24">
                    <Image
                        src='/tclogo.png' alt="logo"
                        height={150}
                        width={150} priority />
                </div>
                <a href="https://sites.google.com/tchr.co.in/talentcornerhrservices" className="flex items-center justify-center gap-2  rounded-xl px-4 py-2 text-lg lg:text-xs lg:my-2 text-white bg-gradient-to-r from-darkpurple to-lightpurple" target="_blank"><p>Our Intranet Site  </p> <FiExternalLink className='size-5 lg:size-3' color='white' /></a>
                <h1 className="text-4xl font-bold sm:text-3xl text-lightpurple"
                >
                    Login
                </h1>
                <p className="text-gray-600 text-lg sm:text-base"
                >
                    Enter your email below to login
                </p>

                <form className="w-full flex flex-col justify-center items-center gap-4 sm:my-4 sm:gap-2" onSubmit={handleSubmit}>
                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg sm:gap-0">
                        <CgProfile size={40} color='purple' className="lg:size-5" />
                        <input type="email" name="email" placeholder="example@gmail.com" className="p-2  pl-4  rounded-xl w-full sm:py-1 border-none outline-none" onChange={(e) => handleInput(e)} />
                    </div>

                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg sm:gap-0">
                        <MdLockOutline size={40} color='purple' className="lg:size-5" />
                        <input type="text" name="password" placeholder="password" className="p-2  pl-4 rounded-xl w-full sm:py-1 border-none outline-none" onChange={(e) => handleInput(e)} />
                    </div>

                    {error && <span className="text-red-500 font-semibold">{error}</span>}


                    <button className="w-1/2 rounded-xl py-4 text-2xl text-white mt-6 sm:mt-4 sm:py-2 bg-purple hover:bg-lightpurple" disabled={pending ? true : false}>{pending ? "Logging in" : "Login"}</button>

                </form>
            </div>
        </div>
    )
}

export default LoginPage
