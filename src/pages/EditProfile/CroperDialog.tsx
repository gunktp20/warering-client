import React, { useCallback, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import ImageCropper from "./ImageCropper";
import FileDropZone from "./FileDropZone";
import AppSlider from "./AppSlider";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import { setProfileImg } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import useAlert from "../../hooks/useAlert";
import { SnackBar } from "../../components";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IDrawer {
  isCroperDialogOpen: boolean;
  setIsCroperDialogOpen: (status: boolean) => void;
  getUserInfo: () => Promise<void>;
  onUploadProfileImageSuccess: () => void;
}

export default function CroperDialog({
  isCroperDialogOpen,
  setIsCroperDialogOpen,
  getUserInfo,
  onUploadProfileImageSuccess,
}: IDrawer) {
  const [remoteImage, setRemoteImage] = useState("");
  const [localImage, setLocalImage] = useState("");
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<Blob>();
  const dispatch = useAppDispatch();
  const { displayAlert, showAlert, alertText, alertType } = useAlert()

  const isImageSelected = remoteImage || localImage ? true : false;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setRemoteImage("");
    setLocalImage(URL.createObjectURL(acceptedFiles[0]));
  }, []);

  const handleOnZoom = useCallback((zoomValue: number) => {
    setZoom(zoomValue);
  }, []);

  const axiosPrivate = useAxiosPrivate();

  const uploadImage = async () => {
    if (!croppedImage) return;

    const formData = new FormData();
    const name = `${Date.now()}_wallpaper.png`;
    formData.append("file", croppedImage, name);

    try {
      const { data } = await axiosPrivate.put("/users/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(setProfileImg(data?.profileUrl));
      await getUserInfo();
      handleClose();
      return onUploadProfileImageSuccess();
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      displayAlert({ msg, type: "error" })
    }
  };

  const handleClose = () => {
    setZoom(1);
    setIsCroperDialogOpen(false);
    setRemoteImage("");
    setLocalImage("");
  };

  return (
    <Dialog
      open={isCroperDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      id="cropper-image-dialog"
    >
      <DialogContent>
        <DialogContentText
          id="cropper-image-dialog-content"
          className="p-3 "
          component={"div"}
          variant={"body2"}
        >

          <div className=" w-[100%] relative flex flex-col">
            <div
              id="cropper-image-title"
              className="text-[18px] mb-2 font-bold text-[#1D4469]"
            >
              <div id="choose-profile-picture-title">Choose profile picture</div>
            </div>
            {isImageSelected && <div className="text-sm text-[#a4a4a4] mt-3 w-[700px]"></div>}
            {!isImageSelected && <div className="w-[100%] mt-5 mb-5">
              <FileDropZone onDrop={onDrop} />
            </div>}
            {isImageSelected && <div className="h-screen p-4 flex-1 flex items-center justify-center ">
              <ImageCropper
                zoom={zoom}
                onZoomChange={handleOnZoom}
                rotation={0}
                source={remoteImage || localImage}
                onCrop={setCroppedImage}
                width={250}
                height={250}
                id="image-cropper"
              />
            </div>}
            {isImageSelected && <AppSlider
              id="zoom-slider"
              min={1}
              max={3}
              value={zoom}
              label="Zoom"
              defaultValue={1}
              onChange={handleOnZoom}
            />}
            <div className="flex justify-end">
              <div className="flex gap-2">
                <button
                  className="text-primary-500 px-5 "
                  onClick={handleClose}
                  id="cancel-crop-profile-picture-btn"
                >
                  cancel
                </button>
                <button
                  onClick={() => {
                    uploadImage();
                  }}
                  id="save-crop-profile-picture-btn"
                  className="border-[1px] border-primary-500 w-[140px] rounded-md h-[34px] bg-primary-500 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {showAlert && (
            <div id="cropper-dialog-snackbar-ele" className="block sm:hidden">
              <SnackBar
                id="cropper-dialog-snackbar"
                severity={alertType}
                showSnackBar={showAlert}
                snackBarText={alertText}
              />
            </div>
          )}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
