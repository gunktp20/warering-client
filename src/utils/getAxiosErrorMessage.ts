import { AxiosError } from "axios";

const getAxiosErrorMessage = async (err: unknown) => {
  console.log("getAxiosErrorMessage",err)
  if (err instanceof AxiosError) {
    const msg =
      typeof err?.response?.data?.response?.message === "object"
        ? err?.response?.data?.response?.message[0]
        : err?.response?.data?.response?.message;
    return msg;
  }
  return "Some thing went wrong . Please try again";
};

export default getAxiosErrorMessage;
