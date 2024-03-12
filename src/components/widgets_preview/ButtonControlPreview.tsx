import { Button } from "@mui/material";

interface IProp {
  label: string;
  button_label: string;
}

function ButtonControlPreview({ label, button_label }: IProp) {
  return (
    <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2">
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
        {label}
      </div>
      <div
        onClick={() => {}}
        className="absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
      ></div>
      <Button
        onClick={() => {
        
        }}
        style={{
          textTransform: "none",
          width: "fit-content",
          height: "39px",
          paddingLeft: "40px",
          paddingRight: "40px",
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
        {button_label ? button_label : "Button Control"}
      </Button>
    </div>
  );
}

export default ButtonControlPreview;
