import { Fade } from "react-awesome-reveal";

function Introduction() {
  return (
    <div className="intro-section-1 text-[35px] flex w-[100%] justify-center mt-[5rem] h-[450px]">
      <div className="flex flex-col w-[60%] justify-center items-center">
        <Fade direction="down">
          <div className="welcome text-[#fff] text-[38px] mb-5">
            Welcome to Warering IOT Platform
          </div>
        </Fade>
        <Fade direction="up">
          <div className="platform-intro text-[13.5px] text-[#ffffffd0]">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem
            perspiciatis sint sit, omnis inventore magni! Ex magnam aut
            exercitationem, nam magni at, iusto placeat nostrum vitae, ratione
            in dignissimos impedit sapiente! Asperiores at autem veritatis?
          </div>
        </Fade>
      </div>
    </div>
  );
}

export default Introduction;
