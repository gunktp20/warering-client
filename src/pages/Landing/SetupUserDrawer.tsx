import { Drawer, Box, Typography , Alert} from "@mui/material";
import { FormRow } from "../../components";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { displayAlert, clearAlert } from "../../features/auth/authSlice";

interface IDrawer {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (active: boolean) => void;
  setIsMember: (member: boolean) => void;
  isMember: boolean;
}

interface IValue {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password: string;
  confirm_password?: string;
}
const initialState: IValue = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm_password: "",
};

function SetupUserDrawer(props: IDrawer) {
  const { isDrawerOpen, setIsDrawerOpen, setIsMember, isMember } = props;
  const { isLoading, showAlert, alertText, alertType } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  const clearValue = () => {
    setTimeout(() => {
      dispatch(clearAlert());
    }, 4000);
  };

  const [values, setValues] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    const { username, firstName, lastName, email, password, confirm_password } =
      values;
    if (
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !email ||
      !confirm_password
    ) {
      dispatch(
        displayAlert({
          alertType: "error",
          alertText: "Please provide all value",
        })
      );
      clearValue()
      return;
    }
  };

  useEffect(() => {
    dispatch(clearAlert())
  }, []);

  return (
    <>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
      >
        <Box p={2} width="420px" textAlign="center" role="presentation">
          <Typography variant="h6" component="div" className="p-5">
            <h3 className="text-left text-[27px] mt-1 font-bold mb-3 text-[#1D4469]">
              {isMember ? "Sign In" : "Sign Up"}
            </h3>

            {showAlert && (
              <Alert severity="error" sx={{fontSize:"11.8px",alignItems:"center"}}>{alertText}</Alert>
            )}

            <FormRow type="text" name="username" value="" />

            {!isMember && <FormRow type="text" name="firstname" value="" />}
            {!isMember && <FormRow type="text" name="lastname" value="" />}
            {!isMember && <FormRow type="text" name="email" value="" />}

            <FormRow type="password" name="password" value="" />

            {!isMember && (
              <FormRow
                type="password"
                name="confirm_password"
                labelText="confirm password"
                value=""
              />
            )}

            {!isMember && (
              <div className="flex items-center">
                <input
                  id="link-checkbox"
                  type="checkbox"
                  value=""
                  className="w-[13px] h-[13px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#fff] dark:focus:ring-[#2CB1BC] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="link-checkbox"
                  className="ms-2 text-[11.5px] font-medium text-gray-900 dark:text-gray-300"
                >
                  I agree with the{" "}
                  <a
                    href="#"
                    className="text-[#3173B1] dark:text-[#3173B1] hover:underline"
                  >
                    terms and conditions
                  </a>
                </label>
              </div>
            )}

            {isMember && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    id="link-checkbox"
                    type="checkbox"
                    value=""
                    className="w-[13px] h-[13px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#ffffff00] dark:focus:ring-[#2CB1BC] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="link-checkbox"
                    className="ms-2 text-[11.5px] font-medium text-gray-900 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <div className="flex items-center">
                  <div className="ms-2 text-[11.5px] text-[#3173B1] font-bold">
                    Forget Password ?
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                onSubmit();
              }}
              className="btn btn-primary text-[16px]"
            >
              Sign In
            </button>
            <div className="flex mt-5 justify-end pr-2">
              <p className="text-[12px] text-[#333]">
                {isMember ? "Not a member yet?" : "Already a member?"}
              </p>
              <div
                className="text-[12px] ml-2 text-[#3173B1] bg-none cursor-pointer"
                onClick={() => {
                  setIsMember(!isMember);
                }}
              >
                {isMember ? "SignUp" : "SignIn"}
              </div>
            </div>
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}

export default SetupUserDrawer;
