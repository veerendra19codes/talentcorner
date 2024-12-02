"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const DashboardBD = () => {

    const router = useRouter();
    const { data: session, status } = useSession();
    const [toastClosed, setToastClosed] = useState(false);
    const [info, setInfo] = useState({ companyname: "", createdBy: session?.user?.id });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    // console.log("data:", data);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push("/login")
        }
        else {
            if (status !== "loading" && session?.user?.role !== "bd") {
                router.back();
            }
            setLoading(false);
        }
    }, [session, status, router]);

    const handleInput = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("")
    }

    const handleToastClose = () => {
        setToastClosed(true);
    }

    const handleSubmit = async () => {
        setInfo((prev) => ({ ...prev, createdBy: session?.user?.id }));
        // console.log("info:", info);

        if (!info.companyname) {
            setError("Must provide all fields");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/company`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(info),
            });
            // console.log("res:", res);
            if (res.ok) {
                setInfo({ companyname: "", createdBy: session?.user?.id })
                await getCompanies();
                toast.success('company added', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                setInfo({ companyname: "", createdBy: session?.user?.id })
                toast.error("try again later", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                // console.log("error in posting new company:", res);
            }
        } catch (error) {
            // console.log(error);
            setError("Failed to post a company"); // Set error message for API request failure
        }
        finally {
            setLoading(false);
        }
    };

    const getCompanies = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/company`, {
                cache: "no-store",
            });

            if (!res.ok) {
                // console.log("error in getting companies:", res);
                setError("error in getting companies")
                setLoading(false);
                return;
                // throw new Error("Failed to fetch topics");
            }

            const companies = await res.json();
            const mycompanies = companies.filter((f) => f.createdBy === session?.user?.id);
            // console.log("companies fetched:", companies);
            const latestcompanies = mycompanies.reverse();
            setData(latestcompanies);
            setLoading(false);
            // setRetryAttempt(0); // Reset retry attempt counter on successful fetch
            setError(""); // Reset error state on successful fetch
        } catch (error) {
            setError(error);
            // console.log("Error loading topics: ", error);
            setLoading(false);
            // if (retryAttempt < RETRY_COUNT - 1) {
            //     // Retry if retryAttempt is less than the maximum retry count
            //     setTimeout(() => {
            //         setRetryAttempt(retryAttempt + 1);
            //     }, RETRY_DELAY);
            // } else {
            //     setError("Maximum retry attempts reached"); // Set error message for maximum retries
            // }
        }
        finally {
            setLoading(false);
        }
    }

    const handleCompanyDelete = async (id) => {
        try {
            console.log("id:", id);
            const res = await axios.delete(`/api/company/${id}`)
            if (res.data.ok) {
                toast.success("company deleted successfully");
                await getCompanies();
            }
            else {
                console.log("res:", res);
                toast.error("please try again later")
            }
        } catch (error) {
            console.log("error in deleting company:", error);
            toast.error("please try again later")
        }
    }

    useEffect(() => {
        getCompanies();
    }, [status]);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 15;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = data?.slice(firstIndex, lastIndex);
    const npage = Math.ceil(data?.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);


    const prePage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const nextPage = () => {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    }

    const changePage = (id) => {
        setCurrentPage(id);
    }

    const formatCreatedAtDate = (createdAt) => {
        if (!createdAt) return ""; // Add a check for null or undefined createdAt

        const createdAtDate = new Date(createdAt);
        if (isNaN(createdAtDate.getTime())) return "";
        const formattedDate = createdAtDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).replace(/\//g, '-'); // Replace slashes widiv dashes

        return formattedDate;
    }

    const formatTime12hr = (timeString) =>
        new Date(timeString).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });


    const splitText = (text, length) => {
        const regex = new RegExp(`.{1,${length}}`, 'g');
        return text.match(regex) || [];
    };

    return (
        <div className="min-h-screen flex justify-start items-center flex-col w-full lg:px-2 px-24 pt-12 pb-24 lg:py-4">

            <form action={(e) => handleSubmit()} className="lg:w-full flex justify-center items-center gap-4 bg-white rounded p-4 my-4">

                <input type="hidden" name="createdBy" value={session?.user?.id} />


                {/* <div className="w-full flex flex-col"> */}

                <input type="text" name="companyname" placeholder="new companyname" className="p-2  pl-4 lg:text-[12px] border-2 border-gray-400 rounded-xl w-full  sm:py-1" onChange={e => handleInput(e)} value={info.companyname} />
                {/* </div> */}

                <button type="submit" className="px-12 lg:px-8 bg-purple text-2xl lg:text-[12px] h-[45px] lg:h-[30px] flex items-center rounded-xl py-4 lg:py-2 text-white  hover:bg-lightpurple">Add</button>

            </form>
            <ToastContainer />

            {loading && <div className="text-white">Loading...</div>}

            {error && <div className="text-red-400">{error}</div>}

            {!loading && records.length === 0 && (
                <div className="text-white">No companies listed</div>
            )}

            {!loading && records.length > 0 && (
                <>

                    <h1 className="text-pink-300 text-3xl lg:text-xl py-2 ">My listed companies</h1>
                    <div className="Table w-full h-full flex flex-col items-center justify-center whitespace-nowrap  lg:overflow-x-auto border-gray-400 border-y-[1px] bg-white roundedlg:overflow-x-auto lg:text-[12px] ">


                        <div className="w-full">
                            <div className="w-1/6 py-2 text-center font-bold whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Company</div>
                            {/* <div className="w-1/6 py-2 text-center font-bold whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Details</div> */}
                            <div className="w-1/6 py-2  text-center font-bold  whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Team Leader</div>
                            <div className="w-1/6 py-2 text-center font-bold whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Franchise</div>
                            <div className="w-1/6 py-2 text-center font-bold whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Status</div>
                            <div className="w-1/6 py-2 text-center font-bold whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Created At</div>
                            <div className="w-1/6 py-2 text-center font-bold whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Delete</div>
                        </div>


                        {records.map((d) => (
                            <div key={d._id} className="w-full flex" >
                                <div className="w-1/6 py-2 text-center
                                  lg:min-w-[200px] flex-grow h-auto lg:py-1 border-gray-400 border-y-[1px]">{splitText(d.companyname, 20).map((line, index) => (
                                    <span key={index} className="block">{line}</span>
                                ))}</div>

                                {/* <div className="w-1/6 py-2 text-center whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px] hover:underline text-blue-500"><a href={d.jobdetails} target="_blank">Click here</a></div> */}

                                <div className={d.teamleadername === "unassigned" ? "w-1/6 py-2 text-center whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px] text-red-700" : "w-1/6 py-2 text-center whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]"} >{d.teamleadername}</div>

                                <div className={d.franchisename === "unassigned" ? "w-1/6 py-2 text-center whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px] text-red-700" : "w-1/6 py-2 text-center whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]"}>{d.franchisename}</div>

                                <div className={d.status !== "assigned" ? "w-1/6 py-2 text-center whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px] text-red-500" : "w-1/6 py-2 text-center whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px] text-green-500"}>{d.status}</div>


                                <div className="w-1/6 py-2 text-center whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px] ">

                                    {formatTime12hr(d.createdAt)}, {formatCreatedAtDate(d.createdAt)}

                                </div>

                                <div className="w-1/6   border-y-[1px] border-gray-400 text-center flex-grow h-auto  py-2 lg:min-w-[200px]">
                                    <button className="bg-red-600  rounded-full px-4  text-white hover:text-blac hover:border-2 hover:border-red-600 hover:bg-white hover:text-red-600" onClick={() => handleCompanyDelete(d._id)}>Delete</button>
                                </div>
                            </div>
                        ))}

                    </div>

                    <nav >
                        <ul className="pagination flex my-4 flex-wrap">
                            <li className="page-item border-y-[1px] border-black py-2 px-2 flex items-center bg-white cursor-pointer" onClick={prePage}>
                                <a href="#" className="page-link" >Prev</a>
                            </li>
                            <div className="flex flex-wrap">
                                {
                                    numbers.map((n, i) => (
                                        <li className={`page-item ${currentPage === n ? "active bg-blue-400 text-white border-y-[1px] border-black py-2 px-4 cursor-pointer" : "bg-white border-y-[1px] border-black py-2 px-4 cursor-pointer"}`} key={i} onClick={() => changePage(n)}>
                                            <a href="#" className="page-link"  >
                                                {n}
                                            </a>
                                        </li>
                                    ))
                                }
                            </div>
                            <li className="page-item border-y-[1px] border-black py-2 px-2 flex items-center bg-white cursor-pointer" onClick={nextPage}>
                                <a href="#" className="page-link"  >Next</a>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </div >

    )
}

export default DashboardBD