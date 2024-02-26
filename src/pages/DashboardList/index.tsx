import { useAppDispatch } from "../../app/hooks";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  BigNavbar,
  FormRow,
  NavLinkSidebar,
  FormControl,
  NavDialog,
  AccountUserDrawer,
} from "../../components";
import Wrapper from "../../assets/wrappers/Dashboard";
import { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditDashboardDialog from "./EditDashboardDialog";
import ConfirmDelete from "./ConfirmDelete";

function DashboardList() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);

  const dashboard_list = [1, 2, 3, 4, 5];

  const [values, setValues] = useState({
    search_dashboard: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

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
      />
      <div className="flex h-[100vh]">
        <NavLinkSidebar />
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
            <div className="text-[23px] text-[#1d4469] font-bold mb-10">
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
                <div className="w-[140px]">
                  <FormControl title="Sort by date" options={["Date"]} />
                </div>
              </div>
            </div>

            <div className="overflow-auto rounded-lg shadow block sm:shadow-none">
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
                  {dashboard_list.map((i, index) => {
                    return (
                      <tr
                        key={index}
                        className="sm:flex sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md overflow-hidden hover:bg-[#ddd] sm:hover:bg-[#fff] hover:shadow-lg transition ease-in delay-10"
                      >
                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white">
                          Dashboard Name
                        </td>
                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                          <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                            Description{" "}
                          </div>
                          ภายในบ้าน
                        </td>
                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                          <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                            CreatedAt
                          </div>
                          00/00/0000 00:00
                        </td>
                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                          <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                            Action
                          </div>
                          <div className="flex justify-center sm:justify-start">
                            <button
                              onClick={() => {
                                setEditDialogOpen(true);
                              }}
                              className="mr-6 text-[#2E7D32]"
                            >
                              Edit
                            </button>
                            <button
                              className="text-[#dc3546]"
                              onClick={() => {
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

export default DashboardList;
