import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { useState } from "react";
import { IToggleSwitchPreviewProp } from "../../types/widget_preview";

function ToggleSwitchPreview({ label }: IToggleSwitchPreviewProp) {
  const [isActive, setIsActive] = useState<boolean>(true);

  return (
    <div id="toggle-switch-preview" className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center ">
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
        {label}
      </div>
      <SwitchMui
        setIsActive={setIsActive}
        isActive={isActive}
        checked={isActive}
      />
    </div>
  );
}

interface IProp extends SwitchProps {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

const SwitchMui = styled((props: IProp) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 70,
  height: 30,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 4,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(37px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#1966fb" : "#1966fb",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 23,
    height: 23,
  },
  "& .MuiSwitch-track": {
    borderRadius: 30 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default ToggleSwitchPreview;
