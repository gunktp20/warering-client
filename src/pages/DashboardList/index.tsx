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
import moment from "moment";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdSearchOff } from "react-icons/md";

function DashboardList() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dashboards, setDashboard] = useState<
    {
      id: string;
      nameDashboard: string;
      description: string;
      createdAt: string;
    }[]
  >([]);

  const limitQuery: number = 5;
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  // const [limitQuery, setLimitQuery] = useState<number>(5);
  const [selectedDashboard, setSelectedDashboard] = useState<string>("");
  const [sortCreatedAt, setSortCreatedAt] = useState<string>("-createdAt");
  const elements = [];

  const [values, setValues] = useState({
    search_dashboard: "",
  });

  const fetchAllDashboards = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(
        `/dashboards?limit=${limitQuery}&page=${numOfPage}&query=${values.search_dashboard}&createdAt=${sortCreatedAt}`
      );
      setDashboard(data?.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      console.log("data.metadata.pageCount", data.metadata.pageCount);
      setPageCount(data.metadata.pageCount);

      if (data.metadata.pageCount === 1 && numOfPage !== 1) {
        setNumOfPage(1);
      }
    } catch (err: unknown) {
      setIsLoading(false);
    }
  };

  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const hookDeleteSuccess = () => {
    fetchAllDashboards();
  };
  const hookEditSuccess = () => {
    fetchAllDashboards();
  };

  for (let i = 1; i < pageCount + 1; i++) {
    elements.push(
      <button
        onClick={() => {
          setNumOfPage(i);
        }}
        key={i}
        className={`${
          numOfPage === i
            ? "bg-[#1966fb] text-white"
            : "bg-white text-[#7a7a7a]"
        } cursor-pointer  border-[#cccccc] border-[1px] text-[13.5px] rounded-md w-[30px] h-[30px] flex items-center justify-center`}
      >
        {i}
      </button>
    );
  }

  useEffect(() => {
    fetchAllDashboards();
  }, [values.search_dashboard, numOfPage, sortCreatedAt]);

  return (
    <Wrapper>
      <AccountUserDrawer
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
      />
      <ConfirmDelete
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        selectedDashboard={selectedDashboard}
        hookDeleteSuccess={hookDeleteSuccess}
      />
      <EditDashboardDialog
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        selectedDashboard={selectedDashboard}
        hookEditSuccess={hookEditSuccess}
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
              Dashboard List
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
                    id="sort-by-createdAt"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full px-5 py-2 "
                    defaultValue={sortCreatedAt}
                    onChange={(e) => {
                      setSortCreatedAt(e.target.value);
                    }}
                  >
                    <option value="-createdAt">Sort by Date</option>
                    <option value="%2BcreatedAt">Oldest</option>
                    <option value="-createdAt">Latest</option>
                  </select>
                </div>
              </div>
            </div>

            {dashboards.length === 0 && !isLoading && (
              <div className="text-[80px] flex justify-center w-[100%] my-5 text-[#c0c0c0]">
                {" "}
                <MdSearchOff />
              </div>
            )}
            {dashboards.length === 0 && !isLoading && (
              <div className="text-md text-center w-[100%] my-5 text-[#c0c0c0]">
                {" "}
                Not found any Dashboard
              </div>
            )}

            {isLoading && dashboards.length <= 0 && (
              <div className="w-[100%] flex justify-center  h-[165px] items-center">
                <div className="loader w-[50px] h-[50px] border-blue-200 border-b-transparent"></div>
              </div>
            )}

            <div
              className={`overflow-auto rounded-lg shadow block sm:shadow-none ${
                dashboards.length === 0 && "hidden"
              }`}
            >
              <table className="w-full">
                <thead className="border-b-2 border-gray-200 sm:hidden">
                  <tr>
                    <th className=" w-[25%]  text-center text-sm font-semibold tracking-wide ">
                      Dashboard Name
                    </th>
                    <th className="w-[25%]  text-center text-sm font-semibold tracking-wide ">
                      Description
                    </th>
                    <th className=" w-[25%]  text-center text-sm font-semibold tracking-wide ">
                      CreatedAt
                    </th>
                    <th className=" w-[25%]  text-center text-sm font-semibold tracking-wide ">
                      Action
                    </th>
                  </tr>
                </thead>
                {/* <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600"> */}
                <tbody className="divide-y divide-gray-100">
                  {dashboards.map((dashboard, index) => {
                    return (
                      <tr
                        key={index}
                        className="sm:flex h-[49.5px] sm:h-max sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md overflow-hidden hover:bg-[#ddd] sm:hover:bg-[#fff] hover:shadow-lg transition ease-in delay-10"
                      >
                        <td
                          onClick={() => {
                            navigate("/dashboard/" + dashboard.id);
                          }}
                          className="cursor-pointer p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white "
                        >
                          {dashboard?.nameDashboard}
                        </td>
                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                          <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600 ">
                            Description{" "}
                          </div>
                          {dashboard?.description}
                        </td>
                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                          <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                            CreatedAt
                          </div>
                          {moment(dashboard?.createdAt)
                            .add(543, "year")
                            .format("DD/MM/YYYY h:mm")}
                        </td>
                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                          <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                            Action
                          </div>
                          <div className="flex justify-center sm:justify-start">
                            <button
                              onClick={() => {
                                setSelectedDashboard(dashboard?.id);
                                setEditDialogOpen(true);
                              }}
                              className="mr-6 text-[#2E7D32]"
                            >
                              Edit
                            </button>
                            <button
                              className="text-[#dc3546]"
                              onClick={() => {
                                setSelectedDashboard(dashboard?.id);
                                setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {pageCount > 1 && (
              <div className="flex justify-end items-center w-[100%] mt-4 sm:flex-col">
                <div className="mr-3 sm:mb-3 text-[12.4px]">1-5 of items</div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (numOfPage > 1) {
                        setNumOfPage(numOfPage - 1);
                      }
                    }}
                    className="cursor-pointer text-[#5e5e5e] bg-gray-50 rounded-md w-[30px] h-[30px] flex items-center justify-center hover:bg-gray-100 hover:border-[1px]"
                  >
                    <MdKeyboardArrowLeft />
                  </button>
                  {elements}
                  <button
                    onClick={() => {
                      if (numOfPage < pageCount) {
                        setNumOfPage(numOfPage + 1);
                      }
                    }}
                    className="cursor-pointer text-[#5e5e5e] bg-gray-50 rounded-md w-[30px] h-[30px] flex items-center justify-center hover:bg-gray-100 hover:border-[1px]"
                  >
                    <MdKeyboardArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default DashboardList;
