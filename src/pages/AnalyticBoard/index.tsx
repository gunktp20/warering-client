import { useEffect, useRef, useState } from 'react'
import { AccountUserDrawer, BigNavbar, NavDialog, NavLinkSidebar } from '../../components'
import Wrapper from '../../assets/wrappers/AnalyticDashboard';
import { Line } from "react-chartjs-2";
import { Button } from "@mui/material";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from "chart.js";
import SelectDeviceDialog from './SelectDeviceDialog';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, zoomPlugin);
import zoomPlugin from 'chartjs-plugin-zoom';
import averageRecords from '../../utils/averageRecords';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import moment from 'moment';
import { RiMenu2Fill } from 'react-icons/ri';
import { IoAnalyticsOutline } from "react-icons/io5";

function AnalyticBoard() {
    const axiosPrivate = useAxiosPrivate()
    const [selectedDevice, setSelectedDevice] = useState<string>("")
    const [averagedTimeStamps, setAveragedTimeStamps] = useState<string[]>([])
    const [averagedVals, setAveragedVals] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const desiredLength = 30;

    const getPayloads = async (device_id: string, payload_key: string) => {
        setIsLoading(true)
        try {
            const { data } = await axiosPrivate.get(`export/${device_id}`)
            const { averagedTimeStamps, averagedVals } = await averageRecords(data, desiredLength, payload_key);
            setAveragedTimeStamps(averagedTimeStamps)
            setAveragedVals(averagedVals)
            setIsLoading(false)
        } catch (err: unknown) {
            setIsLoading(false)
        }
    }

    const data = {
        labels: averagedTimeStamps.length > 0 ? averagedTimeStamps.map((timeStamp) => {
            return moment(timeStamp)
                .add(543, "year")
                .format("h:mm:ss")
        }) : [],
        datasets: [
            {
                label: "",
                data: averagedVals,
                backgroundColor: "#1966fb",
                borderColor: "#1964fb57",
                border: "1px",
                pointBorderColor: "#1966fb",
                fill: true,
                tension: 0.4,
                borderWidth: 1.8,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        animation: {
            duration: 1,
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 10,
                    }
                }
            },
            y: {
                ticks: {
                    font: {
                        size: 10,
                    }
                }
            }
        }
    };

    const [isSelectDeviceActive, setIsSelectDeviceActive] = useState<boolean>(false)
    const isFirstRender = useRef(true)
    const hookDeleteSuccess = () => {

    }

    const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
        useState<boolean>(false);
    const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
        } else {
            // 
        }
    }, [])

    return (
        <Wrapper>
            <AccountUserDrawer
                isAccountUserDrawerOpen={isAccountUserDrawerOpen}
                setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
            />
            <BigNavbar
                isAccountUserDrawerOpen={isAccountUserDrawerOpen}
                setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
                setIsSidebarShow={setIsSidebarShow}
                isSidebarShow={isSidebarShow}
            />
            <SelectDeviceDialog selectedDevice={selectedDevice} setSelectedDevice={setSelectedDevice} isSelectDeviceActive={isSelectDeviceActive} setIsSelectDeviceActive={setIsSelectDeviceActive} hookDeleteSuccess={hookDeleteSuccess} getPayloadsByDeviceId={getPayloads} />
            <div className="flex h-[100%]">
                <NavLinkSidebar isSidebarShow={isSidebarShow} />
                <NavDialog
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                />
                {/* content container */}

                <div className="m-[3rem] top-[4rem] w-[100%] flex h-fit flex-col sm:m-0 sm:my-[3rem] sm:mx-[1rem]">
                    <button
                        onClick={() => {
                            setIsDrawerOpen(true);
                        }}
                        className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
                        id="toggle-nav-links-dialog-btn"
                    >
                        <RiMenu2Fill className="text-[23px]" />
                    </button>

                    <div className="flex w-[100%] justify-between">
                        <div
                            id="title-outlet"
                            className="text-[23px] text-[#1d4469] font-bold mb-10"
                        >

                            Visualization
                        </div>
                        <div>
                            <Button
                                onClick={() => {
                                    setIsSelectDeviceActive(true)
                                }}
                                style={{
                                    textTransform: "none",
                                    width: "100%",
                                    height: "39px",
                                }}
                                sx={{
                                    border: 2,
                                    fontWeight: "bold",
                                    alignItems: "center",
                                    fontSize: "12px",
                                    color: "#1D4469",
                                    ":hover": {},
                                    ":disabled": {
                                        color: "#fff",
                                    },
                                }}
                                variant="outlined"
                                id="toggle-add-dashboard-dialog-btn"
                            >
                                Select Device
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white h-[480px] py-8 px-10 shadow-md rounded-md flex justify-center items-center">
                        {(isLoading && !isFirstRender.current) ? <div className='w-[100%] flex justify-center items-center h-[300px]'>
                            <div className='loader w-[50px] h-[50px] border-blue-200 border-b-transparent'></div>
                        </div> : <div className='w-[100%] h-[80%] flex justify-center items-center'>
                            {selectedDevice && !isLoading && averagedVals.length > 0 ?
                                // if any device was selected then render line chart because averagedValues was done absolutely
                                <div className='w-[100%] h-[100%]' >
                                    <Line data={data} options={options} />
                                </div> :
                                // if no selected device render note..
                                <div className=' w-[100%] flex justify-center items-center flex-col mt-4'>
                                    {averagedVals.length === 0 && (
                                        <div className="text-[80px] flex justify-center w-[100%] my-5 text-[#c0c0c0]">
                                            {" "}
                                            <IoAnalyticsOutline />
                                        </div>
                                    )}
                                    {averagedVals.length === 0 && (
                                        <div className="text-sm text-center w-[100%] my-5 text-[#c0c0c0]" id="select-device-note">
                                            {" "}
                                            Select your device and key of payload that you want to refer
                                        </div>
                                    )}


                                </div>}
                        </div>}
                    </div>
                </div>
            </div>
        </Wrapper >

    )
}


export default AnalyticBoard
