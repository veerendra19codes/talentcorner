'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useContext, Suspense } from 'react';
import ADForm from '@/components/ADForm/ADForm';
import BDForm from '@/components/BDForm/BDForm';
import SHForm from '@/components/SHForm/SHForm';
import TLForm from '@/components/TLForm/TLForm';
import FRForm from '@/components/FRForm/FRForm';
import { useSession } from 'next-auth/react';
// import UserContext from '@/context/userContext/useContext';

const AddNewEmployeePage = () => {

    const { data: session, status } = useSession();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shs, setShs] = useState([]);
    const [bds, setBds] = useState([]);
    const [tls, setTls] = useState([]);
    const [userDetails, setUserDetails] = useState({
        username: "",
        password: "",
        email: "",
        role: "",
        level: "",
        teamleadername: "",
        companiesCompleted: [],
        companiesRejected: [],
        companiesWorking: [],
        companiesAccepted: [],
        companiesCompletedName: [],
        companiesRejectedName: [],
        companiesWorkingName: [],
        companiesAcceptedName: [],
        spreadsheet: "",
        deployedlink: "",
        revenueapi: "",
        preference: "",
        status: "",
    })
    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push("/login")
        }
        else {
            if (status !== "loading" && session?.user?.role !== "ad") {
                router.back();
            }
            setLoading(false);
        }
    }, [session, status, router]);

    const handleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true);

                const url = `${process.env.NEXTAUTH_URL}/api/user`;
                const res = await fetch(url);
                // console.log("res:", res);
                if (res.ok) {
                    const allusers = await res.json();
                    // console.log("allusers:", allusers);
                    const alltls = allusers?.filter((u) => u?.role === "tl")
                    setTls(alltls);
                    const allbds = allusers?.filter((u) => u?.role === "bd");
                    setBds(allbds);
                    const allshs = allusers?.filter((u) => u?.role === "sh");
                    setShs(allshs);
                    const allads = allusers?.filter((u) => u?.role === "ad");
                    setShs(allads);
                    // console.log("tls", alltls);
                    // setError("")
                    setLoading(false);
                }
                else {
                    // setError("please wait");
                    setLoading(false);
                }

            }
            catch (err) {
                // setError("no data found");
                setLoading(false);
                // console.log("error in getting all users:", err);
            }
            finally {
                setLoading(false);
            }
        }
        getUsers();
    }, [])


    return (
        <>
            {loading && <div className="text-white min-h-screen">Loading...</div>}
            {!loading &&
                <div className="w-full min-h-screen flex flex-col justify-start items-center text-white pt-4 pb-24 gap-4 lg:px-4">

                    <div className="flex justify-center items-center gap-4">

                        <h1 className="font-medium text-xl sm:text-sm">Select employee role:</h1>
                        <select value={selectedRole} onChange={handleChange} className="text-black py-1 pl-2">
                            <option value="">Select Role</option>
                            <option value="ad">Admin</option>
                            <option value="bd">BD</option>
                            <option value="sh">Super Head</option>
                            <option value="tl">Team Leader</option>
                            <option value="fr">Franchise</option>
                        </select>
                    </div>

                    {selectedRole === 'ad' &&
                        <Suspense fallback={<p className="text-white text-6xl lg:text-3xl">Loading...</p>}>
                            <ADForm method="post" userdetails={userDetails} setSelectedRole={setSelectedRole} session={session} setSelectedAD={""} users={users} setUsers={setUsers} />
                        </Suspense>
                    }

                    {selectedRole === 'bd' &&
                        <Suspense fallback={<p className="text-white text-6xl lg:text-3xl">Loading...</p>}>
                            <BDForm method="post" userdetails={userDetails} setSelectedRole={setSelectedRole} session={session} setSelectedBD={""} users={users} setUsers={setUsers} />
                        </Suspense>
                    }

                    {selectedRole === 'sh' &&
                        <Suspense fallback={<p className="text-white text-6xl lg:text-3xl">Loading...</p>}>
                            <SHForm method="post" userdetails={userDetails} setSelectedRole={setSelectedRole} session={session} setSelectedSH={""} users={users} setUsers={setUsers} />
                        </Suspense>
                    }

                    {selectedRole === 'tl' &&
                        <Suspense fallback={<p className="text-white text-6xl lg:text-3xl">Loading...</p>}>
                            <TLForm method="post" userdetails={userDetails} setSelectedRole={setSelectedRole} session={session} setSelectedTL={""} users={users} setUsers={setUsers} />
                        </Suspense>

                    }

                    {selectedRole === 'fr' &&
                        <Suspense fallback={<p className="text-white text-6xl lg:text-3xl">Loading...</p>}>
                            {tls && <FRForm method="post" userdetails={userDetails} setSelectedRole={setSelectedRole} teamleaders={tls} session={session} setSelectedFR={""} users={users} setUsers={setUsers} />}
                        </Suspense>
                    }
                </div>

            }
        </>
    );
};

export default AddNewEmployeePage;