import {
    BigNavbar,
    FormRow,
    NavLinkSidebar,
    NavDialog,
    AccountUserDrawer,
} from "../../components";
import Wrapper from "../../assets/wrappers/Dashboard";
import { useEffect, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditDashboardDialog from "./EditDashboardDialog";
import ConfirmDelete from "./ConfirmDelete";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosError } from "axios";

function UserManagement() {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
        useState<boolean>(false);
    const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
        useState<boolean>(false);
    const [users, setUsers] = useState<{ username: string, fname: string, lname: string, email: string }[]>([])
    const limitQuery: number = 5
    const [numOfPage, setNumOfPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(0);
    const [values, setValues] = useState({
        search_dashboard: "",
    });
    const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const fetchAllUser = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosPrivate.get(
                `/users?limit=${limitQuery}&page=${numOfPage}`
            );

            setIsLoading(false);
            setUsers(data?.data)
            setPageCount(data.metadata.pageCount);
            if (data.metadata.pageCount === 1 && numOfPage !== 1) {
                setNumOfPage(1)
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                const msg =
                    typeof err?.response?.data?.msg === "object"
                        ? err?.response?.data?.msg[0]
                        : err?.response?.data?.msg;
                console.log(msg)
            }
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAllUser()
    }, [])


    return (
        <Wrapper>
            <AccountUserDrawer
                isAccountUserDrawerOpen={isAccountUserDrawerOpen}
                setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
            />
            <ConfirmDelete
                isDeleteConfirmOpen={isDeleteConfirmOpen}
                setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
            />
            <EditDashboardDialog
                isEditDialogOpen={isEditDialogOpen}
                setEditDialogOpen={setEditDialogOpen}
            />
            <BigNavbar
                isAccountUserDrawerOpen={isAccountUserDrawerOpen}
                setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
                isSidebarShow={isSidebarShow}
                setIsSidebarShow={setIsSidebarShow}
            />
            <div className="flex h-[100vh]">
                <NavLinkSidebar isSidebarShow={isSidebarShow} />
                <NavDialog
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                />
                <div className="m-[3rem] top-[4rem] w-[100%] flex h-fit flex-col sm:m-0 sm:my-[3rem]">
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
                        <div id="title-outlet" className="text-[23px] text-[#1d4469] font-bold mb-10">
                            User List
                            <div className="text-[12px] text-[#CCCCCC] font-normal mt-1">Admin Dashboard</div>
                        </div>

                        <div>
                            <Button
                                onClick={() => {
                                    navigate("/add-dashboard");
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
                                id="setup-user-submit"
                            >
                                Add Dashboard
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white py-8 px-10 shadow-md rounded-md">
                        <div className=" w-[100%] justify-between flex items-center sm:flex-col">
                            <div className="w-[330px] relative items-center flex sm:w-[100%]">
                                <FormRow
                                    type="text"
                                    name="search_dashboard"
                                    labelText="search dashboard"
                                    value={values.search_dashboard}
                                    handleChange={handleChange}
                                    marginTop="mt-[0.2rem]"
                                />
                                <IoSearchOutline className="absolute text-[#1d4469] end-0 text-[20px]" />
                            </div>
                            <div className="flex justify-start sm:w-[100%]">
                                <div className="pb-2 sm:w-[100%]">
                                    <select
                                        id="countries"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-5 py-2"
                                        defaultValue={""}
                                        onChange={() => {

                                        }}
                                    >
                                        <option value="-createdAt">Sort by Date</option>
                                        <option value="%2BcreatedAt">Oldest</option>
                                        <option value="-createdAt">Latest</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-auto rounded-lg shadow block sm:shadow-none">
                            <table className="w-full">
                                <thead className="border-b-2 border-gray-200 sm:hidden">
                                    <tr>
                                        <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                                            Username
                                        </th>
                                        <th className="w-[20%]  text-center text-sm font-semibold tracking-wide ">
                                            Firstname
                                        </th>
                                        <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                                            Lastname
                                        </th>
                                        <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                                            Email
                                        </th>
                                        <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                {/* <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600"> */}
                                <tbody className="divide-y divide-gray-100">
                                    {users && users.map((user, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="sm:flex sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md overflow-hidden hover:bg-[#ddd] sm:hover:bg-[#fff] hover:shadow-lg transition ease-in delay-10"
                                            >
                                                <td onClick={() => {
                                                    navigate("/dashboard/:dashboard_id")
                                                }} className="cursor-pointer p-3 text-[12.5px] text-[#878787] whitespace-nowrap text-left pl-16 sm:text-start sm:bg-[#1966fb] sm:text-white">
                                                    {user?.username}
                                                </td>
                                                <td className="p-3 text-[12.5px] text-[#878787] whitespace-nowrap text-left pl-20 sm:text-start">
                                                    <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                                                        Description{" "}
                                                    </div>
                                                    {user?.fname}
                                                </td>
                                                <td className="p-3 text-[12.5px] text-[#878787] whitespace-nowrap text-left pl-20 sm:text-start">
                                                    <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                                                        CreatedAt
                                                    </div>
                                                    {user?.lname}
                                                </td>
                                                <td className="p-3 text-[12.5px] text-[#878787] whitespace-nowrap text-left pl-8 sm:text-start truncate">
                                                    <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                                                        CreatedAt
                                                    </div>
                                                    {user?.email}
                                                </td>
                                                <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                                                    <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                                                        Action
                                                    </div>
                                                    <div className="flex justify-center sm:justify-start">
                                                        <button className="bg-green-500 text-white w-[100px] h-[28px] rounded-md">Active</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end items-center w-[100%] mt-4">
                            <div className="mr-3 text-[12.4px]">1-5 of items</div>
                            <div className="flex gap-2">
                                <div className="border-[1px] text-[#7a7a7a] border-[#cccccc] rounded-md w-[30px] h-[30px] flex items-center justify-center">
                                    {"<"}
                                </div>
                                <div className="bg-[#1966fb] text-[13.5px]  text-white border-[1px] rounded-md w-[30px] h-[30px] flex items-center justify-center">
                                    1
                                </div>
                                <div className="border-[1px] text-[13.5px] text-[#7a7a7a] border-[#cccccc] rounded-md w-[30px] h-[30px] flex items-center justify-center">
                                    2
                                </div>
                                <div className="border-[1px] text-[13.5px] text-[#7a7a7a] border-[#cccccc] rounded-md w-[30px] h-[30px] flex items-center justify-center">
                                    {">"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

export default UserManagement;
