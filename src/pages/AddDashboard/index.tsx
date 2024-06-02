import {
  BigNavbar,
  FormRow,
  NavLinkSidebar,
  NavDialog,
  AccountUserDrawer,
  SnackBar,
} from "../../components";
import Wrapper from "../../assets/wrappers/Dashboard";
import { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { Button } from "@mui/material";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import { Alert } from "@mui/material";

function AddDashboard() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [values, setValues] = useState<{
    nameDashboard: string;
    description: string;
  }>({ nameDashboard: "", description: "" });
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [snackBarText, setSnackBarText] = useState<string>("");
  const [snackBarType, setSnackBarType] = useState<
    "error" | "success" | "info" | "warning"
  >("error");

  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  interface IDashboardInfo {}

  const [timeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([]);
  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId: NodeJS.Timeout) => clearTimeout(timeoutId));
    setTimeoutIds([]);
  };
  const clearAlert = () => {
    setIsLoading(true);
    clearAllTimeouts();
    const newTimeoutId = setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
    setTimeoutIds([newTimeoutId]);
  };

  const onSubmit = async () => {
    const { nameDashboard, description } = values;
    if (!nameDashboard || !description) {
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText("Please provide all value");
      clearAlert();
      return;
    }

    await AddDashboard(values);
  };

  const AddDashboard = async (dashboardInfo: IDashboardInfo) => {
    setIsLoading(true);
    try {
      await axiosPrivate.post(`/dashboards`, dashboardInfo);
      setIsLoading(false);
      setShowSnackBar(true);
      setSnackBarType("success");
      setSnackBarText("Your dashboard has been added");
      clearAlert();
      setIsLoading(false);
      navigate("/dashboard-list");
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText(msg);
      clearAlert();
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <AccountUserDrawer
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
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
        <div className="m-[3rem] top-[5rem] w-[100%] h-fit flex flex-col sm:mx-[1rem]">
          <div className="flex justify-between">
            <button
              onClick={() => {
                setIsDrawerOpen(true);
              }}
              className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
              id="small-open-sidebar-btn"
            >
              <RiMenu2Fill className="text-[23px]" />
            </button>

            <button
              onClick={() => {
                navigate("/dashboard-list");
              }}
              className="flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 mb-10"
            >
              <IoArrowBackSharp className="text-sm mr-2" />
              Back
            </button>
          </div>

          <div className="flex w-[100%] justify-between sm:hidden">
            <div
              id="title-outlet"
              className="text-[23px] text-[#1d4469] font-bold mb-10"
            >
              Add Dashboard
            </div>
          </div>

          <div className="bg-white shadow-md py-8 px-10 rounded-md">
            <div className=" w-[100%] flex flex-col">
              <div className="text-[18px] font-bold text-[#1D4469]">
                Add Dashboard
              </div>
              <div className="text-sm text-[#a4a4a4] mt-3">
                Fill in the information to add a Dashboard from your device.
              </div>
            </div>
            {showSnackBar && snackBarType && (
              <div className="hidden sm:block">
                <Alert
                  severity={snackBarType}
                  sx={{
                    fontSize: "11.8px",
                    alignItems: "center",
                    marginTop: "2rem",
                  }}
                >
                  {snackBarText}
                </Alert>
              </div>
            )}
            <div className="flex gap-10 mt-9 sm:flex-col sm:gap-0 md:gap-0 md:flex-col">
              <FormRow
                type="text"
                name="nameDashboard"
                labelText="Dashboard name"
                value={values.nameDashboard}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
              <FormRow
                type="text"
                name="description"
                labelText="description"
                value={values.description}
                handleChange={handleChange}
                marginTop="mt-[0.2rem] sm:hidden md:hidden"
              />
              <div className="w-100% hidden sm:block md:block mt-[1.2rem]">
                <div className="relative w-full min-w-[200px]">
                  <textarea
                    onChange={handleChange}
                    value={values.description}
                    name="description"
                    className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-gray-200 px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-[1px] focus:border-second focus:border-t-transparent focus:outline-0 disabled:resize-none text-[13.5px] disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=" "
                  ></textarea>
                  <label className="before:content[' '] after:content[' '] flex pointer-events-none absolute left-0 -top-1.5 h-full w-full select-none text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block  after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-second peer-focus:before:border-t-[1px] peer-focus:before:border-l-2 peer-focus:after:border-t-1  peer-focus:after:border-second peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-second">
                    <div className="h-fit flex relative">Description</div>
                  </label>
                </div>
              </div>
            </div>
            <div className="w-[250px] sm:w-[100%]">
              <Button
                onClick={() => {
                  onSubmit();
                }}
                style={{
                  textTransform: "none",
                  width: "100%",
                  height: "39px",
                  marginTop: "1.5rem",
                }}
                sx={{
                  bgcolor: "#1966fb",
                  ":hover": {
                    bgcolor: "#10269C",
                  },
                  ":disabled": {
                    color: "#fff",
                  },
                }}
                variant="contained"
                id="setup-user-submit"
              >
                {isLoading ? (
                  <div className="loader w-[30px] h-[30px]"></div>
                ) : (
                  "Add Dashboard"
                )}
              </Button>
              {showSnackBar && (
                <div id="add-device-snackbar" className="block sm:hidden">
                  <SnackBar
                    id="add-device-snackbar"
                    severity={snackBarType}
                    showSnackBar={showSnackBar}
                    snackBarText={snackBarText}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default AddDashboard;
