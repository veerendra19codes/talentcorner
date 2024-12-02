// "use client";

// import React, { useState, useEffect, useContext } from 'react'
// import { useRouter } from 'next/navigation';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useSession } from 'next-auth/react';

// const NewPage = () => {
//     const router = useRouter();
//     const { data: session, status } = useSession();
//     const [toastClosed, setToastClosed] = useState(false);
//     const [info, setInfo] = useState({ companyname: "", createdBy: session?.user?.id });
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(true);
//     // console.log("session:", session);

//     useEffect(() => {
//         if (status !== "loading" && session?.user?.role !== "bd") {
//             router.back();
//         }
//         else if (status !== "loading") {
//             setLoading(false);
//         }
//     }, [session, status, router]);

//     const handleInput = (e) => {
//         setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     }

//     const handleToastClose = () => {
//         setToastClosed(true);
//     }
//     //     if (state?.success && toastClosed) {
//     //         router.push("/dashboardbd");
//     //     }
//     //     else if (state?.success) {
//     //         toast("Company listed successfully", {
//     //             position: "top-right",
//     //             autoClose: 5000,
//     //             hideProgressBar: false,
//     //             closeOnClick: true,
//     //             pauseOnHover: true,
//     //             draggable: true,
//     //             progress: undefined,
//     //             theme: "light",

//     //         });
//     //         // router.refresh("/dashboardbd")

//     //         // handleRefreshCompanies();
//     //         // fetchCompanies();
//     //     }
//     // }, [router, state?.success, toastClosed]);

//     const handleSubmit = async () => {
//         // e.preventDefault();

//         if (!info.companyname) {
//             setError("Must provide all fields");
//             return;
//         }

//         try {
//             const res = await fetch(`${process.env.NEXTAUTH_URL}/api/company`, {
//                 method: "POST",
//                 headers: {
//                     "Content-type": "application/json",
//                 },
//                 body: JSON.stringify(info),
//             });

//             // console.log("res:", res);
//             if (res.ok) {
//                 router.push("/dashboardbd");
//             } else {
//                 setError("error in posting new company")
//                 console.log("error in posting new company:", res);
//                 // throw new Error("Failed to create a topic");
//             }
//         } catch (error) {
//             // console.log(error);
//             setError("Failed to post a company"); // Set error message for API request failure
//         }
//     };

//     return (
//         <div className="flex  h-screen justify-center items-center sm:overflow-hidden sm:px-4">

//             {status !== "loading" &&
//                 <form action={handleSubmit} className="w-[450px] m-auto mt-24 p-12 pb-8 bg-white rounded-xl flex flex-col justify-center items-center gap-4 shadow-xl sm:w-full sm:m-0 sm:p-4 sm:gap-2">
//                     <h1 className="text-3xl font-bold text-darkpurple sm:text-xl sm:mb-4">Add new openings</h1>

//                     {/* <input type="hidden" name="createdBy" value={session?.user?.id} /> */}

//                     <div className="w-full flex flex-col">

//                         <label className="text-lg font-normal text-darkpurple">Company name</label>
//                         <input type="text" name="companyname" placeholder="Ex. Infosys Ltd" className="p-2  pl-4 border-2 border-gray-400 rounded-xl w-full  sm:py-1" onChange={e => handleInput(e)} />
//                     </div>

//                     {/* <div className="w-full flex flex-col">

//                         <label className="text-lg font-normal text-darkpurple">Job details</label>
//                         <input type="text" name="jobdetails" placeholder="mail url" className="p-2  pl-4 border-2 border-gray-400 rounded-xl w-full sm:py-1" onChange={e => handleInput(e)} />
//                         <p className="text-purple">Use <a href="https://chromewebstore.google.com/detail/share-emails-via-secure-u/bceemhpgjlcpelcmnipjfinfnaangpfa" target="_blank" className="underline text-blue-500">cloudhq</a> and paste the mail url here</p>
//                     </div> */}



//                     {error && (
//                         <span className="w-full font-semibold text-center text-red-600">
//                             {error}
//                         </span>
//                     )}

//                     <button type="submit" className="px-12 bg-purple text-2xl font-medium rounded-xl py-4 text-white sm:mt-2 hover:bg-lightpurple">Add</button>

//                 </form>
//             }
//             <ToastContainer onClose={handleToastClose} />
//         </div>
//     )
// }

// export default NewPage






"use client";

// import dynamic from 'next/dynamic';
import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation';
// import { useFormState } from "react-dom";
// import { addCompany } from '@/lib/actions';
import { ToastContainer, toast } from 'react-toastify';
// const ToastContainer = dynamic(() => import("react-toastify").then(module => module.ToastContainer));
// const toast = dynamic(() => import("react-toastify").then(module => module.toast));


import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
// import UserContext from '@/contexts/UserContext';
// import { useCompanies } from '@/contexts/CompaniesContext/CompaniesContext';

const NewPage = () => {
    const router = useRouter();
    // const { session, status } = useContext(UserContext);
    const { data: session, status } = useSession();
    console.log("session:", session);
    const [toastClosed, setToastClosed] = useState(false);
    const [info, setInfo] = useState({ companyname: "", createdBy: session?.user?.id });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    // console.log("session:", session);

    // useEffect(() => {
    //     if (status === "loading") {
    //         return
    //     } else if (session?.user?.role !== "bd") {
    //         router.back();
    //     }
    // }, [status, session, router]);

    useEffect(() => {
        // console.log("nextauthurl:", process.env.NEXTAUTH_URL)
        if (status !== "loading" && session?.user?.role !== "bd") {
            router.back();
        }
        else if (status !== "loading") {
            setLoading(false);
        }
    }, [session, status, router]);


    // const [pending, setPending] = useState(false);

    const handleInput = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("")
    }

    // const [state, formAction] = useFormState(addCompany, undefined);
    // const { fetchCompanies } = useCompanies();

    const handleToastClose = () => {
        setToastClosed(true);
    }

    // useEffect(() => {
    //     if (state?.success && toastClosed) {
    //         router.push("/dashboardbd");
    //     }
    //     else if (state?.success) {
    //         toast("Company listed successfully", {
    //             position: "top-right",
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "light",

    //         });
    //         // router.refresh("/dashboardbd")

    //         // handleRefreshCompanies();
    //         // fetchCompanies();
    //     }
    // }, [router, state?.success, toastClosed]);

    const handleSubmit = async () => {
        // e.preventDefault();
        setInfo((prev) => ({ ...prev, createdBy: session?.user?.id }));
        console.log("info:", info);

        if (!info.companyname) {
            setError("Must provide all fields");
            // Set error message for missing fields
            return;
        }

        try {
            // console.log("nextauthurl:", process.env.NEXTAUTH_URL)
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/company`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(info),
            });

            // console.log("res:", res);
            if (res.ok) {
                router.push("/dashboardbd");
            } else {
                setError("error in posting new company")
                console.log("error in posting new company:", res);
                // throw new Error("Failed to create a topic");
            }
        } catch (error) {
            // console.log(error);
            setError("Failed to post a company"); // Set error message for API request failure
        }
    };

    return (
        <div className="flex  h-screen justify-center items-center sm:overflow-hidden sm:px-4">

            {status !== "loading" &&
                <form action={handleSubmit} className="w-[450px] m-auto mt-24 p-12 pb-8 bg-white rounded-xl flex flex-col justify-center items-center gap-4 shadow-xl sm:w-full sm:m-0 sm:p-4 sm:gap-2">
                    <h1 className="text-3xl font-bold text-darkpurple sm:text-xl sm:mb-4">Add new openings</h1>

                    <input type="hidden" name="createdBy" value={session?.user?.id} />

                    <div className="w-full flex flex-col">

                        <label className="text-lg font-normal text-darkpurple">Company name</label>
                        <input type="text" name="companyname" placeholder="Ex. Infosys Ltd" className="p-2  pl-4 border-2 border-gray-400 rounded-xl w-full  sm:py-1" onChange={e => handleInput(e)} />
                    </div>

                    {error && (
                        <span className="w-full font-semibold text-center text-red-600">
                            {error}
                        </span>
                    )}

                    <button type="submit" className="px-12 bg-purple text-2xl font-medium rounded-xl py-4 text-white sm:mt-2 hover:bg-lightpurple">Add</button>

                </form>
            }
            <ToastContainer onClose={handleToastClose} />
        </div>
    )
}

export default NewPage