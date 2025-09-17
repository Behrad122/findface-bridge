export interface ILicensePlaceDetect {
  bbox_top: number;
  bbox_left: number;
  bbox_right: number;
  bbox_bottom: number;
  licensePlate: string;
  country: string;
  category: string;
  body: string;
  make: string;
  model: string;
  color: string;
  orientation: "front" | "back" | "side";
}
