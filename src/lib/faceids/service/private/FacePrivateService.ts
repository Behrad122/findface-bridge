import TYPES from "../../config/types";
import { inject } from "../../core/di";
import LoggerService from "../base/LoggerService";
import TokenService from "../base/TokenService";
import { CC_FACEIDS_URL } from "../../config/params";
import { IFace } from "../../model/Face.model";
import { minio } from "../../../minio";
import { TContextService } from "../base/ContextService";
import RequestFactory from "../../common/RequestFactory";

export class FacePrivateService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);
  protected readonly tokenService = inject<TokenService>(TYPES.tokenService);
  protected readonly contextService = inject<TContextService>(
    TYPES.contextService
  );

  public createFace = async (
    cardId: string,
    imageId: string
  ): Promise<IFace> => {
    this.loggerService.logCtx(`facePrivateService createFace`, {
      cardId,
    });
    const data = await minio.imageDataGlobalService.getObject(
      imageId,
      this.contextService.context
    );
    const formData = new FormData();
    formData.append("source_photo", data, imageId);
    formData.append("card", String(cardId));
    const factory = RequestFactory.makeRequest(
      `facePrivateService createFace`,
      `${CC_FACEIDS_URL}/objects/faces/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: formData,
      },
      this.contextService.context,
    );
    const response = await factory.fetch();
    const output = <any>await response.json();
    return {
      faceId: output.id,
      fileName: output.source_photo_name,
      src: output.source_photo,
      thumbnail: output.thumbnail,
    };
  };

  public listFace = async (cardId: string): Promise<IFace[]> => {
    this.loggerService.logCtx(`facePrivateService listFace`, {
      cardId,
    });
    const url = new URL(`${CC_FACEIDS_URL}/objects/faces/`);
    url.searchParams.set("card", String(cardId));
    url.searchParams.set("limit", "15");
    const factory = RequestFactory.makeRequest(
      `facePrivateService listFace`,
      url.toString(),
      {
        method: "GET",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
      },
      this.contextService.context,
    );
    const { results } = await factory.fetchJson();
    return results.map(
      (output: any): IFace => ({
        faceId: output.id,
        fileName: output.source_photo_name,
        src: output.source_photo,
        thumbnail: output.thumbnail,
      })
    );
  };

  public removeFace = async (faceId: string) => {
    this.loggerService.logCtx(`facePrivateService removeFace`, {
      faceId,
    });
    await fetch(`${CC_FACEIDS_URL}/objects/faces/${faceId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${this.tokenService.getToken()}`,
      },
    });
  };
}

export default FacePrivateService;
