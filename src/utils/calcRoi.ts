import { IBbox } from "./getBiggestFace";

const BORDER_RATIO = 0.01;

export const calcRoi = (height: number, width: number): IBbox => {
  const left = Math.floor(width * BORDER_RATIO);
  const top = Math.floor(height * BORDER_RATIO);
  const roiWidth = Math.ceil(width * (1 - 2 * BORDER_RATIO));
  const roiHeight = Math.ceil(height * (1 - 2 * BORDER_RATIO));
  return {
    left,
    top,
    right: left + roiWidth,
    bottom: top + roiHeight
  };
};

export default calcRoi;
