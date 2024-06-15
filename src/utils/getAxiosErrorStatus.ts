import { AxiosError } from "axios";

const getAxiosErrorStatus = async (err: unknown) => {
  if (err instanceof AxiosError) {
    return err?.response?.data?.response?.statusCode;
  }
};

export default getAxiosErrorStatus;
