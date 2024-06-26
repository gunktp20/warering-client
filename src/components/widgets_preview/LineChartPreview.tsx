import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ILineChartPreviewProp } from "../../types/widget_preview";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function calculatePercentage(percent: number, baseNumber: number) {
  const result = (percent / 60) * baseNumber;
  return result;
}

function LineChartPreview({ label }: ILineChartPreviewProp) {
  const min = 0
  const max = 60
  const data = {
    label: "Sales of the Week",
    labels: ["5", "15", "20", "21", "22", "25", "26"],
    datasets: [
      {
        label: "Sales of the Week",
        data: [
          calculatePercentage(5, max),
          calculatePercentage(21, max),
          calculatePercentage(42, max),
          calculatePercentage(23, max),
          calculatePercentage(24, max),
          calculatePercentage(25, max),
          calculatePercentage(40, max),
        ],
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
    plugins: {
      legend: {
        display: false,
      },
    }
  };

  return (
    <div id="line-chart-preview" className="h-[130px] w-[100%] bg-white pt-3 relative rounded-md shadow-md flex justify-center items-center ">
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
        {label}
      </div>
      <div className="flex h-[90%]">
        <Line data={data} options={options} className="flex flex-grow"></Line>
      </div>
    </div>
  );
}

export default LineChartPreview;
