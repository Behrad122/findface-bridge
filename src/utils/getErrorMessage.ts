import { getErrorMessage as getErrorMessageBase } from "functools-kit";

export const getErrorMessage = (error: any) => {
  const message = getErrorMessageBase(error);
  if (process.env.NODE_ENV !== "development" && false) {
    console.log(message);
    return "stdout";
  }
  return message;
}

export default getErrorMessage;
