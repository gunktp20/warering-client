import React, { FunctionComponent, useState } from "react";
import { TbEye, TbEyeOff } from "react-icons/tb";

interface IFormRow {
  id?: string;
  type: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labelText?: string;
  width?: string;
  marginTop?: string;
  placeHolderSize?: string
}

const FormRow: FunctionComponent<IFormRow> = ({
  id,
  type,
  name,
  value,
  handleChange,
  labelText,
  width,
  marginTop,
  placeHolderSize,
}: IFormRow): JSX.Element => {
  const [hide, setHide] = useState<boolean>(true);

  return (
    <div
      className={`relative z-0 w-[${width ? width : "100%"}] mb-5 group ${marginTop ? marginTop : " mt-7"
        }`}
    >
      <input
        onChange={handleChange}
        type={
          type === "password" && hide
            ? "password"
            : type === "number"
              ? "number"
              : type === "date" ? "date" : "text"


        }
        name={name}
        id={id ? id : name}
        className={`block py-2.5 px-0 w-full text-[13.5px] text-gray-900 bg-transparent border-0 border-b-[1.6px] border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-second peer`}
        placeholder=" "
        required
        value={value}
      />
      <label
        htmlFor={name}
        className={`${placeHolderSize ? `text-[${placeHolderSize}] ` : "text-[12.8px] "} left-0 absolute  text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-second peer-focus:dark:text-second peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 capitalize`}
      >
        {labelText ? labelText : name}
      </label>
      {type == "password" && hide && (
        <TbEyeOff
          className="text-[#00000067] cursor-pointer absolute top-[12px] right-[5px]"
          onClick={() => setHide(false)}
        />
      )}
      {type == "password" && !hide && (
        <TbEye
          className="text-[#00000067] cursor-pointer absolute top-[12px] right-[5px]"
          onClick={() => setHide(true)}
        />
      )}
    </div>
  );
};

export default FormRow;
