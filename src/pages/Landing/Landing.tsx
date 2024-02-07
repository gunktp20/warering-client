import { useState } from "react";
import { BigNavbar, Introduction, WeDoItem, Footer, SetupUserDrawer } from ".";
import Wrapper from "../../assets/wrappers/Landing/Landing";
import whatWeDo from "../../utils/whatWeDo";
import { Snackbar, Portal, Alert } from "@mui/material";
import { useAppSelector } from "../../app/hooks";

function Landing() {
  const { isLoading, showAlert, alertText, alertType } = useAppSelector(
    (state) => state.auth
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(true);

  return (
    <Wrapper>
      <BigNavbar setIsMember={setIsMember} setIsDrawerOpen={setIsDrawerOpen} />
      <SetupUserDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        setIsMember={setIsMember}
        isMember={isMember}
      />
      <Portal>
        <Snackbar
          message={alertText}
          autoHideDuration={4000}
          open={showAlert}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={alertType} variant="filled" sx={{ width: "100%" }}>
            {alertText}
          </Alert>
        </Snackbar>
      </Portal>

      <Introduction />
      <div className="bg-white w-[100%] flex justify-center mt-[4.5rem] mb-[4.5rem]">
        <div className="wwd-container bg-red w-[75%] flex justify-between gap-5 ">
          {whatWeDo.length > 0 &&
            whatWeDo.map((item) => {
              return (
                <div>
                  <WeDoItem
                    img={item.img}
                    title={item.title}
                    description={item.description}
                  />
                </div>
              );
            })}
        </div>
      </div>

      <Footer />
    </Wrapper>
  );
}

export default Landing;
