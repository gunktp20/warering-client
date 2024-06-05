import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface Props {
  id: string;
  label?: string;
  value: number;
  min: number;
  max: number;
  defaultValue: number;
  onChange(value: number): void;
}

export default function AppSlider({
  id,
  value,
  defaultValue,
  max,
  min,
  onChange,
}: Props) {
  const handleChange = (value: number | number[]) => {
    onChange(value as number);
  };
  return (
    <div id={id}>
      <div className="w-[100%] flex justify-between text-[20px] text-nowrap cursor-default">
        <div id={`${id}-decrease-slider`}>-</div>
        <div id={`${id}-increase-slider`}>+</div>
      </div>
      <div className="p-2 pt-0">
        <Slider
          onChange={handleChange}
          min={min}
          max={max}
          defaultValue={defaultValue}
          value={value}
          step={0.01}
        />
      </div>
    </div>
  );
}
