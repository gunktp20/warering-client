import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FaCopy } from "react-icons/fa";
import copy from "copy-to-clipboard";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  topics: string[];
  isTopicsDialogShow: boolean;
  setTopicsDialogShow: (active: boolean) => void;
}

export default function TopicsDialog(props: IProps) {
  const handleClose = () => {
    props.setTopicsDialogShow(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.isTopicsDialogShow}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        id="topics-dialog"
      >
        <DialogContentText
          className="py-7 px-11 pb-10"
          component={"div"}
          variant={"body2"}
          id="topics-dialog-content"
        >
          <div>
            <div className="mb-5 text-[#000] font-bold text-[23.6px]" id="topics-title">
              Topics
            </div>
            <div className="flex flex-col mb-6 bg-[#f2f2f2] px-5 py-3 rounded-md">
              <div className="mb-[12px] text-[12.3px] justify-between flex items-center">
                Publish
                <div className="cursor-pointer">
                  <FaCopy
                    id="clipboard-publish-topic"
                    onClick={() => {
                      copy(props.topics[0]);
                    }}
                    className="text-[14.5px]"
                  />
                </div>
              </div>
              <div className="text-[#1b1b1b] flex gap-3 text-[12.3px] z-[10]" id="publish-topic">
                {props.topics[0]}
              </div>
            </div>
            <div className="flex flex-col mb-6 bg-[#f2f2f2] px-5 py-3 rounded-md">
              <div className="mb-[12px] text-[12.3px] justify-between flex items-center ">
                Subscribe
                <div className="cursor-pointer">
                  <FaCopy
                    id="clipboard-subscribe-topic"
                    onClick={() => {
                      copy(props.topics[1]);
                    }}
                    className="text-[14.5px]"
                  />
                </div>
              </div>
              <div className="text-[#1b1b1b] flex gap-3 text-[12.3px]" id="subscribe-topic">
                {props.topics[1]}
              </div>
            </div>
          </div>
        </DialogContentText>
      </Dialog>
    </React.Fragment>
  );
}
