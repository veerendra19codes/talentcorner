"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const DashboardSHPage = () => {

    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [sortedData, setSortedData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push("/login")
        }
        else {
            if (status !== "loading" && session?.user?.role !== "sh") {
                router.back();
            }
            setLoading(false);
        }
    }, [session, status, router]);

    const getUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
                cache: "no-store",
            });

            if (!res.ok) {
                // console.log("error in getting users:", res.json);
                setLoading(false);
                setError(res.json);
            }

            const users = await res.json();
            const franchise = users.filter((u) => u.role === "fr");
            const sortingData = [...franchise].sort((a, b) => a.teamleadername.localeCompare(b.teamleadername));
            setSortedData(sortingData);
            // console.log("users fetched:", users);
            setLoading(false);
            // setRetryAttempt(0); // Reset retry attempt counter on successful fetch
            setError(""); // Reset error state on successful fetch
        } catch (error) {
            setLoading(false);
            setError(error);
            // console.log("Error loading users: ", error);
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
            setError("");
        }
    };

    useEffect(() => {
        getUsers();
    }, [])

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 15;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = sortedData.slice(firstIndex, lastIndex);
    const npage = Math.ceil(sortedData.length / recordsPerPage);
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

    const splitText = (text, length) => {
        const regex = new RegExp(`.{1,${length}}`, 'g');
        return text.match(regex) || [];
    };

    return (

        <>
            {error && <div className="text-red-400 min-h-screen">{error}</div>}
            {loading && <div className="text-white min-h-screen">Loading...</div>}
            {!loading &&
                <div className="min-h-screen flex justify-start items-center flex-col w-full px-24 lg:px-2 py-12 lg:py-4">
                    <h1 className="text-pink-300 text-3xl lg:text-xl py-2">All franchisee</h1>

                    <div className="Table w-full h-full flex flex-col items-center justify-center whitespace-nowrap lg:overflow-x-auto border-gray-400 border-y-[1px] bg-white rounded lg:text-[10px]">
                        <div className="w-full">
                            <div className="w-1/5 py-2 text-center font-bold whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Teamleader</div>
                            <div className="w-1/5 py-2 text-center font-bold whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Franchise</div>
                            <div className="w-1/5 py-2  text-center font-bold  whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Level</div>
                            <div className="w-1/5 py-2  text-center font-bold  whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Status</div>
                            <div className="w-1/5 py-2  text-center font-bold  whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Preference</div>
                            {/* <div className="w-1/6 py-2  text-center font-bold  whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Companies Accepted</div>
                            <div className="w-1/6 py-2  text-center font-bold  whitespace-nowrap lg:min-w-[200px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Companies Rejected</div> */}

                        </div>

                        <div className="w-full">

                            {records.map((d) => (
                                <div key={d._id} className="w-full flex">

                                    <div className="w-1/5 py-2 text-center flex-grow lg:min-w-[200px] h-auto  lg:py-1 border-gray-400 border-y-[1px] ">{d.teamleadername}</div>


                                    <div className="w-1/5 py-2 text-center flex-grow lg:min-w-[200px] lg:py-1 h-auto border-gray-400 border-y-[1px]">{d.username}</div>


                                    <div className="w-1/5 py-2 text-center flex-grow lg:min-w-[200px] h-auto  lg:py-1 border-gray-400 border-y-[1px]" >{d.level}</div>

                                    <div className="w-1/5 py-2 text-center flex-grow lg:min-w-[200px] h-auto  lg:py-1 border-gray-400 border-y-[1px]" >{d.status}</div>


                                    <div className="w-1/5 py-2 text-center flex-grow lg:min-w-[200px]  h-auto lg:py-1 border-gray-400 border-y-[1px]" >{splitText(d.preference, 25).map((line, index) => (
                                        <span key={index} className="block">{line}</span>
                                    ))}</div>

                                    {/* <div className="w-1/6 py-2 text-center text-green-500 flex-grow lg:min-w-[200px]  h-auto lg:py-1 border-gray-400 border-y-[1px]" >{d.companiesAccepted.length}</div>

                                    <div className="w-1/6 py-2 text-center text-red-500 flex-grow lg:min-w-[200px] h-auto lg:py-1 border-gray-400 border-y-[1px]" >{d.companiesRejected.length}</div> */}

                                </div>
                            ))}
                        </div>

                    </div>

                    <nav >
                        <ul className="pagination flex mt-4 flex-wrap">
                            <li className="page-item border-y-[1px] border-black py-2 px-2 flex items-center bg-white cursor-pointer" onClick={prePage}>
                                <a href="#" className="page-link" >Prev</a>
                            </li>
                            <div className="flex flex-wrap">
                                {
                                    numbers.map((n, i) => (
                                        <li className={`page-item ${currentPage === n ? "active bg-blue-400 text-white border-y-[1px] border-black py-2 px-4" : "bg-white border-y-[1px] border-black py-2 px-4 cursor-pointer"}`} key={i} onClick={() => changePage(n)}>
                                            <button href="#" className="page-link"  >
                                                {n}
                                            </button>
                                        </li>
                                    ))
                                }
                            </div>
                            <li className="page-item border-y-[1px] border-black py-2 px-2 flex items-center bg-white cursor-pointer" onClick={nextPage}>
                                <a href="#" className="page-link"  >Next</a>
                            </li>
                        </ul>
                    </nav>
                </div >
            }
        </>
    )
}

export default DashboardSHPage



