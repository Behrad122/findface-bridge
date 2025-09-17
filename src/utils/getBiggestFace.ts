export interface IBbox {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

interface IDrawingFaces {
    bbox: IBbox;
}

const compareFaces = <T extends IDrawingFaces>(aFace: T, bFace?: T): T => {
    if (!bFace) {
        return aFace;
    }
    const a = aFace.bbox;
    const b = bFace.bbox;

    const aw = Math.abs(a.right - a.left);
    const ah = Math.abs(a.bottom - a.top);
    const bw = Math.abs(b.right - b.left);
    const bh = Math.abs(b.bottom - b.top);

    if (aw + ah > bw + bh) {
        return aFace;
    }
    return bFace;
};

export const getBiggestFace = <T extends IDrawingFaces = IDrawingFaces>(faces: T[]): T | null => {
    if (!faces.length) {
        return null;
    }
    return faces.reduce(compareFaces);
};

export default getBiggestFace;
