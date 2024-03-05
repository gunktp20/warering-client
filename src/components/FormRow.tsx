import React, { FunctionComponent, useState } from "react";
import { TbEye, TbEyeOff } from "react-icons/tb";

interface IFormRow {
  type: string;
  name: string;
  value?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labelText?: string;
  width?: string
  marginTop?: string
}

const FormRow: FunctionComponent<IFormRow> = ({
  type,
  name,
  value,
  handleChange,
  labelText,
  width,
  marginTop
}: IFormRow): JSX.Element => {
  const [hide, setHide] = useState<boolean>(true);

  return (
    <div className={`relative z-0 w-[${width ? width : "100%"}] mb-5 group ${marginTop ? marginTop : " mt-7"}`}>
      <input
        onChange={handleChange}
        type={type === "password" && hide ? "password" : "value"}
        name={name}
        id={name}
        className={`block py-2.5 px-0 w-full text-[13.5px] text-gray-900 bg-transparent border-0 border-b-[1.6px] border-gray-200 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-second focus:outline-none focus:ring-0 focus:border-second peer`}
        placeholder=" "
        required
        value={value}
      />
      <label
        htmlFor={name}
        className="peer-focus:font-medium left-0 absolute text-[12.8px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-second peer-focus:dark:text-second peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 capitalize"
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
