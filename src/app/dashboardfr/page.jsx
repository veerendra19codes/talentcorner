"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PieChart from '@/components/PieComponent/PieComponent';
import FranchiseRevenue from '@/components/FranchiseRevenue/FranchiseRevenue';
import { IoMdClose } from "react-icons/io";
import { MdDone } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { useSession } from 'next-auth/react';
import axios from 'axios';

const DashboardFRPage = () => {

    const router = useRouter();
    const { data: session, status } = useSession();
    const [data, setData] = useState([]);
    const [mycompanies, setMycompanies] = useState([]);
    const [myData, setMyData] = useState({});
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");
    const isMobile = useMediaQuery({ maxWidth: 768 });


    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push("/login")
        }
        else {
            if (status !== "loading" && session?.user?.role !== "fr") {
                router.back();
            }
            setLoading(false);
        }
    }, [session, status, router]);

    const getCompanies = async () => {
        try {
            // setLoading(true);

            const url = `${process.env.NEXTAUTH_URL}/api/company`
            const res = await axios({
                method: "GET",
                url
            })

            // console.log("res:", res);
            if (res.status === 201 || res.status === 200) {
                const companies = res.data;
                // console.log("all companies:", companies);

                const myassignedcompanies = companies.filter((company) => company.franchisename === session?.user?.username && company.status === "in progress");
                const reversemyassignedcompanies = myassignedcompanies.reverse();

                // console.log("myassignedcompanies:", myassignedcompanies);
                //new companies
                setData(reversemyassignedcompanies);

                const myacceptedcompanies = companies.filter((company) => company.franchisename === session?.user?.username && company.status === "assigned");
                // console.log("myacceptedcompanies:", myacceptedcompanies);
                const reveresemycompanies = myacceptedcompanies.reverse();
                //my accepted companies
                setMycompanies(reveresemycompanies);
                setError("")
                // setLoading(false);
            }
            else {
                setError("please wait");
                // setLoading(false);
            }
        }
        catch (err) {
            setError("no data found");
            // setLoading(false);
            // console.log("error in getting my companies:", err);
        }
        finally {
            setError("");
        }
    }

    const getMyData = async () => {
        try {
            // setLoading(true);

            const url = `${process.env.NEXTAUTH_URL}/api/user`;
            const res = await axios({
                method: "GET",
                url
            })
            // console.log("res:", res);
            if (res.status === 201 || res.status === 200) {
                const allusers = res.data;

                const mydata = allusers.filter((u) => u.username === session?.user?.username);
                // console.log("mydata:", mydata)
                // console.log("myData before:", myData);
                setMyData(mydata[0]);
                // console.log("myData after computing:", myData);
                setError("")
                // setLoading(false);
            }
            else {
                setError("please wait");
                // setLoading(false);
            }
        }
        catch (err) {
            setError("no data found");
            // setLoading(false);
            // console.log("error in getting my companies:", err);
        }
        finally {
            setError("");
        }
    }
    useEffect(() => {
        setLoading(true);
        // console.log("before getMyData")
        getMyData();
        // console.log("after getMyData")
        getCompanies();
        // console.log("after getCompanies")
        setLoading(false);
    }, [status]);


    const handleNotInterested = async (id, companyname) => {
        setLoading(true);
        // console.log("company rejected: ", id);
        // console.log("rejected Company name: ", companyname);

        const updatedFields = {
            companyId: id, //this is to change Company model with this company id only
            // updates in Company model
            franchisename: "unassigned", //set
            franchise: null, //set
            rejectedFranchiseName: session?.user?.username, //push
            rejectedFranchise: session?.user?.id, //push

            userId: session?.user?.id, // this is to change user model with this user id only
            //updated in User model
            companiesRejected: id, //push
            companiesRejectedName: companyname, //push

        }
        // console.log("companyId: ", companyId);
        // console.log("updatedFields", updatedFields);

        // RejectFr(updatedFields);
        try {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/rejectfr`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFields),
            })
            // console.log("res of rejcectfr:", res);
            if (!res) {
                setLoading(false);
                // console.log(res.json());
            }

            const data = await res.json();
            // console.log("data.upuser", data.upuser);
            setMyData(data.upuser);
            // console.log("mydata before:", myData);
            // await getMyData();
            // console.log("myData after:", myData);
            await getCompanies();
            setLoading(false);
            // console.log(data);
        }
        catch (err) {
            setLoading(false);
            // console.log("error while rejected company:", err);
        }
        finally {
            setLoading(false);
        }
        setLoading(false);
    }

    const handleInterested = async (id, companyname) => {
        setLoading(true);
        // console.log("company rejected: ", id);
        // console.log("rejected Company name: ", companyname);

        const updatedFields = {
            companyId: id, //this is to change Company model with this company id only
            // updates in Company model
            status: "assigned",

            userId: session?.user?.id, // this is to change user model with this user id only
            //updated in User model
            companiesAccepted: id, //push
            companiesAcceptedName: companyname, //push

        }
        // console.log("companyId: ", companyId);
        // console.log("updatedFields", updatedFields);

        // AcceptFr(updatedFields);
        try {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/acceptfr`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFields),
            })
            // console.log("res of acceptfr:", res);
            if (!res) {
                setLoading(false);
                // console.log(res.json());
            }

            const data = await res.json();
            // console.log("data", data);
            // console.log("upuser:", data.upuser);
            setMyData(data.upuser);

            // console.log("handleinterestedbeforegetMyData")
            // await getMyData();
            await getCompanies();
            // console.log("handleinterestedaftergetCompanies")

            setLoading(false);
            // console.log(data);
        }
        catch (err) {
            setLoading(false);
            // console.log("error while accepting company:", err);
        }
        finally {
            setLoading(false);
        }

        setLoading(false);
    }

    const handleReallocate = async (id, companyname) => {

        setLoading(true);

        const updatedFields = {

            companyId: id,
            status: "reallocate",
            franchise: null,
            franchisename: "unassigned",
            reallocatedFranchise: session?.user?.id,
            reallocatedFranchisename: session?.user?.username,

            userId: session?.user?.id,
            companiesReallocated: id, //push
            companiesReallocatedName: companyname, //push
        }
        // console.log("updatedfields:", updatedFields);


        try {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/reallocatefr`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFields),
            })
            // console.log("res of reallocatefr:", res.json());
            if (!res) {
                setLoading(false);
                // console.log(res.json());
            }

            const data = await res.json();
            // console.log("data:", data);
            setMyData(data.updateduser);
            // await getMyData();
            await getCompanies();
            setLoading(false);
            // console.log(data);
        }
        catch (err) {
            setLoading(false);
            // console.log("error while accepting company:", err);
        }

        finally {
            setLoading(false);
        }
        setLoading(false);
    }

    //pagination 1
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Calculate total pages
    const totalPages = Math.ceil(mycompanies.length / rowsPerPage);

    // Calculate the indices for slicing
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Get the current rows
    const currentCompanies = mycompanies.slice(startIndex, endIndex);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };



    //pagination 2
    const [currentPage2, setCurrentPage2] = useState(1);
    const rowsPerPage2 = 15;

    const totalRows = Math.max(
        myData?.companiesAccepted?.length || 0,
        myData?.companiesRejected?.length || 0,
        myData?.companiesReallocated?.length || 0
    );

    const totalPages2 = Math.ceil(totalRows / rowsPerPage2);

    const handleChangePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages2) {
            setCurrentPage2(newPage);
        }
    };

    const startIdx = (currentPage2 - 1) * rowsPerPage2;
    const endIdx = startIdx + rowsPerPage2;

    const splitText = (text, length) => {
        const regex = new RegExp(`.{1,${length}}`, 'g');
        return text.match(regex) || [];
    };


    return (
        <>
            {error && <div className="text-red-400 min-h-screen">{error}</div>}
            {loading && <div className="text-white min-h-screen">Loading...</div>}
            {!loading && myData && data &&
                <div className="min-h-screen flex flex-col justify-center items-center w-full px-24 py-12 lg:py-4 lg:px-2 gap-4">

                    <div className="top flex  justify-center items-center w-full gap-4  overflow-hidden lg:flex-col lg:px-0">


                        <div className="w-1/2 lg:w-full h-[450px] lg:h-auto bg-white userdetailstext flex flex-col justify-between  items-center rounded p-4 ">

                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Username</label>
                                <div className="w-3/5 py-1 overflow-x-auto">{myData?.username || "loading..."}</div>
                            </div>

                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Email</label>
                                <div className="w-3/5 py-1 overflow-x-auto">{myData?.email || "loading..."}</div>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Team Leader</label>
                                <div className="w-3/5 py-1 overflow-x-auto">{myData?.teamleadername || "loading"}</div>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Spreadsheet</label>
                                <a href={myData?.spreadsheet} className="text-blue-500 hover:underline cursor-pointer    w-3/5">Click here</a>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Companies Accepted</label>
                                <div className="w-3/5 py-1">{myData?.companiesAccepted?.length || "0"}</div>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Companies Rejected</label>
                                <div className="w-3/5 py-1">{myData?.companiesRejected?.length || "0"}</div>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Companies Reallocated</label>
                                <div className="w-3/5 py-1">{myData?.companiesReallocated?.length || "0"}</div>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Reminders</label>
                                <div className="w-3/5 py-1">{myData?.reminders || 0}</div>
                            </div>

                            <FranchiseRevenue username={session?.user?.username} teamleadername={session?.user?.teamleadername} />
                        </div>

                        <div className="w-1/2 flex justify-center items-center h-[450px] lg:h-auto bg-white py-4 rounded lg:w-full">
                            <PieChart username={session?.user?.username} teamleadername={session?.user?.teamleadername} />
                        </div>
                    </div>


                    {data?.length === 0 ? <h1 className="text-pink-300 text-3xl lg:text-xl mt-9 text-center">No New companies</h1> :
                        (
                            <>

                                <h1 className="text-pink-300 text-3xl lg:text-xl mt-8">New companies</h1>
                                <div className="Table w-full h-full  flex flex-col items-center justify-center border-gray-400 border-[1px] bg-white rounded whitespace-nowrap lg:overflow-x-auto ">
                                    <div className="w-full flex" >
                                        <div className="w-1/2  whitespace-nowrap text-center font-bold inline-block  border-gray-400 border-y-[1px] py-2 lg:py-1">Company</div>
                                        <div className="w-1/2  whitespace-nowrap text-center font-bold inline-block  border-gray-400 border-y-[1px] py-2 lg:py-1">Status</div>
                                    </div>

                                    <div className="w-full">

                                        {data &&

                                            data?.map((d) => (
                                                <div key={d._id} className="w-full flex lg:text-[12px]">
                                                    <div className="w-1/2   text-center  flex-grow h-auto border-gray-400 border-y-[1px] py-2 lg:py-1">{splitText(d.companyname, 20).map((line, index) => (
                                                        <span key={index} className="block">{line}</span>
                                                    ))}</div>
                                                    {d.status === "in progress" &&
                                                        <div className="buttons flex items-center w-1/2 whitespace-nowrap text-center border-gray-400 border-y-[1px] py-2 lg:py-1">

                                                            {isMobile ? (
                                                                <>
                                                                    <button className="w-1/2 flex justify-center items-center h-[20px]">
                                                                        <MdDone onClick={() => handleInterested(d._id, d.companyname)} size={20} color="white" className="rounded-full bg-green-500" />
                                                                    </button>
                                                                    <button className="w-1/2 flex justify-center items-center h-[20px]">
                                                                        <IoMdClose onClick={() => handleNotInterested(d._id, d.companyname)} size={20} color="white" className="rounded-full bg-red-500" />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => handleInterested(d._id, d.companyname)} className="w-1/2 flex items-center justify-center bg-green-500 rounded-xl text-white mx-2 h-[20px]">
                                                                        <MdDone size={20} color="white" className="rounded-full bg-green-500" />
                                                                        Accept
                                                                    </button>
                                                                    <button onClick={() => handleNotInterested(d._id, d.companyname)} className="w-1/2 flex items-center justify-center bg-red-500 rounded-xl text-white mx-2 h-[20px]">
                                                                        <IoMdClose size={20} color="white" className="rounded-full bg-red-500" />
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </>
                        )}

                    {/* table 1 */}
                    {mycompanies?.length === 0 ? <h1 className="text-pink-300 text-3xl lg:text-xl mt-9 text-center">No companies accepted</h1> :
                        (
                            <>
                                <h1 className="text-pink-300 text-3xl lg:text-xl mt-8">My assigned companies</h1>
                                <div className="Table w-full h-full  flex flex-col items-center justify-center border-gray-400 border-[1px] bg-white rounded whitespace-nowrap lg:overflow-x-auto ">
                                    <div className="w-full flex" >
                                        <div className="w-1/2  whitespace-nowrap text-center font-bold inline-block  border-gray-400 border-y-[1px] py-2 lg:py-1">Company</div>

                                        <div className="w-1/2  whitespace-nowrap text-center font-bold inline-block  border-gray-400 border-y-[1px] py-2 lg:py-1">Reallocate</div>
                                    </div>

                                    <div className="w-full">

                                        {mycompanies &&

                                            mycompanies?.map((company) => (
                                                <div key={company._id} className="w-full flex lg:text-[12px]">
                                                    <div className="w-1/2 flex-grow h-auto   text-center  border-gray-400 border-y-[1px] py-2 lg:py-1">{splitText(company.companyname, 20).map((line, index) => (
                                                        <span key={index} className="block">{line}</span>
                                                    ))}</div>
                                                    <div className="w-1/2  flex justify-center border-gray-400 border-y-[1px] py-2 lg:py-1">
                                                        <button onClick={() => handleReallocate(company._id, company.companyname)} className=" flex items-center justify-center bg-red-500 text-white rounded-xl px-2 h-[20px]">
                                                            Reallocate
                                                        </button>
                                                    </div>


                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>


                                <div className="w-full flex justify-center gap-2 mb-4 lg:text-[12px]">
                                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-1 bg-gray-200 rounded">Prev</button>
                                    <span className="px-4 py-1 bg-gray-200 rounded">Page {currentPage} of {totalPages}</span>
                                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-1 bg-gray-200 rounded">Next</button>
                                </div>
                            </>
                        )}

                    {/* table 2 */}
                    {myData?.length === 0 ? <h1 className="text-pink-300 text-3xl lg:text-xl mt-9 text-center">No History</h1> :
                        (
                            <>
                                <h1 className="text-pink-300 text-3xl lg:text-xl mt-8">My History</h1>
                                <div className="Table w-full h-full flex flex-col justify-center items-center whitespace-nowrap lg:overflow-x-auto bg-white border-gray-400 border-[1px] lg:text-[10px]">
                                    <div className="w-full">
                                        <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">
                                            Companies Accepted/Working
                                        </div>
                                        <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">
                                            Companies Rejected
                                        </div>
                                        <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center font-bold whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1 ">
                                            Companies Reallocated
                                        </div>
                                    </div>

                                    <div className="w-full gap-0">
                                        {Array.from({ length: rowsPerPage2 }).map((_, index) => {
                                            const rowIdx = startIdx + index;
                                            return (
                                                <div key={rowIdx} className="w-full flex">
                                                    <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1">
                                                        {/* {myData?.companiesAcceptedName?.[rowIdx] || '-'} */}
                                                        {splitText(myData?.companiesAcceptedName?.slice().reverse()[rowIdx] || '-', 30).map((line, index) => (
                                                            <span key={index} className="block">{line}</span>
                                                        ))}
                                                    </div>
                                                    <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1">
                                                        {/* {myData?.companiesRejectedName?.[rowIdx] || '-'} */}
                                                        {splitText(myData?.companiesRejectedName?.slice().reverse()[rowIdx] || '-', 30).map((line, index) => (
                                                            <span key={index} className="block">{line}</span>
                                                        ))}
                                                    </div>
                                                    <div className="w-1/3 py-2 border-[1px] border-gray-300 text-center whitespace-nowrap inline-block lg:min-w-[200px] lg:py-1">
                                                        {/* {myData?.companiesReallocatedName?.[rowIdx] || '-'} */}
                                                        {splitText(myData?.companiesReallocatedName?.slice().reverse()[rowIdx] || '-', 30).map((line, index) => (
                                                            <span key={index} className="block">{line}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                </div>
                                <div className="flex justify-center mt-4 gap-2" >
                                    <button
                                        className="px-3 py-1 border rounded border-gray-400 bg-gray-200 hover:bg-gray-300"
                                        onClick={() => handleChangePage(currentPage2 - 1)}
                                        disabled={currentPage2 === 1}
                                    >
                                        Prev
                                    </button>
                                    <div className="px-3 py-1 rounded border-t border-b border-gray-400 bg-gray-200">
                                        Page {currentPage2} of {totalPages2}
                                    </div>
                                    <button
                                        className="px-3 py-1 border rounded border-gray-400 bg-gray-200 hover:bg-gray-300"
                                        onClick={() => handleChangePage(currentPage2 + 1)}
                                        disabled={currentPage2 === totalPages2}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}


                </div>
            }
        </>
    )
}

export default DashboardFRPage