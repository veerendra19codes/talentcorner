'use client'

import { useSession } from 'next-auth/react';
import React, { useState, useEffect, Suspense, useContext } from 'react';
import ADForm from '@/components/ADForm/ADForm';
import BDForm from '@/components/BDForm/BDForm';
import TLForm from '@/components/TLForm/TLForm';
import SHForm from '@/components/SHForm/SHForm';
import FRForm from '@/components/FRForm/FRForm';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from "axios";


const EditPage = () => {
    // console.log("render edit")

    const router = useRouter();
    const { data: session, status } = useSession();
    const [users, setUsers] = useState([]);
    // console.log("users:", users);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedAD, setSelectedAD] = useState('');
    const [selectedBD, setSelectedBD] = useState('');
    const [selectedSH, setSelectedSH] = useState('');
    const [selectedTL, setSelectedTL] = useState('');
    const [selectedFR, setSelectedFR] = useState('');
    const [ads, setAds] = useState([]);
    const [bds, setBds] = useState([]);
    const [shs, setShs] = useState([]);
    const [tls, setTls] = useState([]);
    const [frs, setFrs] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        setUserDetails({});
        setSelectedAD("");
        setSelectedBD("");
        setSelectedSH("");
        setSelectedTL("");
        setSelectedFR("");
    }, [selectedRole]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/user`);
                // console.log("response:", response);
                const allusers = response.data;
                setUsers(allusers);

                const allbds = allusers?.filter((u) => u?.role === "bd");
                setBds(allbds);
                // console.log("allbds:", allbds);

                const alltls = allusers?.filter((u) => u?.role === "tl");
                setTls(alltls);
                // console.log("alltls:", alltls);

                const allshs = allusers?.filter((u) => u?.role === "sh");
                setShs(allshs);
                // console.log("allshs:", allshs);

                const allads = allusers?.filter((u) => u?.role === "ad");
                setAds(allads);
                // console.log("allads:", allads);

            } catch (error) {
                // console.error("Error fetching users:", error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };
        getUsers();
    }, []);

    useEffect(() => {
        // console.log("selectedRole in first useEffect:", selectedRole);

        if (selectedRole == "fr" || frs?.length == 0 || tls?.length == 0) {
            const fetchData = async () => {
                try {
                    if (tls.length == 0) {
                        // Filter users whose role is 'tl'
                        const filteredTls = allUsers?.filter(user => user?.role === 'tl');
                        setTls(filteredTls);
                    }
                    if (frs.length == 0) {
                        const filteredFrs = users?.filter(user => user?.teamleadername === selectedTL && user?.role === "fr");
                        setFrs(filteredFrs);
                    }
                } catch (error) {
                    // console.error("Error fetching users:", error);
                }
            };
            fetchData();
        }


        //FETCHING USER DETAILS TO EDIT
        if (selectedRole == "ad" && selectedAD) {
            // console.log("getting details from db of bd:", selectedTL);
            const fetchuserdetails = async () => {
                try {
                    const userdetails = users?.filter(user => user?.username === selectedAD);
                    // console.log("userdetails:", userdetails);

                    setUserDetails(userdetails[0]);
                } catch (error) {
                    // console.error("Error fetching userdetails:", error);
                }
            }
            fetchuserdetails();
        }

        if (selectedRole == "bd" && selectedBD) {
            // console.log("getting details from db of bd:", selectedTL);
            const fetchuserdetails = async () => {
                try {
                    const userdetails = users?.filter(user => user?.username === selectedBD);
                    // console.log("userdetails:", userdetails);

                    setUserDetails(userdetails[0]);
                } catch (error) {
                    // console.error("Error fetching userdetails:", error);
                }
            }
            fetchuserdetails();
        }

        if (selectedRole == "sh" && selectedSH) {
            // console.log("getting details from db of sh:", selectedSH);
            const fetchuserdetails = async () => {
                try {
                    const userdetails = users?.filter(user => user?.username === selectedSH);

                    setUserDetails(userdetails[0]);
                } catch (error) {
                    // console.error("Error fetching userdetails:", error);
                }
            }
            fetchuserdetails();
        }

        if (selectedRole == "tl" && selectedTL) {
            // console.log("getting details from db of tl:", selectedTL);
            const fetchuserdetails = async () => {
                try {
                    const userdetails = users?.filter(user => user?.username === selectedTL);

                    setUserDetails(userdetails[0]);
                } catch (error) {
                    // console.error("Error fetching userdetails:", error);
                }
            }
            fetchuserdetails();
        }

        if (selectedRole == "fr" && selectedFR) {
            const fetchuserdetails = async () => {
                try {
                    const userdetails = users?.filter(user => user?.username === selectedFR);

                    setUserDetails(userdetails[0]);
                } catch (error) {
                    // console.error("Error fetching userdetails:", error);
                }
            }
            fetchuserdetails();
        }

    }, [selectedRole, selectedAD, selectedSH, selectedBD, selectedTL, selectedFR, setUsers, frs.length, tls.length, users]);

    const selectRole = (e) => {
        setUserDetails({});
        setSelectedBD("");
        setSelectedSH("");
        setSelectedTL("");
        setSelectedFR("");
        setSelectedRole(e.target.value);
    };

    const SelectAD = (e) => {
        setUserDetails({});
        setSelectedAD(e.target.value);
        // console.log("selectedBD in selectBD fn:", selectedBD);
    };

    const SelectBD = (e) => {
        setUserDetails({});
        setSelectedBD(e.target.value);
        // console.log("selectedBD in selectBD fn:", selectedBD);
    };

    const SelectSH = (e) => {
        setUserDetails({});
        setSelectedSH(e.target.value);
        // console.log("selectedSH in selectSH fn:", selectedSH);
    };

    const SelectTL = (e) => {
        setUserDetails({});
        setFrs([]);
        // console.log("userdetails:", userdetails);

        setSelectedFR("");
        setSelectedTL(e.target.value);
        // console.log("selectedTL in selectTL fn:", selectedTL);
    };

    //selectFR
    const handleSelectChange = (selectedValue) => {
        setUserDetails({});
        setSelectedFR(selectedValue);
    }

    return (
        <>
            {loading ?
                <div className="text-white min-h-screen">Loading...</div> :
                <div className="w-full min-h-screen flex flex-col justify-start items-center text-white py-4 gap-4 lg:px-4 pb-24">

                    <div className="flex lg:flex-col justify-center items-center gap-4 lg:gap-2 w-full">

                        <div className="flex justify-center items-center lg:w-full lg:justify-between">

                            <h1 className="font-medium text-xl lg:text-xs lg:font-normal">Select employee role:</h1>
                            <select value={selectedRole} onChange={selectRole} className="text-black py-1 px-2 lg:w-1/2 rounded lg:text-[12px]">
                                <option value="">Select Role</option>
                                <option value="ad">Admin</option>
                                <option value="bd">BD</option>
                                <option value="sh">Super Head</option>
                                <option value="tl">Team Leader</option>
                                <option value="fr">Franchise</option>
                            </select>
                        </div>


                        {selectedRole === 'fr' && (
                            <div className="flex  gap-4 lg:flex-col lg:gap-2 lg:w-full">

                                <div className="tldropdown flex  items-center justify-center lg:justify-between lg:w-full">

                                    <label className=" text-white font-medium text-xl lg:text-xs lg:font-normal">Select Teamleader:</label >
                                    <select
                                        className="text-black py-1 px-2 rounded lg:w-1/2 lg:text-[12px]"
                                        onChange={SelectTL}
                                        value={selectedTL}
                                    >
                                        <option value="">Select Team Leader</option>
                                        {tls?.map(tl => (
                                            <option key={tl._id} value={tl.username}>{tl.username}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedTL &&
                                    <div className="frdropdown flex  items-center justify-center lg:justify-between lg:w-full lg:text-[12px]">

                                        <label className="text-white font-medium text-xl lg:text-xs lg:font-normal">Select Franchise:</label >

                                        <Select
                                            onValueChange={(selectedValue) => handleSelectChange(selectedValue)} className="rounded border-none outline-none focus:outline-none focus:border-none" placeholder="Select Franchise"
                                        >
                                            <SelectTrigger className="w-32 lg:w-1/2 h-[36px] lg:h-[32px]  px-2 lg:p-0 rounded" placeholder="Select Franchise lg:text-[12px]" value={selectedFR}>
                                                <SelectValue placeholder="Select Franchise" />
                                            </SelectTrigger>
                                            <SelectContent className="h-[150px]">
                                                <SelectItem value="select" className="py-1" disabled >Select Franchise</SelectItem>
                                                {frs?.map((f) => (
                                                    <SelectItem key={f._id} value={f.username} className="py-1">{f.username}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                }
                            </div>

                        )}

                        {selectedRole === 'tl' && (
                            <div className="tldropdown flex  items-center justify-center lg:justify-between lg:w-full">

                                <label className=" text-white font-medium text-xl lg:text-xs lg:font-normal">Select Teamleader:</label >
                                <select
                                    className="text-black py-1 px-2 rounded lg:w-1/2 lg:text-[12px]"
                                    onChange={SelectTL}
                                    value={selectedTL}
                                >
                                    <option value="">Select Team Leader</option>
                                    {tls?.map(tl => (
                                        <option key={tl._id} value={tl.username}>{tl.username}</option>
                                    ))}
                                </select>
                            </div>
                        )
                        }

                        {selectedRole === 'bd' && (
                            <div className="bddropdown flex  items-center justify-center lg:justify-between lg:w-full">

                                <label className=" text-white font-medium text-xl lg:text-xs lg:font-normal">Select BD:</label >
                                <select
                                    className="text-black py-1 px-2 rounded lg:w-1/2 lg:text-[12px]"
                                    onChange={SelectBD}
                                    value={selectedBD}
                                >
                                    <option value="">Select BD</option>
                                    {bds?.map(bd => (
                                        <option key={bd._id} value={bd.username}>{bd.username}</option>
                                    ))}
                                </select>
                            </div>
                        )
                        }

                        {selectedRole === 'sh' && (
                            <div className="shdropdown flex  items-center justify-center lg:justify-between lg:w-full">

                                <label className=" text-white font-medium text-xl lg:text-xs lg:font-normal">Select SH:</label >
                                <select
                                    className="text-black py-1 px-2 rounded lg:w-1/2 lg:text-[12px]"
                                    onChange={SelectSH}
                                    value={selectedSH}
                                >
                                    <option value="">Select SH</option>
                                    {shs?.map((sh) => (
                                        <option key={sh._id} value={sh.username}>{sh.username}</option>
                                    ))}
                                </select>
                            </div>
                        )
                        }

                        {selectedRole === 'ad' && (
                            <div className="bddropdown flex  items-center justify-center lg:justify-between lg:w-full">

                                <label className=" text-white font-medium text-xl lg:text-xs lg:font-normal">Select AD:</label >
                                <select
                                    className="text-black py-1 px-2 rounded lg:w-1/2 lg:text-[12px]"
                                    onChange={SelectAD}
                                    value={selectedAD}
                                >
                                    <option value="">Select AD</option>
                                    {ads?.map(ad => (
                                        <option key={ad._id} value={ad.username}>{ad.username}</option>
                                    ))}
                                </select>
                            </div>
                        )
                        }

                    </div>

                    {selectedRole == "fr" && selectedFR && userDetails?.username &&
                        <Suspense fallback={<p className="text-white text-6xl lg:text-3xl text-center">Loading...</p>}>
                            <FRForm
                                userdetails={userDetails} method="put" setSelectedRole={setSelectedRole} teamleaders={tls} setSelectedFR={setSelectedFR} users={users} setUsers={setUsers}
                            />
                        </Suspense>
                    }

                    {selectedRole == "tl" && selectedTL && userDetails?.username &&
                        <Suspense fallback={<p className="text-white text-6xl lg:text-3xl text-center">Loading...</p>}>
                            <TLForm
                                userdetails={userDetails} method="put" setSelectedRole={setSelectedRole} setSelectedTL={setSelectedTL} users={users} setUsers={setUsers}
                            />
                        </Suspense>
                    }

                    {selectedRole == "sh" && selectedSH && userDetails?.username &&
                        <Suspense fallback={<p className="text-white text-6xl lg:text-3xl text-center">Loading...</p>}>
                            <SHForm
                                userdetails={userDetails} method="put" setSelectedRole={setSelectedRole} setSelectedSH={setSelectedSH} users={users} setUsers={setUsers} />
                        </Suspense>
                    }

                    {selectedRole == "bd" && selectedBD && userDetails?.username &&
                        <Suspense fallback={<p className="text-white text-6xl lg:text-3xl text-center">Loading...</p>}>
                            <BDForm
                                userdetails={userDetails} method="put"
                                setSelectedRole={setSelectedRole} setSelectedBD={setSelectedBD} users={users} setUsers={setUsers}
                            />
                        </Suspense>
                    }

                    {selectedRole == "ad" && selectedAD && userDetails?.username &&
                        <Suspense fallback={<p className="text-white text-6xl lg:text-3xl text-center">Loading...</p>}>
                            <ADForm
                                userdetails={userDetails} method="put"
                                setSelectedRole={setSelectedRole} session={session}
                                setSelectedAD={setSelectedAD} users={users} setUsers={setUsers}
                            />
                        </Suspense>
                    }
                </div>
            }
        </>
    )
}

export default EditPage
