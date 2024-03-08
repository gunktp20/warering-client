import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { RxDotsHorizontal } from "react-icons/rx";

export type Id = string | number;

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {};

interface IProp {
  label: string;
  value: number;
  min: number;
  max: number;
}

function GaugePreview({ label, value, min, max }: IProp) {
  // 100 x value / max + min   35
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const sum = Number(max) + Number(min);
  console.log("sum", sum);
  const newValue = Number(value) + Number(min);
  const result = Math.round((100 * newValue) / sum);
  console.log("result = " + Math.round(result));
  const firstNum = result;
  const secondNum = 100 - result;
  console.log("firstNum", firstNum);
  console.log("secondNum", secondNum);
  const data = {
    labels: [],
    datasets: [
      {
        label: "doughnut",
        data: [firstNum, secondNum],
        backgroundColor: ["#1966fb", "#00000045"],
        borderColor: ["#fff", "#fff"],
        circumference: 180,
        rotation: 270,
        borderWidth: 0,
        cutout: "84%",
      },
    ],
  };

  // min = 20
  // 100 x value / max + min   35
  //
  // max = 70
  // 1% = 20
  // 100% = 70

  // value = 10
  return (
    <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2  cursor-grab">
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
        {label}
      </div>
      <div className="w-[100px]">
        <Doughnut data={data} options={options}></Doughnut>
      </div>
      <div className="w-[100px] text-[#1966fb] absolute text-center bottom-7 text-[12.8px]">
        {value}
      </div>
    </div>
  );
}

export default GaugePreview;
