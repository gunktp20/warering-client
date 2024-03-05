import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  isAddDisplayShow: boolean;
  setIsAddDisplayShow: (active: boolean) => void;
}

// const handleChange = (event: SelectChangeEvent<typeof age>) => {
//     setAge(Number(event.target.value) || '');
//   };

export default function AddDisplayDialog(props: IProps) {

  const handleClose = () => {
    props.setIsAddDisplayShow(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.isAddDisplayShow}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContentText
          id="confirm-delete-dashboard-dialog"
          className="w-max"
          component={"div"}
          variant={"body2"}
        >
          {" "}
          <div className="bg-[#1966fb] w-[100%] py-3 text-white text-center text-[17px]">
            Add Display
          </div>
          <div className="flex justify-between w-[100%] px-16 mt-5">
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel
                htmlFor="demo-dialog-native"
                sx={{
                  background: "#fff",
                  fontSize: "15px",
                }}
              >
                Device
              </InputLabel>
              <Select
                native
                //   value={""}
                //   onChange={handleChange}
                sx={{
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                  width: "max-content",
                }}
                input={<OutlinedInput label="Age" id="demo-dialog-native" />}
              >
                <option aria-label="None" value="" />
                <option value={10}>Ten</option>
                <option value={20}>Twenty</option>
                <option value={30}>Thirty</option>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel
                htmlFor="demo-dialog-native"
                sx={{
                  background: "#fff",
                  fontSize: "15px",
                }}
              >
                Widget
              </InputLabel>
              <Select
                native
                //   value={""}
                //   onChange={handleChange}
                sx={{
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                  width: "max-content",
                }}
                input={<OutlinedInput label="Age" id="demo-dialog-native" />}
              >
                <option aria-label="None" value="" />
                <option value={10}>Ten</option>
                <option value={20}>Twenty</option>
                <option value={30}>Thirty</option>
              </Select>
            </FormControl>
          </div>
          <div className="flex justify-between w-[100%] px-16 mt-5 mb-10">
            <button
              onClick={() => {
                handleClose()
              }}
              className="h-[42px] border-[2px] border-[#dc3546] mr-5 w-[200px] rounded-md text-[#dc3546]"
            >
              Cancel
            </button>
            <button
              onClick={() => {}}
              className="h-[42px] w-[200px] bg-[#1966fb] text-white rounded-md"
            >
              Add Display
            </button>
          </div>
        </DialogContentText>
      </Dialog>
    </React.Fragment>
  );
}
