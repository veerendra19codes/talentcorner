"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const AssignPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState([]);
    const [franchiseUnderMe, setFranchiseUnderMe] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push("/login")
        }
        else {
            if (status !== "loading" && session?.user?.role !== "tl") {
                router.back();
            }
            setLoading(false);
        }
    }, [session, status, router]);

    //getting allusers and filtering franchise underme
    const getUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
                cache: "no-store",
            });
            // console.log("res in getUsers:", res);

            if (!res.ok) {
                // console.log("error in getting users:", res.json);
                setLoading(false);
                setError(res.json);
                return;
            }

            const users = await res.json();
            // console.log("users fetched:", users);
            const franchise = users?.filter((u) => u?.role === "fr" && u?.teamleadername === session?.user?.username);
            // console.log("franchise under me:", franchise);
            setFranchiseUnderMe(franchise);
            setLoading(false);
            // setRetryAttempt(0); // Reset retry attempt counter on successful fetch
            setError("");
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
            setError("")
            setLoading(false);
        }
    };

    //fetching all companies and filtering companies assigned to me
    const getCompanies = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/company`, {
                cache: "no-store",
            });
            // console.log("res in getCompanies:", res);
            if (!res.ok) {
                // console.log("error in getting companies:", res.json);
                // setError("error in getting companies")
                setLoading(false);
                setError(res.json);
                return;
                // throw new Error("Failed to fetch topics");
            }

            const companies = await res.json();
            // console.log("companies fetched:", companies);
            const assignedToMe = companies?.filter((c) => c?.teamleadername === session?.user?.username)
            // console.log("companies assigned to me:", assignedToMe);
            const reversed = assignedToMe.reverse();
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
    };

    useEffect(() => {
        getCompanies();
    }, [status])

    useEffect(() => {
        getUsers();
    }, [status])

    const handleCompanyReject = async (id, companyname) => {
        setLoading(true);
        // console.log("company id rejected:", id);

        const updatedFields = {
            companyId: id,
            //changes in Company Model
            teamleader: null, //set
            teamleadername: "unassigned", //set
            franchise: null, //set
            franchisename: "unassigned", //set
            rejectedTeamLeaders: session.user?.id, //push
            rejectedTeamLeadersName: session.user?.username, //push

            userId: session.user?.id,
            //changes in User Model
            companiesRejected: id,
            companiesRejectedName: companyname,
        }
        // console.log("updatedFields", updatedFields);

        try {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/rejecttl`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFields),
            })

            if (!res.ok) {
                setError(res.text);
                setLoading(false);
                return;
                // console.log(res.json());
            }
            const data = await res.json();
            setError("");
            setLoading(false);
            await getCompanies();
            // console.log(data);
        }
        catch (err) {
            setError(err);
            setLoading(false);
            // console.log("error sending companydetails to franchise", err);
        }
    }

    //pagination
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

    //handlefranchiseassign
    const handleSelectChange = async (selectedValue, id) => {
        setLoading(true);
        // console.log("selectedValue:", selectedValue);
        // console.log("company id:", id);

        const franchise = franchiseUnderMe.filter((franchise) => franchise.username === selectedValue);
        // console.log("franchise: ", franchise);

        const franchiseId = franchise[0]._id;
        // console.log("franchiseId", franchiseId);

        const updatedFields = {
            //only changes in Company model
            companyId: id,
            franchisename: selectedValue,
            franchise: franchiseId,
            status: "in progress",
        };

        // console.log("companyId:", companyId);
        // console.log("updatedFields", updatedFields);

        try {
            const res = await fetch(`/api/assignfr`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFields),
            })

            if (!res.ok) {
                setError(res.text);
                setLoading(false);
                return;
                // console.log(res.json());
            }
            else {
                const data = await res.json();
                await getCompanies();
                setError("");
                setLoading(false);
            }
        }
        catch (err) {
            setError(err);
            setLoading(false);
            // console.log("error sending companydetails to franchise", err);
        }
    }

    const splitText = (text, length) => {
        const regex = new RegExp(`.{1,${length}}`, 'g');
        return text.match(regex) || [];
    };



    return (
        <>
            {error && <div className="text-red-500 min-h-screen">{error}</div>}
            {loading && <div className="text-white min-h-screen">Loading...</div>}
            {!loading && data?.length === 0 && <div className="text-white min-h-screen">No companies assigned to you</div>}
            {!loading && data.length > 0 &&
                <div className="w-full min-h-screen py-12 px-24 flex flex-col justify-start items-center lg:m-0 lg:px-2 lg:py-4">
                    <h1 className="text-pink-300 text-3xl lg:text-xl py-2">Assign Franchise</h1>
                    <div className="Table w-full h-full flex flex-col items-center justify-center whitespace-nowrap overflow-x-auto bg-white border-y-[1px] border-gray-400 lg:text-[10px]">
                        <div className="w-full ">
                            <div className="w-1/6 py-2 border-y-[1px] border-gray-400 text-center font-bold whitespace-nowrap inline-block lg:w-[200px] lg:py-1 " >Company</div>
                            <div className="w-1/6 py-2 border-y-[1px] border-gray-400 text-center font-bold whitespace-nowrap inline-block lg:w-[200px] lg:py-1 ">Franchise</div>
                            <div className="w-1/6 py-2 border-y-[1px] border-gray-400 text-center font-bold  whitespace-nowrap inline-block lg:w-[200px] lg:py-1 ">Status</div>
                            <div className="w-1/6 py-2 border-y-[1px] border-gray-400 text-center font-bold  whitespace-nowrap inline-block lg:w-[200px] lg:py-1 ">Franchise Rejected</div>
                            <div className="w-1/6 py-2 border-y-[1px] border-gray-400 text-center font-bold  whitespace-nowrap inline-block lg:w-[200px] lg:py-1 ">Franchise Reallocated</div>
                            <div className="w-1/6 py-2 border-y-[1px] border-gray-400 text-center font-bold  whitespace-nowrap inline-block lg:w-[200px] lg:py-1 ">Reject</div>
                        </div>

                        <div className="w-full">
                            {
                                records.map((d) => (

                                    <div key={d._id} className="w-full flex">

                                        <div className="w-1/6 py-2 border-y-[1px] border-gray-400 text-center  
                                flex-grow h-auto lg:min-w-[200px]">{splitText(d.companyname, 20).map((line, index) => (
                                            <span key={index} className="block">{line}</span>
                                        ))}</div>

                                        {d.franchisename === "unassigned" ? (
                                            <div className="w-1/6  text-center  flex-grow h-auto  lg:min-w-[200px]  border-gray-400">

                                                <Select
                                                    onValueChange={(selectedValue) => handleSelectChange(selectedValue, d._id)}
                                                    className="border-y-[1px] border-gray-400 rounded-none border-none  outline-none"
                                                >
                                                    <SelectTrigger className="border-none  outline-none h-[20px] lg:text-[10px]">
                                                        <SelectValue placeholder="Select Franchise" />
                                                    </SelectTrigger>
                                                    <SelectContent className="h-[150px] border-none  outline-none">

                                                        {franchiseUnderMe.filter((f) => !d.rejectedFranchiseName.find(item => item === f.username)).filter((f) => !d.reallocatedFranchiseName.find(item => item === f.username)).map((f) =>
                                                        (
                                                            <SelectItem key={f._id} value={f.username} className="py-1">{f.username}</SelectItem>
                                                        )
                                                        )}
                                                    </SelectContent>
                                                </Select>

                                            </div>
                                        ) : (

                                            <div className="w-1/6 items-center  py-2  border-y-[1px] border-gray-400 text-center  flex-grow h-auto  lg:min-w-[200px]">{d.franchisename}</div>
                                        )}

                                        <div className={d.status === "assigned" ? "w-1/6 items-center border-y-[1px] border-gray-400 py-2 text-center text-green-500  flex-grow h-auto  lg:min-w-[200px]" : "w-1/6 items-center border-y-[1px] border-gray-400 py-2 text-center  flex-grow h-auto  lg:min-w-[200px]"}>{d.status}</div>

                                        <div className="w-1/6  items-center border-y-[1px] border-gray-400 py-2 text-center text-red-500 flex-grow h-auto  lg:min-w-[200px]">
                                            {d.rejectedFranchiseName.length === 0 ? 0 :
                                                d.rejectedFranchiseName.length
                                            }
                                        </div>

                                        <div className="w-1/6  items-center border-y-[1px] border-gray-400 py-2 text-center text-red-500 flex-grow h-auto  lg:min-w-[200px]">
                                            {d.reallocatedFranchise.length === 0 ? 0 :
                                                d.reallocatedFranchise.length
                                            }
                                        </div>

                                        <div className="w-1/6   border-y-[1px] border-gray-400 text-center flex-grow h-auto  py-2 lg:min-w-[200px]">
                                            <button className="bg-red-600  rounded-full px-4  text-white hover:text-blac hover:border-2 hover:border-red-600 hover:bg-white hover:text-red-600" onClick={() => handleCompanyReject(d._id, d.companyname)}>Reject</button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div >

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
                </div>
            }
        </>
    )
}

export default AssignPage