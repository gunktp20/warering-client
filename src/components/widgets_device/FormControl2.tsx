import React, { FunctionComponent, useState } from "react";
import { TbEye, TbEyeOff } from "react-icons/tb";

interface IFormRow {
  setValue: (_: any) => void;
  value?: any;
  labelText?: string;
  width?: string;
  marginTop?: string;
  options: any[];
}

const FormSelect: FunctionComponent<IFormRow> = ({
  setValue,
  value,
  labelText,
  width,
  marginTop,
  options,
}: IFormRow): JSX.Element => {
  const [hide, setHide] = useState<boolean>(true);

  return (
    <div
      className={`relative z-0 w-[${width ? width : "100%"}] mb-5 group ${
        marginTop ? marginTop : " mt-7"
      }`}
    >
      <select
        name="cars"
        id="cars"
        value={value}
        defaultValue=""
        onChange={(event: any) => {
          setValue(event.target.value);
        }}
        className={`block py-2 rounded-md pl-3 px-0 w-full text-[13.5px] text-gray-900 bg-transparent border-[1px] border-black appearance-none dark:focus:border-second focus:outline-none focus:ring-0 focus:border-second peer`}
      >
        {options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
      <label
        className="peer-focus:font-medium left-0 absolute text-[12.8px] text-black duration-300 transform -translate-y-[1.3rem] px-[5px] -translate-x-[-6px] scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-second peer-focus:dark:text-second peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 capitalize bg-white z-[1] "
      >
        {labelText}
      </label>
    </div>
  );
};

export default FormSelect;
