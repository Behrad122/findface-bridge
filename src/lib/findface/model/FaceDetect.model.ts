export interface IFaceDetect {
  detectId: string;
  bbox: { left: number; top: number; right: number; bottom: number };
  features: {
    eyes_attrs: {
      confidence: 1;
      name: "opened" | "closed";
    };
    headpose_pitch: {
      name: number;
      confidence: 1;
    };
    headpose_yaw: {
      name: number;
      confidence: 1;
    }
  };
  detectionScore: number;
  lowQuality: boolean;
}
