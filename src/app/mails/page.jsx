"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, Suspense, useContext } from "react";

const MailsPage = () => {
    const { data: session, status } = useSession();
    // console.log("session in mails:", session);
    // console.log("status in mails:", status)

    const router = useRouter();
    const [data, setData] = useState([]);
    const [teamleaders, setTeamleaders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

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

    const getCompanies = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/company`, {
                cache: "no-store",
            });

            if (!res.ok) {
                // console.log("error in getting companies:", res.json);
                // setError("error in getting companies")
                setLoading(false);
                setError(res.json);
                // throw new Error("Failed to fetch topics");
            }

            const companies = await res.json();
            // console.log("companies fetched:", companies);
            const reversed = companies.reverse();
            setData(reversed);
            setLoading(false);
            // setRetryAttempt(0); // Reset retry attempt counter on successful fetch
            setError(""); // Reset error state on successful fetch
        } catch (error) {
            setLoading(false);
            setError(error);
            // console.log("Error loading topics: ", error);
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
        getCompanies();
    }, []);

    useEffect(() => {
        const fetchteamleaders = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, { cache: "no-cache" });
                if (res.ok) {
                    const allusers = await res.json();
                    const allteamleaders = allusers.filter((u) => u.role === "tl")
                    setTeamleaders(allteamleaders);
                    setLoading(false);
                    setError("");
                }
            }
            catch (err) {
                // console.log("error in getting all users in /mails", err)
                setLoading(false);
                setError(err);
            }
            finally {
                setLoading(false);
                setError("");
            }
        }
        fetchteamleaders();
    }, [])

    const handleTeamleaderChange = async (e, id) => {
        setLoading(true);

        // console.log("teamleadername selected:", e.target.value);
        const teamleader = teamleaders.filter((teamleader) => teamleader.username === e.target.value);
        // console.log("teamleader :", teamleader);
        const teamleaderId = teamleader[0]._id;
        // console.log("teamleaderId:", teamleaderId);

        //backend
        // Example usage
        const updatedFields = {
            companyId: id,
            teamleader: teamleaderId,
            teamleadername: e.target.value,
        };
        // console.log("companyId :", companyId);
        // console.log("updatedField:", updatedFields);

        try {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/assigntl`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFields)
            });

            // console.log("response in AssignTl fn:", response);
            if (!response.ok) {
                const errorMessage = await response.text();
                // throw new Error(errorMessage);
                // return { error: errorMessage, status: 500 }
                setError(errorMessage)
                setLoading(false);
                return;
            }

            const data = await response.json();
            setError("");
            setLoading(false);
            router.refresh("/mails");
            await getCompanies();
            // return { success: "successfully assigned", status: 200 };
            // console.log(data); // Success message
        } catch (error) {
            // return { error, status: 500 }
            setError(error)
            setLoading(false);
            // console.error('Error updating company:', error.message);
        }
        finally {
            // return { error, status: 500 }
            setError("")
            setLoading(false);
            // console.error('Error updating company:', error.message);
        }
    }

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 15;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = data.slice(firstIndex, lastIndex);
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

    const splitText = (text, length) => {
        const regex = new RegExp(`.{1,${length}}`, 'g');
        return text.match(regex) || [];

        // const regex = new RegExp(`(.{1,${length}})(,|$)`, 'g');
        // return text.match(regex);
    };




    return (
        <>
            {error && <div className="text-red-400 min-h-screen">{error}</div>}
            {status === "loading" && <div className="text-white min-h-screen">Loading...</div>}
            {status !== "loading" && session?.user?.username && (
                <div className="min-h-screen flex justify-start items-center flex-col w-full py-12 lg:py-4 lg:px-2 px-24">
                    <h1 className="text-pink-300 text-3xl lg:text-xl py-2">New companies</h1>

                    <div className="Table w-full h-full flex flex-col items-center justify-center  whitespace-nowrap lg:overflow-x-auto border-gray-400 border-y-[1px] bg-white lg:text-[10px]">
                        <div className="w-full">
                            <div className="w-1/4 py-2 text-center font-bold whitespace-nowrap lg:min-w-[180px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Company</div>
                            <div className="w-1/4 py-2  text-center font-bold  whitespace-nowrap lg:min-w-[180px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Team Leader</div>
                            <div className="w-1/4 py-2 text-center font-bold whitespace-nowrap lg:min-w-[180px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Status</div>
                            <div className="w-1/4 py-2 text-center font-bold whitespace-nowrap lg:min-w-[180px] inline-block lg:py-1 border-gray-400 border-y-[1px]">Teamleaders Rejected</div>
                        </div>


                        {records.map((d) => (
                            <div key={d._id} className="w-full flex">

                                <div className="w-1/4 py-2 text-center flex-grow h-auto  lg:min-w-[180px]  lg:py-1 border-gray-400 border-y-[1px]">{splitText(d.companyname, 20).map((line, index) => (
                                    <span key={index} className="block">{line}</span>
                                ))}</div>


                                <div className={d.teamleadername === "unassigned" ? "w-1/4 text-center whitespace-nowrap lg:min-w-[180px] inline-block lg:py-1 border-gray-400 border-y-[1px]" : "w-1/4 text-center py-2 whitespace-nowrap lg:min-w-[180px] inline-block lg:py-1 border-gray-400 border-y-[1px]"}>
                                    {d.teamleadername === "unassigned" ? (
                                        <select
                                            name="teamleader"
                                            value={d.teamleadername === "unassigned" ? "" : d.teamleadername}
                                            onChange={(event) => handleTeamleaderChange(event, d._id)}
                                            className="w-full py-2 pl-4 lg:py-0">
                                            <option value="" disabled>
                                                Select Teamleader
                                            </option>
                                            {teamleaders.filter((teamleader) => !d.rejectedTeamLeadersName.find(item => item === teamleader.username)).map((teamleader) => (
                                                <option key={teamleader._id} value={teamleader.username}>{teamleader.username}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="w-full text-center">{d.teamleadername}</div>
                                    )}
                                </div>

                                <div className={d.status === "in progress" ? "w-1/4 py-2 text-center whitespace-nowrap lg:min-w-[180px] inline-block lg:py-1 border-gray-400 border-y-[1px] text-red-700" : "w-1/4 py-2 text-center whitespace-nowrap lg:min-w-[180px] inline-block lg:py-1 border-gray-400 border-y-[1px]"}>{d.status}</div>

                                <div className="w-1/4 py-2 text-center whitespace-nowrap lg:min-w-[180px] inline-block lg:py-1 border-gray-400 border-y-[1px]">{d.rejectedTeamLeadersName.length}</div>
                            </div>
                        ))}

                    </div>

                    <nav >
                        <ul className="pagination flex mt-4 flex-wrap">
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
                </div >
            )}
        </>
    )
}

export default MailsPage


