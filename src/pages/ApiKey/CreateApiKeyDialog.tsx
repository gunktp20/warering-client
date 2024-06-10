import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormRow, SnackBar } from "../../components";
import { Alert } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAlert from "../../hooks/useAlert";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import moment from "moment";
import { BsFiletypeJson } from "react-icons/bs";
import Tooltip from "../../components/ToolTip";
import useTimeout from "../../hooks/useTimeout";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  isCreateApiKeyOpen: boolean;
  setIsCreateApiKeyOpen: (active: boolean) => void;
  callBackAddSuccess: () => void
}

interface IValues {
  name: string,
  description: string,
  expireIn: Date | string
}

interface IApiKey {
  name: string,
  description: string,
  expiresIn: string
  key: string
}

const initialState = { name: "", description: "", expireIn: "" }

export default function CreateApiKeyDialog({ isCreateApiKeyOpen, setIsCreateApiKeyOpen, callBackAddSuccess }: IProps) {
  const axiosPrivate = useAxiosPrivate()
  const [values, setValues] = useState<IValues>(initialState)
  const [apiKeyInfo, setApiKeyInfo] = useState<IApiKey>({ name: "", description: "", expiresIn: "", key: "" })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { showAlert, alertText, alertType, displayAlert } = useAlert()
  const [createdSuccess, setCreatedSuccess] = useState<boolean>(false)

  const exportJsonFile = async () => {
    try {
      const link = document.createElement("a")
      const blob = new Blob([JSON.stringify(apiKeyInfo)], { type: "text/json" });
      link.download = `${apiKeyInfo?.name}_${Date.now()}.json`;
      link.href = URL.createObjectURL(blob)
      document.body.appendChild(link)
      link.click();
      document.body.removeChild(link);
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err)
      displayAlert({ msg, type: "error" })
    }
  }

  const { callHandler: callExportJsonFile } = useTimeout({ executeAction: exportJsonFile, duration: 1000 })

  const createApiKey = async () => {
    const currentDate = new Date()
    const expireDate = new Date(values.expireIn)
    const differenceInMillis = expireDate.getTime() - currentDate.getTime();

    setIsLoading(true)
    try {
      const { data } = await axiosPrivate.post("/api-key", { ...values, expireInSeconds: differenceInMillis })
      setIsLoading(false)
      callBackAddSuccess()
      displayAlert({ msg: "Your API key was created", type: "success" })
      const { name, description, key, expiresIn } = data
      const fomattedExpireDate =
        moment(expiresIn).add(543, "year").format("DD/MM/YYYY h:mm")
      setApiKeyInfo({ name, description, key, expiresIn: fomattedExpireDate })
      setCreatedSuccess(true)
      return
    } catch (err) {
      console.log(err)
      const msg = await getAxiosErrorMessage(err)
      displayAlert({ msg, type: "error" })
    }
  }

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    setValues(initialState)
    setApiKeyInfo({ name: "", description: "", expiresIn: "", key: "" })
    setCreatedSuccess(false)
    setIsCreateApiKeyOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  function isDateTodayOrFuture(inputDate: string | Date): boolean {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dateToCheck;
    if (typeof inputDate === 'string') {
      dateToCheck = new Date(inputDate);
    } else if (inputDate instanceof Date) {
      dateToCheck = inputDate;
    } else {
      throw new Error("Invalid date format. Please provide a string (YYYY-MM-DD) or a Date object.");
    }

    return dateToCheck >= today;
  }

  const onSubmit = async () => {
    const { name, description, expireIn } = values
    if (!name || !description || !expireIn) {
      displayAlert({ msg: "Please provide all value", type: "error" })
      return
    }
    const isItEarlierThanToDay = await !isDateTodayOrFuture(expireIn)
    if (isItEarlierThanToDay) {
      displayAlert({ msg: "The expiration date must be from today onwards ", type: "error" })
      return
    }
    await createApiKey()
  }


  return (
    <React.Fragment>
      <Dialog
        open={isCreateApiKeyOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        id="confirm-delete-device-dialog"
      >
        <DialogContentText
          id="confirm-delete-device-dialog-content"
          className="py-7 px-11"
          component={"div"}
          variant={"body2"}
        >


          <div className=" w-[100%] flex flex-col">
            <div className="text-[18px] font-bold text-[#1D4469]" id="edit-dashboard-title">
              {createdSuccess ? "Api Key" : "Create Api Key"}
            </div>
            <div className="text-sm text-[#a4a4a4] mt-3">
              This content will only be shown to you once.
            </div>
          </div>

          {createdSuccess && <div className="w-[100%] text-sm p-5 bg-[#eeeeee] text-[#7a7a7a] shadow-sm mt-7">
            <JsonView
              data={apiKeyInfo}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            />
          </div>}

          {showAlert && alertType && (
            <div className="hidden sm:block">
              <Alert
                severity={alertType}
                sx={{
                  fontSize: "11.8px",
                  alignItems: "center",
                  marginTop: "2rem",
                }}
                id="add-device-alert"
              >
                {alertText}
              </Alert>
            </div>
          )}
          {!createdSuccess && <div className="w-[100%] mt-7">
            <FormRow
              type="text"
              name="name"
              labelText="name"
              value={values.name}
              handleChange={handleChange}
              marginTop="mt-[0.5rem]"
            // placeHolderSize="12px"
            />
          </div>}
          {!createdSuccess && <div className="w-[100%]">
            <FormRow
              type="text"
              name="description"
              labelText="description"
              value={values.description}
              handleChange={handleChange}
              marginTop="mt-[2rem]"
            // placeHolderSize="12px"
            />
          </div>}
          {!createdSuccess && <div className="w-[100%]">
            <FormRow
              type="date"
              name="expireIn"
              labelText="expireInSeconds"
              value={values.expireIn}
              handleChange={handleChange}
              marginTop="mt-[2rem]"
            // placeHolderSize="12px"
            />
          </div>}

          {!createdSuccess && <div className="w-[450px] sm:w-[100%] flex gap-3">
            <button
              id="submit-edit-dashboard-btn"
              onClick={handleClose}
              className="flex border-red-500 border-[1px] mt-[1.5rem] hover:bg-red-500 hover:text-white justify-center items-center transition-all disabled:bg-primary-100 text-red-500 rounded-md w-[100%] h-[42px]"
            >
              cancel
            </button>
            <button
              id="submit-edit-dashboard-btn"
              onClick={onSubmit}
              className="flex bg-[#1966fb] mt-[1.5rem] hover:bg-[#10269C] justify-center items-center transition-all disabled:bg-primary-100 text-white rounded-md w-[100%] h-[42px]"
            >
              {isLoading ? <div className="loader"></div> : "Save"}
            </button>

          </div>
          }
          {createdSuccess && <div className="mt-7 mb-3 text-[#1D4469] font-semibold text-[13.5px]">Format for downloading</div>}
          <div className="bg-gray-300 w-[100%] h-[1px]"></div>
          {createdSuccess &&

            <div className="mt-3 flex flex-col justify-center items-start cursor-pointer text-nowrap" onClick={callExportJsonFile} id="json-download">
              <Tooltip text="Download API key information in JSON format">
                <div className="flex justify-center items-center flex-col rounded-md border-[#1d4469] w-[75px] h-[75px] hover:border-[1px] ">
                  <BsFiletypeJson className="text-[#1d4469] text-[25px]" />
                  <div className="text-[13px] mt-2 text-[#1d4469] font-bold text-nowrap">
                    JSON
                  </div>
                </div>
              </Tooltip>
            </div>

          }

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
        </DialogContentText>
      </Dialog>
    </React.Fragment >
  );
}
