import { IBbox } from "./getBiggestFace";

export const checkRoi = (rect: IBbox, roi: IBbox) => {

    const rectLeft = rect.left;
    const rectTop = rect.top;
    const rectRight = rect.right;
    const rectBottom = rect.bottom;

    const roiLeft = roi.left;
    const roiTop = roi.top;
    const roiRight = roi.right;
    const roiBottom = roi.bottom;

    return (
        rectLeft >= roiLeft &&
        rectTop >= roiTop &&
        rectRight <= roiRight &&
        rectBottom <= roiBottom
    );
}

export default checkRoi;
