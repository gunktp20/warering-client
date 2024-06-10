import { FormRow, SnackBar } from "../../components";
import Wrapper from "../../assets/wrappers/ApiKey";
import { useEffect, useRef, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AccountAdminDrawer, BigNavbarAdmin, NavDialogAdmin, NavLinkSidebarAdmin } from "../../components/Admin"
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import Pagination from "./Pagination";
import Tooltip from "../../components/ToolTip";
import SwitchSave from "./SwitchSave";
import CreateApiKeyDialog from "./CreateApiKeyDialog";
import { Button } from "@mui/material"
import { IoMdCloseCircle } from "react-icons/io";
import useAlert from "../../hooks/useAlert";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ConfirmDelete from "./ConfirmDeleteDevice";
import { setSelectedApiKey, setApiKeys } from "../../features/apiKey/apiKeySlice";
import { MdFilterAltOff, MdSearchOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useTimeout from "../../hooks/useTimeout";

function ApiKeys() {
    const axiosPrivate = useAxiosPrivate();
    const isFirstRender = useRef(true);
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { token } = useAppSelector((state) => state.auth)
    const { apiKeys } = useAppSelector((state) => state.apiKey)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
        useState<boolean>(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
        useState<boolean>(false);
    const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
    const [isCreateApiKeyOpen, setIsCreateApiKeyOpen] = useState<boolean>(false);
    const { showAlert, alertText, alertType, displayAlert } = useAlert()
    const [sortCreatedAt, setSortCreatedAt] = useState<string>("");
    const limitQuery: number = 5;
    const [numOfPage, setNumOfPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(0);
    const [values, setValues] = useState({
        search_key: "",
    });

    const clearFilter = () => {
        setSortCreatedAt("")
    }

    const callBackAddSuccess = () => {
        fetchAllApiKeys()
    }

    const callBackDeleteSuccess = () => {
        fetchAllApiKeys()
        displayAlert({ msg: `Deleted your API key`, type: "error" })
    }

    const fetchAllApiKeys = async () => {
        setIsLoading(true)
        try {
            const { data } = await axiosPrivate.get(`/api-key?limit=${limitQuery}&page=${numOfPage}&query=${values.search_key}&createdAt=${sortCreatedAt ? sortCreatedAt : "-createdAt"} `)
            dispatch(setApiKeys(data.data))
            setIsLoading(false)
            setPageCount(data.metadata.pageCount);

            if ((data.metadata.pageCount === 1 && numOfPage !== 1) || (data.metadata.pageCount < numOfPage)) {
                setNumOfPage(1);
            }
        } catch (err) {
            const msg = await getAxiosErrorMessage(err)
            displayAlert({ msg, type: "error" })
        }
    }

    const { callHandler: callFetchApiKeys } = useTimeout({
        executeAction: fetchAllApiKeys,
        duration: 500,
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const onToggleSwitchKeyStatus = ({
        id,
        status,
    }: {
        id: string;
        status: boolean;
    }): void => {
        setApiKeyStatus(id, status);
    };

    const setApiKeyStatus = async (apiKeyId: string, status: boolean) => {
        try {
            const { data } = await axiosPrivate.patch(`/api-key/${apiKeyId}`, {
                isActive: status,
            });
            setIsLoading(false);
            fetchAllApiKeys()
            setPageCount(data.metadata.pageCount);
        } catch (err: unknown) {
            setIsLoading(false);
        }
    };

    const { callHandler: callToggleSwitchStatus } = useTimeout({
        executeAction: onToggleSwitchKeyStatus,
        duration: 500,
    });

    useEffect(() => {
        if (token) {
            fetchAllApiKeys()
        }
    }, [
        numOfPage,
        sortCreatedAt,

    ]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // Set the ref to false after the initial render
        } else {
            callFetchApiKeys();
        }
    }, [values.search_key])

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
            <ConfirmDelete isDeleteConfirmOpen={isDeleteConfirmOpen} setIsDeleteConfirmOpen={setIsDeleteConfirmOpen} callBackDeleteSuccess={callBackDeleteSuccess} />
            <CreateApiKeyDialog isCreateApiKeyOpen={isCreateApiKeyOpen} setIsCreateApiKeyOpen={setIsCreateApiKeyOpen} callBackAddSuccess={callBackAddSuccess} />
            <div className="flex h-[100vh]">
                <NavLinkSidebarAdmin isSidebarShow={isSidebarShow} />
                <NavDialogAdmin
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                />
                <div className="m-[3rem] top-[4rem] w-[100%] flex h-fit flex-col sm:m-0 sm:my-[3rem] sm:mx-[1rem]">
                    <button
                        onClick={() => {
                            setIsDrawerOpen(true);
                        }}
                        className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
                        id="small-open-sidebar-btn"
                    >
                        <RiMenu2Fill className="text-[23px]" />
                    </button>

                    <div className="flex w-[100%] justify-between">
                        <div
                            id="title-outlet"
                            className="text-[23px] text-[#1d4469] font-bold mb-10"
                        >
                            Api Keys
                            <div className="text-[12px] text-[#CCCCCC] font-normal mt-1">
                                Admin Dashboard
                            </div>
                        </div>
                        <div>
                            <Button
                                onClick={() => {
                                    setIsCreateApiKeyOpen(!isCreateApiKeyOpen)
                                }}
                                style={{
                                    textTransform: "none",
                                    width: "100%",
                                    height: "39px",
                                }}
                                sx={{
                                    border: 2,
                                    paddingX: 4,
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
                                Create Api Key
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white py-8 px-10 shadow-md rounded-md">
                        <div className=" w-[100%] justify-between flex items-center sm:flex-col ">
                            <div className="w-[330px] relative items-center flex sm:w-[100%] ">
                                <FormRow
                                    type="text"
                                    name="search_key"
                                    labelText="search key"
                                    value={values.search_key}
                                    handleChange={handleChange}
                                    marginTop="mt-[0.2rem]"
                                />
                                {values.search_key !== "" ? <IoMdCloseCircle onClick={() => setValues({ ...values, search_key: "" })} className=" cursor-pointer absolute text-[#1d4469] end-0 text-[20px] bottom-[26px]" /> : <IoSearchOutline className="absolute text-[#1d4469] end-0 text-[20px] bottom-[26px]" />}
                            </div>
                            <div className="flex justify-start sm:w-[100%]">
                                <div className="pb-2 sm:w-[100%] ">
                                    <select
                                        id="sort-by-date-select"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full px-5 py-2 "
                                        onChange={(e) => {
                                            setSortCreatedAt(e.target.value);
                                        }}
                                        value={sortCreatedAt}
                                    >
                                        <option value="">Sort by Date</option>
                                        <option value="%2BcreatedAt">Oldest</option>
                                        <option value="-createdAt">Latest</option>
                                    </select>
                                </div>
                                <div className="block pb-2 ml-3 mr-2">
                                    <Tooltip text="ClearFilter">
                                        <button
                                            onClick={clearFilter}
                                            id="clear-filter-desktop-btn"
                                            className=" text-gray-400 hover:bg-primary-800 hover:text-white text-sm rounded-lg transition-all h-[100%] focus:ring-blue-500 focus:border-gray-500 block py-2 px-[9px] w-fit"
                                        >
                                            <MdFilterAltOff className="text-[20px]" />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>

                        {apiKeys.length === 0 && !isLoading && (
                            <div className="text-[80px] flex justify-center w-[100%] my-5 text-[#c0c0c0]">
                                {" "}
                                <MdSearchOff />
                            </div>
                        )}
                        {apiKeys.length === 0 && !isLoading && (
                            <div className="text-md text-center w-[100%] my-5 text-[#c0c0c0]">
                                {" "}
                                Not found any keys
                            </div>
                        )}

                        {isLoading && apiKeys.length <= 0 && (
                            <div className="w-[100%] flex justify-center  h-[165px] items-center">
                                <div className="loader w-[50px] h-[50px] border-blue-200 border-b-transparent"></div>
                            </div>
                        )}

                        <div
                            className={`overflow-auto rounded-lg shadow block sm:shadow-none ${apiKeys.length === 0 && "hidden"
                                }`}
                        >
                            <table className="w-full" id="table-user-list">
                                <thead className="border-b-2 border-gray-200 sm:hidden md:hidden">
                                    <tr>
                                        <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                                            Name
                                        </th>
                                        <th className="w-[20%]  text-center text-sm font-semibold tracking-wide ">
                                            Description
                                        </th>
                                        <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                                            Active
                                        </th>
                                        <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                                            createdAt
                                        </th>
                                        <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(apiKeys && apiKeys.length > 0) && apiKeys?.map((apiKey, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="sm:flex sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md ------ md:flex md:flex-col md:my-5 md:border-[1px] md:rounded-lg md:shadow-md overflow-hidden hover:bg-[#ddd] sm:hover:bg-[#fff] hover:shadow-lg transition ease-in delay-10"
                                            >
                                                <td onClick={() => {
                                                    navigate(`${apiKey._id}`)
                                                }}
                                                    className="cursor-pointer pl-[6%] p-3 text-[12.5px] text-[#878787] whitespace-nowrap text-left sm:text-start sm:bg-[#1966fb] md:bg-[#1966fb] sm:text-white md:text-white sm:pl-5 md:pl-5"

                                                >
                                                    <div className="flex gap-3 items-center cursor-pointer">

                                                        {apiKey.name}
                                                    </div>
                                                </td>
                                                <td onClick={() => {
                                                    navigate(`${apiKey._id}`)
                                                }} className="p-3 pl-[6%] text-[12.5px] text-[#878787] cursor-pointer whitespace-nowrap text-left sm:text-start truncate sm:pl-4">
                                                    <div className="font-bold hidden mr-3 sm:mb-2 sm:block md:mb-2 md:block text-gray-600">
                                                        Description
                                                    </div>
                                                    {apiKey.description}
                                                </td>
                                                <td className="p-3 text-[12.5px] text-[#878787] whitespace-nowrap text-left flex justify-left items-center sm:items-start flex-col sm:text-start md:items-start truncate">
                                                    <div className="font-bold hidden mr-3 sm:mb-2 sm:block md:mb-2 md:block text-gray-600 ">
                                                        Active
                                                    </div>
                                                    <Tooltip text="Toggle active and deny API key">
                                                        <SwitchSave
                                                            checked={apiKey.active}
                                                            id={apiKey._id + "-switch-save"}
                                                            onClick={() => {
                                                                callToggleSwitchStatus({ id: apiKey._id, status: !apiKey.active })
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </td>
                                                <td onClick={() => {
                                                    navigate(`${apiKey._id}`)
                                                }} className="p-3 pl-[6%] text-[12.5px] text-[#878787] cursor-pointer whitespace-nowrap text-left  sm:text-start truncate sm:pl-4">
                                                    <div className="font-bold hidden mr-3 sm:mb-2 sm:block md:mb-2 md:block text-gray-600">
                                                        CreatedAt
                                                    </div>
                                                    {moment(apiKey.createdAt)
                                                        .add(543, "year")
                                                        .format("DD/MM/YYYY h:mm")}
                                                </td>
                                                <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start md:text-start">
                                                    <div className="font-bold hidden mr-3 sm:mb-2 sm:block md:mb-2 md:block text-gray-600">
                                                        Action
                                                    </div>
                                                    <div className="flex justify-center sm:justify-start md:justify-start">
                                                        <button
                                                            className={`flex justify-center items-center text-white w-[100px] h-[28px] rounded-md transition-all bg-[#dc3546]`}

                                                            onClick={() => {
                                                                dispatch(setSelectedApiKey(apiKey._id))
                                                                setIsDeleteConfirmOpen(true)
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination numOfPage={numOfPage} setNumOfPage={setNumOfPage} pageCount={pageCount} />
                    </div>
                </div>
            </div>
            {showAlert && (
                <div className="block sm:hidden">
                    <SnackBar
                        id="device-page-snackbar"
                        severity={alertType}
                        showSnackBar={showAlert}
                        snackBarText={alertText}
                    />
                </div>
            )}
        </Wrapper>
    );
}


export default ApiKeys;
