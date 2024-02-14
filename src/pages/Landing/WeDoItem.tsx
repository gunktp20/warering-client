import { Fade } from "react-awesome-reveal";

interface IProp {
  img: any;
  title: string;
  description: string;
}

function WeDoItem(props: IProp) {
  return (
    <Fade>
      <div className="flex flex-col items-center card-intro w-[320px] justify-between h-100">
        <img src={props.img} className="w-[200px] h-[250px] " />
        <div>
          <p className="text-[20px] mt-5 text-center text-[#1d4469] font-bold">
            {props.title}
          </p>
          <div className="text-[#7a7a7a] text-[14px] text-center mt-2">
            {props.description}
          </div>
        </div>
      </div>
    </Fade>
  );
}

export default WeDoItem;
