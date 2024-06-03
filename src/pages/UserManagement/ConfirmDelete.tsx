import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
    isDeleteConfirmOpen: boolean,
    setIsDeleteConfirmOpen: (active: boolean) => void
}

export default function ConfirmDelete({ isDeleteConfirmOpen, setIsDeleteConfirmOpen }: IProps) {

    const handleClose = () => {
        setIsDeleteConfirmOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={isDeleteConfirmOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContentText
                    id="confirm-delete-dashboard-dialog"
                    className="py-7 px-11"
                    component={"div"}
                    variant={"body2"}>
                    <div className='text-[#dc3546] text-[15.5px] text-center'>
                        Are you sure you want to delete?
                    </div>
                    <div className='mt-4 flex justify-center gap-3 w-[100%]'>
                        <button onClick={handleClose} className='text-black text-[12.5px] border-[1px] border-[#000] rounded-sm px-10 py-[0.4rem]'>Cancel</button>
                        <button className='bg-[#dc3546] text-[12.5px] text-white px-10 py-[0.4rem] rounded-sm'>Delete</button>
                    </div>
                </DialogContentText>
            </Dialog>
        </React.Fragment>
    );
}