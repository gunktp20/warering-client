import { useState } from "react";
import BigNavbar from "./BigNavbar";
import Introduction from "./Introduction";
import WeDoItem from "./WeDoItem";
import Footer from "./Footer";
import SetupUserDrawer from "./SetupUserDrawer";
import SmallNavbar from "./SmallNavbar";
import AlertDialogSlide from "./DialogMui";
import Wrapper from "../../assets/wrappers/Landing/Landing";
import whatWeDo from "../../utils/whatWeDo";
import { useAppSelector } from "../../app/hooks";
import { AccountUserDrawer } from "../../components";

function Landing() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(true);
  const { user } = useAppSelector((state) => state.auth);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] = useState<boolean>(false);
  
  return (
    <Wrapper>
      <AccountUserDrawer
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
      />
      <BigNavbar setIsMember={setIsMember} setIsDrawerOpen={setIsDrawerOpen} isAccountUserDrawerOpen={isAccountUserDrawerOpen} setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}/>
      <SmallNavbar
        setIsMember={setIsMember}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      {!user && (
        <AlertDialogSlide
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          setIsMember={setIsMember}
          isMember={isMember}
        />
      )}
      {!user && (
        <SetupUserDrawer
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          setIsMember={setIsMember}
          isMember={isMember}
        />
      )}
      <Introduction />
      <div className="w-[100%] justify-center pt-[4.5rem] pb-[4.5rem] flex bg-white">
        <div className="w-[75%] flex justify-between items-center gap-5 bg-white lg:flex-col md:flex-col sm:flex-col">
          {whatWeDo.length > 0 &&
            whatWeDo.map((item, index) => {
              return (
                <WeDoItem
                  key={index}
                  img={item.img}
                  title={item.title}
                  description={item.description}
                />
              );
            })}
        </div>
      </div>

      <Footer />
    </Wrapper>
  );
}

export default Landing;
