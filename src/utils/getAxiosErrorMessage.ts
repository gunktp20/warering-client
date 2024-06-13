import { AxiosError } from "axios";

const getAxiosErrorMessage = async (err: unknown) => {
  if (err instanceof AxiosError) {
    const msg =
      typeof err?.response?.data?.response?.message === "object"
        ? err?.response?.data?.response?.message[0]
        : err?.response?.data?.response?.message;
    if (msg === "" || msg === undefined || msg === null) {
      return "Some thing went wrong . Please try again later";
    }
    return msg;
  }
  return "Some thing went wrong . Please try again later";
};

export default getAxiosErrorMessage;
