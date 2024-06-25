import Wrapper from "../../assets/wrappers/ApiKey";
import { useEffect, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AccountAdminDrawer, BigNavbarAdmin, NavDialogAdmin, NavLinkSidebarAdmin } from "../../components/Admin"
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import useAlert from "../../hooks/useAlert";
import { useAppSelector } from "../../app/hooks";
import { SnackBar } from "../../components";
import moment from "moment";

interface IApiKey {
    name: string;
    description: string;
    createdAt: string;
    expiresIn: string
    active: boolean
}

const initialState = {
    name: "",
    description: "",
    createdAt: "",
    expiresIn: "",
    active: true
}

function ApiKeyInformation() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate()
    const { api_key_id } = useParams()
    const { token } = useAppSelector((state) => state.auth)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
        useState<boolean>(false);
    const { showAlert, alertText, alertType, displayAlert } = useAlert()
    const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
    
    const [apiKey, SetApiKey] = useState<IApiKey>(initialState)

    const fetchApiInformation = async () => {
        try {
            const { data } = await axiosPrivate.get(`/api-key/${api_key_id}`)
            SetApiKey(data)
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err)
            displayAlert({ msg, type: "error" })
        }
    }

    useEffect(() => {
        if (token) {
            fetchApiInformation()
        }
    }, [])

    return (
        <Wrapper>
            <AccountAdminDrawer
                isAccountUserDrawerOpen={isAccountUserDrawerOpen}
                setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
            />
            <BigNavbarAdmin
                isAccountUserDrawerOpen={isAccountUserDrawerOpen}
                setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
                isSidebarShow={isSidebarShow}
                setIsSidebarShow={setIsSidebarShow}
            />
            <div className="flex h-[100vh]">
                <NavLinkSidebarAdmin isSidebarShow={isSidebarShow} />
                <NavDialogAdmin
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                />
                {/* content container */}
                <div className="m-[3rem] top-[5rem] min-h-vh w-[100%] flex flex-col rounded-md sm:m-[1rem] sm:mt-[2.5rem]">
                    <div className="flex justify-between">
                        <button
                            onClick={() => {
                                setIsDrawerOpen(true);
                            }}
                            className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
                            id="toggle-nav-links-dialog-btn"
                        >
                            <RiMenu2Fill className="text-[23px]" />
                        </button>

                        <button
                            onClick={() => {
                                navigate("../api-key");
                            }}
                            className="flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 mb-10"
                            id="back-to-devices-list-btn"
                        >
                            <IoArrowBackSharp className="text-sm mr-2" />
                            Back
                        </button>
                    </div>
                    <div className="flex w-[100%] justify-between sm:hidden">
                        <div
                            id="title-outlet"
                            className="text-[22px] text-[#1d4469] font-bold mb-10"
                        >
                            API key Information
                            <div className="text-[12px] text-[#9e9d9d] font-normal mt-1">
                                Admin Dashboard
                            </div>
                        </div>

                    </div>

                    {/* Start Device info container */}
                    <div className="p-5 w-[100%] border-[1px] grid grid-cols-3 border-[#f1f1f1] rounded-md shadow-sm bg-white sm:grid-cols-2 pl-12 pt-10">
                        <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="nameDevice-info">
                            Name
                            <div className="font-medium mt-2 text-[#7a7a7a] text-[13.3px] ">
                                {apiKey?.name}
                            </div>
                        </div>
                        <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="description-info">
                            Description
                            <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                                {apiKey?.description}
                            </div>
                        </div>
                        <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="createdAt-info">
                            Expired In
                            <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                                {moment(apiKey?.expiresIn)
                                    .add(543, "year")
                                    .format("DD/MM/YYYY h:mm")}
                            </div>
                        </div>
                        <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="usernameDevice-info">
                            {/*  */}
                            Status
                            <div className={`dd font-medium mt-2 text-[13.3px] ${apiKey?.active ? "text-green-600" : "text-red-600"}`}>
                                {apiKey?.active ? "Allow" : "Deny"}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showAlert && (
                <div className="block sm:hidden">
                    <SnackBar
                        id="api-key-info-page-snackbar"
                        severity={alertType}
                        showSnackBar={showAlert}
                        snackBarText={alertText}
                    />
                </div>
            )}
        </Wrapper>
    );
}

export default ApiKeyInformation;
