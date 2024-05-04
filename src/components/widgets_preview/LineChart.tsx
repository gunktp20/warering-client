import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface IProp {
  label: string;
  min: number;
  max: number;
}

function calculatePercentage(percent: number, baseNumber: number) {
  const result = (percent / 100) * baseNumber;
  console.log(`${percent}% of ${baseNumber} is ${result}`);
  return result;
}

function LineChartPreview({ label, min, max }: IProp) {
  const data = {
    labels: ["5", "15", "20", "21", "22", "25", "26"],
    datasets: [
      {
        label: "Sales of the Week",
        data: [
          calculatePercentage(5, max),
          calculatePercentage(21, max),
          calculatePercentage(42, max),
          calculatePercentage(23,max),
          calculatePercentage(24,max),
          calculatePercentage(25,max),
          calculatePercentage(40,max),
        ],
        //  Data Y
        backgroundColor: "#1966fb",
        borderColor: "#00000013",
        border: "1px",
        pointBorderColor: "#1966fb",
        fill: true,
        tension: 0.4,
        borderWidth: 1.8,
      },
    ],
  };

  const options = {
    legend: true,
    scales: {
      y: {
        min: Math.floor(min),
        max: Math.floor(max),
      },
    },
  };

  return (
    <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center ">
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
        {label}
      </div>
      <div className="flex h-[100%] ">
        <Line data={data} options={options} className="flex flex-grow"></Line>
      </div>
    </div>
  );
}

export default LineChartPreview;
