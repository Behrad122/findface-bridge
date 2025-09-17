import {
  getMomentStamp as getMomentStampBase,
  getTimeStamp as getTimeStampBase,
} from "get-moment-stamp";

export const getMomentStamp = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return getMomentStampBase(today);
};

export const getTimeStamp = (): number => {
  const today = new Date();
  return getTimeStampBase(today);
};
