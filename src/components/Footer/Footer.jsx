"use client";

import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { MdCall } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { SlGlobe } from "react-icons/sl";
import { LuLink } from "react-icons/lu";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const Footer = () => {
    const { data: session, status } = useSession();

    const pathname = usePathname();
    if (pathname == '/login') {
        return '';
    }

    //if role == "bd" this nav
    const linksbd = [
        {
            id: 1,
            name: "Home",
            path: "/",
        },
        // {
        //     id: 2,
        //     name: "New",
        //     path: "/new",
        // },
        {
            id: 3,
            name: "Dashboard",
            path: "/dashboardbd",
        },
    ]

    //if role == sh, this nav
    const linkssh = [
        {
            id: 1,
            name: "Home",
            path: "/",
        },
        {
            id: 2,
            name: "Mails",
            path: "/mails",
        },
        {
            id: 3,
            name: "Dashboard",
            path: "/dashboardsh",
        },
    ]

    const linkstl = [
        {
            id: 1,
            name: "Home",
            path: "/",
        },
        {
            id: 2,
            name: "Assign",
            path: "/assign",
        },
        {
            id: 3,
            name: "Dashboard",
            path: "/dashboardtl",
        },
        // {
        //     id: 4,
        //     name: "Franchise",
        //     path: "/franchise",
        // }
    ]

    const linksfr = [
        {
            id: 1,
            name: "Home",
            path: "/",
        },
        {
            id: 2,
            name: "Dashboard",
            path: "/dashboardfr",
        },
    ]

    const linksad = [
        {
            id: 1,
            name: "Home",
            path: "/",
        },
        {
            id: 2,
            name: "Add Employee",
            path: "/addnewemployee",
        },
        {
            id: 3,
            name: "Dashboard",
            path: "/dashboardad",
        },
        {
            id: 4,
            name: "Edit Employee",
            path: "/edit",
        }
    ]

    return (
        <footer className="site-footer bg-[#222222] text-[#858585]">
            <div className="flex gap-4 py-8 px-40 lg:flex-col lg:p-4">
                <div className="w-3/6 lg:w-full flex flex-col gap-2">
                    <p><Image width={100} height={100} priority className="h-[36px] w-auto" src="/tclogo.png" alt="logo" /></p>
                    <p>Talent Corner H.R. Services Pvt. Ltd.</p>
                    <div>
                        <p className="flex items-center gap-2"><FaLocationDot color='#858585]' size={12} /> 708 &amp; 709, Bhaveshwar Arcade Annex, LBS Marg</p>
                        <p>Opp Shreyas Cinema, Ghatkopar West, Mumbai </p>
                        <p>– 400086</p>

                    </div>
                    <p className="flex items-center gap-2"><MdCall color='#858585]' size={16} /> Office- &nbsp; +91 22 4297 5100</p>
                    <p className="flex items-center gap-2"><IoMail color='#858585]' size={16} /> <a href="mailto:contact@talentcorner.in" target="_blank">contact@talentcorner.in</a></p>
                </div>
                <div className="w-1/6 lg:w-full flex flex-col gap-8 lg:gap-2">
                    <h3 className="widget-title text-2xl text-white font-bold">Explore</h3>
                    <ul className="menu flex w-full flex-wrap">
                        {session?.user?.role === 'ad' && (
                            linksad.map((link) => {
                                return (
                                    <li key={link.id} className="w-full py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                                        <Link href={link.path} aria-current="page">{link.name}</Link>
                                    </li>
                                )
                            })
                        )}
                        {session?.user?.role === 'bd' && (
                            linksbd.map((link) => {
                                return (
                                    <li key={link.id} className="w-full py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                                        <Link href={link.path} aria-current="page">{link.name}</Link>
                                    </li>
                                )
                            })
                        )}
                        {session?.user?.role === 'sh' && (
                            linkssh.map((link) => {
                                return (
                                    <li key={link.id} className="w-full py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                                        <Link href={link.path} aria-current="page">{link.name}</Link>
                                    </li>
                                )
                            })
                        )}
                        {session?.user?.role === 'tl' && (
                            linkstl.map((link) => {
                                return (
                                    <li key={link.id} className="w-full py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                                        <Link href={link.path} aria-current="page">{link.name}</Link>
                                    </li>
                                )
                            })
                        )}
                        {session?.user?.role === 'fr' && (
                            linksfr.map((link) => {
                                return (
                                    <li key={link.id} className="w-full py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                                        <Link href={link.path} aria-current="page">{link.name}</Link>
                                    </li>
                                )
                            })
                        )}
                    </ul>
                </div>
                <div className="w-2/6 lg:w-full">

                    <ul className="menu flex flex-wrap pt-16 lg:pt-4">
                        <li className="w-1/2 py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                            <a href="https://www.facebook.com/talentcornerhr/" target="_blank" className="flex items-center gap-4"><FaFacebookF /> Facebook</a>
                        </li>
                        <li className="w-1/2 py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                            <a href="https://www.linkedin.com/company/talent-corner-hr-services-pvt-ltd" target="_blank" className="flex items-center gap-4"><FaLinkedinIn /> Linkedin</a>
                        </li>
                        <li className="w-1/2 py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                            <a href="https://www.instagram.com/talentcorner_hr/" target="_blank" className="flex items-center gap-4"><TiSocialInstagram />Instagram</a>
                        </li>
                        <li className="w-1/2 py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                            <a href="https://www.youtube.com/c/TalentCorner" target="_blank" className="flex items-center gap-4"><FaYoutube />Youtube</a>
                        </li>
                        <li className="w-full py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                            <a href="https://talentcorner.in/" target="_blank" className="flex items-center gap-4"><LuLink />Official website</a>
                        </li>
                        <li className="w-full py-2 lg:py-1 text-gray-400 hover:text-gray-600 hover:translate-x-1 transition ease-in-out">
                            <a href="https://sites.google.com/tchr.co.in/talentcornerhrservices" target="_blank" className="flex items-center gap-4"><SlGlobe />Intranet site</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="">
                <div className="border-[1px] border-gray-700"></div>
                <div className="py-4 lg:py-4 px-40 lg:px-4 text-gray-400 ">Talent Corner HR Services</div>
            </div>
        </footer >
    )
}

export default Footer
