// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { RxDotsHorizontal } from "react-icons/rx";
import React, { memo, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ILineChartDashboardProp } from "../../types/widget_dashboard";
import ConfirmDelete from "./ConfirmDeleteWidget";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function LineChart({
  label,
  payload,
  keys,
  colors,
  widgetId,
  min,
  max,
  fetchAllWidgets,
  selectWidget,
  dashboardId,
  onDeleteSuccess,
  id,
}: ILineChartDashboardProp) {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [timeStamps, setTimeStamps] = useState<string[]>([]);
  id
  function getCurrentTime() {
    const now = new Date();

    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    const timeString = `${formattedMinutes}:${formattedSeconds}`;

    return timeString;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [values1, setValues1] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [values2, setValues2] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [values3, setValues3] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [values4, setValues4] = useState<any[]>([])

  function setOpacity50(color: string): string {
    // Helper function to convert hex to RGB
    const hexToRgb = (hex: string) => {
      // Remove hash if present
      hex = hex.replace(/^#/, '');

      // If short form (#RGB), convert to long form (#RRGGBB)
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }

      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      return { r, g, b };
    };

    // Check if the color is in hex format
    if (color.startsWith("#")) {
      const { r, g, b } = hexToRgb(color);
      return `rgba(${r}, ${g}, ${b}, 0.5)`;
    } else if (color.startsWith("rgb")) {
      // Extract the numbers from rgb or rgba string
      const values = color.match(/\d+/g);
      if (values && values.length >= 3) {
        const [r, g, b] = values;
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
      }
    }

    throw new Error("Invalid color format. Please use hex (#RRGGBB) or rgb(r, g, b).");

  }

  const dataSet1 = {
    label: keys[0],
    data: values1,
    backgroundColor: colors[0],
    borderColor: setOpacity50(colors[0]),
    pointBorderColor: colors[0],
    fill: true,
    tension: 0.4,
    borderWidth: 1.5,
    yAxisID: 'y1'
  }

  const dataSet2 = keys[1] ? {
    label: keys[1],
    data: values2,
    backgroundColor: colors[1],
    borderColor: setOpacity50(colors[1]),
    pointBorderColor: colors[1],
    fill: true,
    tension: 0.4,
    borderWidth: 1.5,
    yAxisID: 'y2'
  } : undefined

  const dataSet3 = keys[2] ?
    {
      label: keys[2],
      data: values3,
      backgroundColor: colors[2],
      borderColor: setOpacity50(colors[2]),
      pointBorderColor: colors[2],
      fill: false,
      tension: 0.4,
      borderWidth: 1.5,
      yAxisID: 'y3'
    } : undefined

  const dataSet4 = keys[3] ? {
    label: keys[3],
    data: values4,
    backgroundColor: colors[3],
    borderColor: setOpacity50(colors[3]),
    pointBorderColor: colors[3],
    fill: true,
    tension: 0.4,
    borderWidth: 1.5,
    yAxisID: 'y4'
  } : undefined
  const datasets = [dataSet1, dataSet2, dataSet3, dataSet4]
  const filteredDatasets = datasets.filter((set) => set !== undefined)

  const data = {
    labels: [...timeStamps],
    datasets: filteredDatasets,
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      duration: 1,
    },
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 9.6,
          },
        },
      },
      y1: {
        type: 'linear', // Ensure linear scale
        position: 'left',
        min: Math.floor(min),
        max: Math.floor(max),
        ticks: {
          font: {
            size: 9.6,
          },
        },
      },
      y2: {
        type: 'linear', // Ensure linear scale
        position: 'right',
        min: Math.floor(min),
        max: Math.floor(max),
        ticks: {
          font: {
            size: 9.6,
          },
        },
        grid: {
          drawOnChartArea: false, // Avoid grid overlap
        },
      },
      y3: {
        type: 'linear', // Ensure linear scale
        // position: 'right',
        min: Math.floor(min),
        max: Math.floor(max),
        ticks: {
          font: {
            size: 9.6,
          },
        },
        grid: {
          drawOnChartArea: false, // Avoid grid overlap
        },
        display: false
      },
      y4: {
        type: 'linear', // Ensure linear scale
        // position: 'right',
        min: Math.floor(min),
        max: Math.floor(max),
        ticks: {
          font: {
            size: 9.6,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        display: false
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pushPayload = (payload: any) => {
    if (!payload) {
      return;
    }
    if (payload[keys[0]]) {
      setValues1((prevValues) => {
        const newValues = [...prevValues];

        if (newValues.length === 30) {
          newValues.shift();
        }

        newValues.push(payload[keys[0]]);
        return newValues;
      });
    }
    if (payload[keys[1]]) {
      setValues2((prevValues) => {
        const newValues = [...prevValues];

        if (newValues.length === 30) {
          newValues.shift();
        }

        newValues.push(payload[keys[1]]);
        return newValues;
      });
    }
    if (payload[keys[2]]) {
      setValues3((prevValues) => {
        const newValues = [...prevValues];

        if (newValues.length === 30) {
          newValues.shift();
        }

        newValues.push(payload[keys[2]]);
        return newValues;
      });
    }
    if (payload[keys[3]]) {
      setValues4((prevValues) => {
        const newValues = [...prevValues];

        if (newValues.length === 30) {
          newValues.shift();
        }

        newValues.push(payload[keys[3]]);
        return newValues;
      });
    }

    setTimeStamps((prevStamps) => {
      const newStamp = [...prevStamps];

      if (newStamp.length === 30) {
        newStamp.shift();
      }
      newStamp.push(getCurrentTime());
      return newStamp;
    });
  }

  React.useEffect(() => {
    pushPayload(payload);
  }, [payload]);

  console.log('Line Chart redered')

  return (
    <div
      id={id ? id : widgetId} className="z-[2] bg-white rounded-md w-[100%] relative pb-[2rem] transition-all h-[430px] px-5 flex justify-center items-center"
    >
      <div className="absolute left-2 top-2 text-[#1d4469] text-[12px]">
        {label}
      </div>
      <div
        onClick={() => {
          setIsOptionOpen(!isOptionOpen);
        }}
        id={`${widgetId}-line-chart-dashboard-options`}
        className="absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
      >
        <RxDotsHorizontal />
      </div>
      <div className="w-[90%] h-[100%] flex justify-center items-center">
        <div className="flex w-[100%] mt-10 justify-center items-center relative h-[350px]">
          <Line data={data} options={options} />
        </div>
      </div>
      {isOptionOpen && (
        <div className="bg-white flex flex-col absolute top-6 right-2 border-[1px] rounded-md shadow-sm">
          <button
            onClick={() => {
              selectWidget(widgetId);
              setIsOptionOpen(false);
            }}
            className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
            }}
            className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]"
          >
            Delete
          </button>
        </div>
      )}
      <ConfirmDelete
        widgetId={widgetId}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        fetchAllWidgets={fetchAllWidgets}
        dashboardId={dashboardId}
        onDeleteSuccess={onDeleteSuccess}
      />
    </div>
  );
}

export default memo(LineChart);
