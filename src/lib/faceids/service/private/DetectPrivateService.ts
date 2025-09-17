import { inject } from "../../core/di";
import LoggerService from "../base/LoggerService";
import TokenService from "../base/TokenService";
import TYPES from "../../config/types";
import {
  CC_FACEIDS_EVENT_CAMERA,
  CC_FACEIDS_EVENT_TOKEN,
  CC_FACEIDS_URL,
} from "../../config/params";
import { IFaceDetect } from "../../model/FaceDetect.model";
import IFaceVerify from "../../model/FaceVerify.model";
import IFaceEvent from "../../model/FaceEvent.model";
import { ILicensePlaceDetect } from "../../model/LicensePlateDetect.model";

import { minio } from "../../../minio";
import FacePrivateService from "./FacePrivateService";
import { TContextService } from "../base/ContextService";
import RequestFactory from "../../common/RequestFactory";
import IDetectVerify from "../../model/DetectVerify.model";

const MIN_LICENSE_PLACE_CONFIDENCE = 0.85;

export class DetectPrivateService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);
  protected readonly tokenService = inject<TokenService>(TYPES.tokenService);
  protected readonly contextService = inject<TContextService>(
    TYPES.contextService
  );

  protected readonly facePrivateService = inject<FacePrivateService>(
    TYPES.facePrivateService
  );

  public detectFace = async (imageId: string): Promise<IFaceDetect[]> => {
    this.loggerService.logCtx(`detectPrivateService detectFace`, { imageId });
    const formData = new FormData();
    const data = await minio.imageDataGlobalService.getObject(
      imageId,
      this.contextService.context
    );
    formData.append("photo", data, imageId);
    formData.append("attributes", JSON.stringify({ face: {} }));
    const factory = RequestFactory.makeRequest(
      `detectPrivateService detectFace`,
      `${CC_FACEIDS_URL}/detect/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: formData,
      },
      this.contextService.context
    );
    const response = await factory.fetch();
    const {
      objects: { face = [] },
    } = <any>await response.json();
    return face.map(
      (output: any): IFaceDetect => ({
        bbox: output.bbox,
        detectId: output.id,
        detectionScore: output.detection_score,
        lowQuality: output.low_quality,
        features: output.features,
      })
    );
  };

  public detectFaceByBlob = async (blob: Blob): Promise<IFaceDetect[]> => {
    this.loggerService.logCtx(`detectPrivateService detectFaceByBlob`);
    const formData = new FormData();
    formData.append("photo", blob, "image.png");
    formData.append(
      "attributes",
      JSON.stringify({ face: { eyes_attrs: true, headpose: true } })
    );
    const factory = RequestFactory.makeRequest(
      `detectPrivateService detectFaceByBlob`,
      `${CC_FACEIDS_URL}/detect/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: formData,
      },
      this.contextService.context
    );
    const response = await factory.fetch();
    const {
      objects: { face = [] },
    } = <any>await response.json();
    return face.map(
      (output: any): IFaceDetect => ({
        bbox: output.bbox,
        detectId: output.id,
        detectionScore: output.detection_score,
        features: output.features,
        lowQuality: output.low_quality,
      })
    );
  };

  public verifyFace = async (
    cardId: string,
    detectionId: string
  ): Promise<IFaceVerify | null> => {
    this.loggerService.logCtx(`detectPrivateService verifyFace`, {
      cardId,
      detectionId,
    });
    const url = new URL(`${CC_FACEIDS_URL}/verify/`);
    url.searchParams.set("card_id", String(cardId));
    url.searchParams.set("object1", `detection:${detectionId}`);
    const factory = RequestFactory.makeRequest(
      `detectPrivateService verifyFace`,
      url.toString(),
      {
        method: "GET",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
      },
      this.contextService.context
    );
    const output = await factory.fetchJson();
    return output?.confidence
      ? {
          averageConf: output.confidence.average_conf,
          faceObjects: output.confidence.face_objects,
        }
      : null;
  };

  public verifyDetect = async (
    detectionId1: string,
    detectionId2: string
  ): Promise<IDetectVerify | null> => {
    this.loggerService.logCtx(`detectPrivateService verifyDetect`, {
      detectionId1,
      detectionId2,
    });
    const url = new URL(`${CC_FACEIDS_URL}/verify/`);
    url.searchParams.set("object1", `detection:${detectionId1}`);
    url.searchParams.set("object2", `detection:${detectionId2}`);
    const factory = RequestFactory.makeRequest(
      `detectPrivateService verifyFace`,
      url.toString(),
      {
        method: "GET",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
      },
      this.contextService.context
    );
    const output = await factory.fetchJson();
    if (!output?.confidence) {
      return null;
    }
    return {
      confidence: output.confidence,
    };
  };

  public eventFace = async (imageId: string): Promise<IFaceEvent> => {
    this.loggerService.logCtx(`detectPrivateService eventFace`);
    const data = await minio.imageDataGlobalService.getObject(
      imageId,
      this.contextService.context
    );
    const formData = new FormData();
    {
      formData.append("fullframe", data, imageId);
      formData.append("token", CC_FACEIDS_EVENT_TOKEN);
      formData.append("rotate", "true");
      formData.append("camera", CC_FACEIDS_EVENT_CAMERA);
      formData.append("mf_selector", "biggest");
    }
    const factory = RequestFactory.makeRequest(
      `detectPrivateService eventFace`,
      `${CC_FACEIDS_URL}/events/faces/add/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: formData,
      },
      this.contextService.context
    );
    const response = await factory.fetch();
    const output = <any>await response.json();
    return {
      events: output.events,
    };
  };

  public eventFaceByCardId = async (cardId: string): Promise<IFaceEvent> => {
    this.loggerService.logCtx(`detectPrivateService eventFaceByCardId`);
    const [face = null] = await this.facePrivateService.listFace(cardId);
    if (!face) {
      throw new Error(
        "detectPrivateService eventFaceByCardId no one face found"
      );
    }
    const factory1 = RequestFactory.makeRequest(
      `detectPrivateService eventFaceByCardId thumbnail`,
      face.thumbnail,
      {
        method: "GET",
      },
      this.contextService.context
    );
    const response1 = await factory1.fetch();
    const blob = await response1.blob();
    const formData = new FormData();
    {
      formData.append("fullframe", blob, face.fileName);
      formData.append("token", CC_FACEIDS_EVENT_TOKEN);
      formData.append("rotate", "true");
      formData.append("camera", CC_FACEIDS_EVENT_CAMERA);
      formData.append("mf_selector", "biggest");
    }
    const factory2 = RequestFactory.makeRequest(
      `detectPrivateService eventFaceByCardId face`,
      `${CC_FACEIDS_URL}/events/faces/add/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: formData,
      },
      this.contextService.context
    );
    const response2 = await factory2.fetch();
    const output = <any>await response2.json();
    return {
      events: output.events,
    };
  };

  public detectLicensePlate = async (
    imageId: string
  ): Promise<ILicensePlaceDetect[]> => {
    this.loggerService.logCtx(`detectPrivateService detectLicensePlate`, {
      imageId,
    });
    const imageData = await minio.imageDataGlobalService.getObject(
      imageId,
      this.contextService.context
    );
    const formData = new FormData();
    formData.append("photo", imageData, "image.jpg");
    formData.append(
      "attributes",
      JSON.stringify({
        car: {
          license_plate: true,
          special_vehicle_type: true,
          category: true,
          weight_type: true,
          orientation: true,
          description: true,
        },
      })
    );
    const factory = RequestFactory.makeRequest(
      `detectPrivateService detectLicensePlateByBlob`,
      `${CC_FACEIDS_URL}/detect/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: formData,
      },
      this.contextService.context
    );
    const response = await factory.fetch();
    const data = <any>await response.json();
    const result = [];
    if (!data?.objects?.car) {
      return result;
    }
    for (const {
      features: {
        license_plate_number: {
          bbox,
          name: licensePlate = "",
          confidence = 0,
        } = {},
        license_plate_country: { name: country = "unknown" } = {},
        orientation: { name: orientation = "unknown" } = {},
        category: { name: category = "unknown" } = {},
        body: { name: body = "unknown" } = {},
        make: { name: make = "unknown" } = {},
        model: { name: model = "unknown" } = {},
        color: { name: color = "unknown" } = {},
      },
    } of data.objects.car) {
      if (confidence < MIN_LICENSE_PLACE_CONFIDENCE) {
        continue;
      }
      const bbox_top = bbox?.top ?? 0;
      const bbox_left = bbox?.left ?? 0;
      const bbox_right = bbox?.right ?? 0;
      const bbox_bottom = bbox?.bottom ?? 0;
      if (licensePlate !== "unknown") {
        result.push({
          bbox_top,
          bbox_left,
          bbox_right,
          bbox_bottom,
          licensePlate,
          orientation,
          category,
          country,
          body,
          make,
          model,
          color,
        });
      }
    }
    return result;
  };

  public detectLicensePlateByBlob = async (
    imageFile: Blob
  ): Promise<ILicensePlaceDetect[]> => {
    this.loggerService.logCtx(`detectPrivateService detectLicensePlateByBlob`);
    const formData = new FormData();
    formData.append("photo", imageFile, "image.jpg");
    formData.append(
      "attributes",
      JSON.stringify({
        car: {
          license_plate: true,
          special_vehicle_type: true,
          category: true,
          weight_type: true,
          orientation: true,
          description: true,
        },
      })
    );
    const factory = RequestFactory.makeRequest(
      `detectPrivateService detectLicensePlateByBlob`,
      `${CC_FACEIDS_URL}/detect/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: formData,
      },
      this.contextService.context
    );
    const response = await factory.fetch();
    const data = <any>await response.json();
    const result = [];
    if (!data?.objects?.car) {
      return result;
    }
    for (const {
      features: {
        license_plate_number: {
          bbox,
          name: licensePlate = "",
          confidence = 0,
        } = {},
        license_plate_country: { name: country = "unknown" } = {},
        orientation: { name: orientation = "unknown" } = {},
        category: { name: category = "unknown" } = {},
        body: { name: body = "unknown" } = {},
        make: { name: make = "unknown" } = {},
        model: { name: model = "unknown" } = {},
        color: { name: color = "unknown" } = {},
      },
    } of data.objects.car) {
      if (confidence < MIN_LICENSE_PLACE_CONFIDENCE) {
        continue;
      }
      const bbox_top = bbox?.top ?? 0;
      const bbox_left = bbox?.left ?? 0;
      const bbox_right = bbox?.right ?? 0;
      const bbox_bottom = bbox?.bottom ?? 0;
      if (licensePlate !== "unknown") {
        result.push({
          bbox_top,
          bbox_left,
          bbox_right,
          bbox_bottom,
          licensePlate,
          orientation,
          category,
          country,
          body,
          make,
          model,
          color,
        });
      }
    }
    return result;
  };
}

export default DetectPrivateService;
