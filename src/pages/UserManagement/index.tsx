import { FormRow, SnackBar } from "../../components";
import Wrapper from "../../assets/wrappers/UserManagement";
import { useEffect, useRef, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AccountAdminDrawer, BigNavbarAdmin, NavDialogAdmin, NavLinkSidebarAdmin } from "../../components/Admin"
import userAvatar from "../../assets/images/user-avatar.png";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import Pagination from "./Pagination";
import useAlert from "../../hooks/useAlert";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IoMdCloseCircle } from "react-icons/io";
import Tooltip from "../../components/ToolTip";
import { MdFilterAltOff, MdSearchOff } from "react-icons/md";
import useTimeout from "../../hooks/useTimeout";
import { setUsers } from "../../features/users/usersSlice";

function UserManagement() {
  const dispatch = useAppDispatch()
  const axiosPrivate = useAxiosPrivate();
  const isFirstRender = useRef(true)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  const limitQuery: number = 10;
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const [values, setValues] = useState({
    search_user: "",
  });
  const [sortCreatedAt, setSortCreatedAt] = useState<string>("");
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);

  const { token } = useAppSelector((state) => state.auth)
  const { users } = useAppSelector((state) => state.users)
  const { displayAlert, showAlert, alertText, alertType } = useAlert()
  const [timeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([]);
  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId: NodeJS.Timeout) => clearTimeout(timeoutId));
    setTimeoutIds([]);
  };

  const clearFilter = () => {
    setSortCreatedAt("")
  }

  const onToggleUserStatus = (userId: string, currentStatus: boolean) => {
    setIsLoading(true);
    clearAllTimeouts();
    const newTimeoutId = setTimeout(() => {
      toggleUserActive(userId, currentStatus);
    }, 1000);
    setTimeoutIds([newTimeoutId]);
  };

  const fetchAllUser = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(
        `/users?limit=${limitQuery}&page=${numOfPage}&query=${values.search_user}`
      );
      dispatch(setUsers(data?.data))
      setIsLoading(false);
      setPageCount(data.metadata.pageCount);
      if ((data.metadata.pageCount === 1 && numOfPage !== 1) || (data.metadata.pageCount < numOfPage)) {
        setNumOfPage(1);
      }
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      displayAlert({ msg, type: "error" })
      setIsLoading(false);
    }
  };

  const { callHandler: callFetchAllUser } = useTimeout({
    executeAction: fetchAllUser,
    duration: 500,
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const toggleUserActive = async (userId: string, currentStatus: boolean) => {
    setIsLoading(true);
    try {
      await axiosPrivate.put(`/users/banned/${userId}`, {
        banned: !currentStatus,
      });

      setIsLoading(false);
      fetchAllUser();
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err)
      displayAlert({ msg, type: "error" })
      setIsLoading(false);

    }
  }
  useEffect(() => {
    if (token) {
      fetchAllUser();
    }
  }, [numOfPage]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else {
      callFetchAllUser()
    }
  }, [values.search_user])

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
        <div className="m-[3rem] top-[4rem] w-[100%] flex h-fit flex-col sm:m-0 sm:my-[3rem] sm:mx-[1rem]">
          <button
            onClick={() => {
              setIsDrawerOpen(true);
            }}
            className="hidden p-1 w-fit h-fit relative md:block sm:block text-[#8f8f8f] mb-6"
            id="toggle-nav-links-dialog-btn"
          >
            <RiMenu2Fill className="text-[23px]" />
          </button>

          <div className="flex w-[100%] justify-between">
            <div
              id="title-outlet"
              className="text-[23px] text-[#1d4469] font-bold mb-10"
            >
              User List
              <div className="text-[12px] text-[#CCCCCC] font-normal mt-1">
                Admin Dashboard
              </div>
            </div>
          </div>

          <div className="bg-white py-8 px-10 shadow-md rounded-md">
            <div className=" w-[100%] justify-between flex items-center sm:flex-col ">
              <div className="w-[330px] relative items-center flex sm:w-[100%] ">
                <FormRow
                  type="text"
                  name="search_user"
                  labelText="search user"
                  value={values.search_user}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
                {values.search_user !== "" ? <IoMdCloseCircle onClick={() => setValues({ ...values, search_user: "" })} className=" cursor-pointer absolute text-[#1d4469] end-0 text-[20px] bottom-[26px]" /> : <IoSearchOutline className="absolute text-[#1d4469] end-0 text-[20px] bottom-[26px]" />}
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
                <div className="sm:hidden block pb-2 sm:w-[100%] ml-3">
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

            {users.length === 0 && !isLoading && (
              <div className="text-[80px] flex justify-center w-[100%] my-5 text-[#c0c0c0]">
                {" "}
                <MdSearchOff />
              </div>
            )}
            {users.length === 0 && !isLoading && (
              <div className="text-md text-center w-[100%] my-5 text-[#c0c0c0]">
                {" "}
                Not found any users
              </div>
            )}

            {isLoading && users.length <= 0 && (
              <div className="w-[100%] flex justify-center  h-[165px] items-center">
                <div className="loader w-[50px] h-[50px] border-blue-200 border-b-transparent"></div>
              </div>
            )}

            <div
              className={`overflow-auto rounded-lg shadow block sm:shadow-none ${users.length === 0 && "hidden"
                }`}
            >
              <table className="w-full" id="table-user-list">
                <thead className="border-b-2 border-gray-200 sm:hidden md:hidden">
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
                <tbody className="divide-y divide-gray-100">
                  {users &&
                    users.map((user, index) => {
                      return (
                        <tr
                          key={`user-record-${index}`}
                          className="sm:flex sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md ------ md:flex md:flex-col md:my-5 md:border-[1px] md:rounded-lg md:shadow-md overflow-hidden hover:bg-[#ddd] sm:hover:bg-[#fff] hover:shadow-lg transition ease-in delay-10"
                        >
                          <td
                            className="cursor-pointer p-3 text-[12.5px] text-[#878787] whitespace-nowrap text-left pl-16 sm:text-start sm:bg-[#1966fb] md:bg-[#1966fb] sm:text-white md:text-white sm:pl-5 md:pl-5"
                            id={`username-detail-${index}`}
                          >
                            <div className="flex gap-3 items-center">
                              <img
                                src={
                                  user?.profileUrl
                                    ? user?.profileUrl
                                    : userAvatar
                                }
                                className={`w-[31px] h-[31px] text-[#dbdbdb] ${user?.profileUrl
                                  ? "opacity-100 object-cover object-top rounded-xl"
                                  : "opacity-60"
                                  }`}
                              ></img>
                              {user?.username}
                            </div>
                          </td>
                          <td id={`fname-detail-${index}`} className="p-3 text-[12.5px] text-[#878787] whitespace-nowrap text-left pl-[6%] sm:text-start truncate">
                            <div className="font-bold hidden mr-3 sm:mb-2 sm:block md:mb-2 md:block text-gray-600">
                              First name
                            </div>
                            {user?.fname}
                          </td>
                          <td id={`lname-detail-${index}`} className="p-3 text-[12.5px] text-[#878787] whitespace-nowrap text-left pl-[6%] sm:text-start truncate">
                            <div className="font-bold hidden mr-3 sm:mb-2 sm:block md:mb-2 md:block text-gray-600 ">
                              Last name
                            </div>
                            {user?.lname}
                          </td>
                          <td id={`email-detail-${index}`} className="p-3 text-[12.5px] text-[#878787] whitespace-nowrap text-left pl-[6%] sm:text-start truncate">
                            <div className="font-bold hidden mr-3 sm:mb-2 sm:block md:mb-2 md:block text-gray-600">
                              E-mail
                            </div>
                            {user?.email}
                          </td>
                          <td id={`username-detail-${index}`} className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start md:text-start">
                            <div className="font-bold hidden mr-3 sm:mb-2 sm:block md:mb-2 md:block text-gray-600">
                              Action
                            </div>
                            <div className="flex justify-center sm:justify-start md:justify-start">
                              <button
                                className={`flex justify-center items-center text-white w-[100px] h-[28px] rounded-md transition-all ${user?.isActive
                                  ? "bg-green-500 hover:outline hover:outline-1 hover:outline-green-600 hover:shadow-md"
                                  : "bg-red-500 hover:outline hover:outline-1 hover:outline-red-600 hover:shadow-md"
                                  }`}
                                id={`toggle-permission-user-btn-${index}`}
                                onClick={() => {
                                  onToggleUserStatus(user?.id, user?.isActive);
                                }}
                              >
                                {isLoading ? (
                                  <div className="loader w-[20px] h-[20px]"></div>
                                ) : user?.isActive ? (
                                  "Active"
                                ) : (
                                  "Banned"
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
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
            id="user-management-snackbar"
            severity={alertType}
            showSnackBar={showAlert}
            snackBarText={alertText}
          />
        </div>
      )}
    </Wrapper>
  );
}


export default UserManagement;
