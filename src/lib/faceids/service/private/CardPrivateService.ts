import { inject } from "../../core/di";
import LoggerService from "../base/LoggerService";
import TYPES from "../../config/types";
import TokenService from "../base/TokenService";
import { CC_FACEIDS_URL } from "../../config/params";
import { IHumanCardDto, IHumanCardRow } from "../../model/HumanCard.model";
import { IAttachment } from "../../model/Attachment.model";
import { minio } from "../../../minio";
import { TContextService } from "../base/ContextService";
import RequestFactory from "../../common/RequestFactory";
import { CC_FACEIDS_WATCHLIST } from "../../config/params";

export class CardPrivateService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);
  protected readonly tokenService = inject<TokenService>(TYPES.tokenService);
  protected readonly contextService = inject<TContextService>(
    TYPES.contextService
  );

  public findByDetection = async (
    detectionId: string
  ): Promise<IHumanCardRow | null> => {
    this.loggerService.logCtx(`cardPrivateService findByDetection`, {
      detectionId,
    });
    const url = new URL(`${CC_FACEIDS_URL}/cards/humans/`);
    url.searchParams.set("looks_like", `detection:${detectionId}`);
    url.searchParams.set("watch_lists", String(CC_FACEIDS_WATCHLIST));
    url.searchParams.set("limit", "1");
    const factory = RequestFactory.makeRequest(
      `cardPrivateService findByDetection`,
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
    const [output = null] = results;
    return output
      ? {
          id: output.id,
          name: output.name,
          ...output.meta,
          createdDate: output.created_date,
          modifiedDate: output.modified_date,
        }
      : null;
  };

  public findByCardId = async (
    cardId: string
  ): Promise<IHumanCardRow | null> => {
    this.loggerService.logCtx(`cardPrivateService findByCardId`, {
      cardId,
    });
    const factory = RequestFactory.makeRequest(
      `cardPrivateService findByCardId`,
      `${CC_FACEIDS_URL}/cards/humans/${cardId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
      },
      this.contextService.context,
    );
    const output = await factory.fetchJson();
    return output
      ? {
          id: output.id,
          name: output.name,
          ...output.meta,
          createdDate: output.created_date,
          modifiedDate: output.modified_date,
        }
      : null;
  };

  public createHumanCard = async (
    dto: IHumanCardDto
  ): Promise<IHumanCardRow> => {
    this.loggerService.logCtx(`cardPrivateService createHumanCard`, { dto });
    const { name, ...meta } = dto;
    const factory = RequestFactory.makeRequest(
      `cardPrivateService createHumanCard`,
      `${CC_FACEIDS_URL}/cards/humans/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: JSON.stringify({ name, watch_lists: [CC_FACEIDS_WATCHLIST], meta }),
      },
      this.contextService.context,
    );
    const output = await factory.fetchJson();
    return {
      id: output.id,
      name: output.name,
      ...output.meta,
      createdDate: output.created_date,
      modifiedDate: output.modified_date,
    };
  };

  public updateHumanCard = async (
    id: number,
    dto: IHumanCardDto
  ): Promise<IHumanCardRow> => {
    this.loggerService.logCtx(`cardPrivateService updateHumanCard`, {
      id,
      dto,
    });
    const { name, ...meta } = dto;
    const factory = RequestFactory.makeRequest(
      `cardPrivateService updateHumanCard`,
      `${CC_FACEIDS_URL}/cards/humans/${id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: JSON.stringify({ id, name, watch_lists: [CC_FACEIDS_WATCHLIST], meta }),
      },
      this.contextService.context,
    );
    const output = await factory.fetchJson();
    return {
      id: output.id,
      name: output.name,
      ...output.meta,
      createdDate: output.created_date,
      modifiedDate: output.modified_date,
    };
  };

  public addHumanCardAttachment = async (
    id: number,
    imageId: string
  ): Promise<IAttachment> => {
    this.loggerService.logCtx(`cardPrivateService addHumanCardAttachment`, {
      id,
      imageId,
    });
    const data = await minio.imageDataGlobalService.getObject(
      imageId,
      this.contextService.context
    );
    const formData = new FormData();
    formData.append("name", imageId);
    formData.append("file", data, imageId);
    formData.append("card", String(id));
    const factory = RequestFactory.makeRequest(
      `cardPrivateService addHumanCardAttachment`,
      `${CC_FACEIDS_URL}/human-card-attachments/`,
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
    const { id: fileId, name: fileName } = <any>await response.json();
    return {
      fileId,
      fileName,
    };
  };
}

export default CardPrivateService;
