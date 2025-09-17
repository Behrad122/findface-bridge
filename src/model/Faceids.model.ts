export interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface FaceDetect {
  detectId: string;
  bbox: BoundingBox;
  detectionScore: number;
  lowQuality: boolean;
}

export interface FaceVerify {
  faceObjects: { [key: string]: number };
  averageConf: number;
}

export interface Face {
  faceId: string;
  fileName: string;
  thumbnail: string;
  src: string;
}

export interface HumanCardDto {
  name: string;
}

export interface HumanCardRow {
  id: string;
  name: string;
}

export interface Attachment {
  fileId: string;
  fileName: string;
  mimeType: string;
}

export interface DetectFaceRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: DetectFaceData;
}

export interface DetectFaceData {
  imageBase64: string;
  imageName: string;
}

export interface DetectLicensePlateRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: DetectLicensePlateData;
}

export interface DetectLicensePlateData {
  imageBase64: string;
  imageName: string;
}

export interface VerifyFaceRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: VerifyFaceData;
}

export interface VerifyFaceData {
  cardId: string;
  detectionId: string;
}

export interface CreateFaceRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: CreateFaceData;
}

export interface CreateFaceData {
  cardId: string;
  imageBase64: string;
  imageName: string;
}

export interface ListFaceRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: ListFaceData;
}

export interface ListFaceData {
  cardId: string;
}

export interface RemoveFaceRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: RemoveFaceData;
}

export interface RemoveFaceData {
  faceId: string;
}

export interface FindByDetectionRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: FindByDetectionData;
}

export interface FindByDetectionData {
  detectionId: string;
}

export interface FindByCardIdRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: FindByCardIdData;
}

export interface FindByCardIdData {
  cardId: string;
}

export interface CreateHumanCardRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: HumanCardDto;
}

export interface UpdateHumanCardRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: UpdateHumanCardData;
}

export interface UpdateHumanCardData {
  id: number;
  dto: HumanCardDto;
}

export interface AddHumanCardAttachmentRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: AddHumanCardAttachmentData;
}

export interface AddHumanCardAttachmentData {
  id: number;
  imageBase64: string;
  imageName: string;
}

export interface RemoveFace {}

export interface EventFaceRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: EventFaceData;
}

export interface EventFaceData {
  imageBase64: string;
  imageName: string;
}

export interface EventFaceByCardIdData {
  cardId: string;
}

export interface EventFaceByCardIdRequest {
  serviceName: string;
  clientId: string;
  userId: string;
  requestId: string;
  data: EventFaceByCardIdData;
}
