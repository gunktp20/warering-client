import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
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
  const sum = Number(max) + Number(min);
  const newValue = Number(value) + Number(min);
  const result = Math.round((100 * newValue) / sum);
  const firstNum = result;
  const secondNum = 100 - result;
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
