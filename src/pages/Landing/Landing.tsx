import { useState } from "react";
import { BigNavbar, Introduction, WeDoItem, Footer, SetupUserDrawer , SmallNavbar} from ".";
import Wrapper from "../../assets/wrappers/Landing/Landing";
import whatWeDo from "../../utils/whatWeDo";

function Landing() {

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(true);

  return (
    <Wrapper>
      <BigNavbar setIsMember={setIsMember} setIsDrawerOpen={setIsDrawerOpen} />
      <SmallNavbar/>
      <SetupUserDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        setIsMember={setIsMember}
        isMember={isMember}
      />
      <Introduction />
      <div className="w-[100%] justify-center mt-[4.5rem] mb-[4.5rem] flex">
        <div className="w-[75%] flex justify-between items-center gap-5 bg-white lg:flex-col md:flex-col sm:flex-col">
          {whatWeDo.length > 0
           &&
            whatWeDo.map((item) => {
              return (
                  <WeDoItem
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
