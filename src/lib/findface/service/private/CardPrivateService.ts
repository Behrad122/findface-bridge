import { inject } from "../../core/di";
import LoggerService from "../base/LoggerService";
import TYPES from "../../config/types";
import TokenService from "../base/TokenService";
import { CC_FINDFACE_URL } from "../../config/params";
import { IHumanCardDto, IHumanCardRow } from "../../model/HumanCard.model";
import { IAttachment } from "../../model/Attachment.model";
import { minio } from "../../../minio";
import { TContextService } from "../base/ContextService";
import RequestFactory from "../../common/RequestFactory";
import { CC_FINDFACE_WATCHLIST } from "../../config/params";
import dayjs from "dayjs";

const HOURS_PASSED_REJECT = 24;
const COMPARE_THRESHOLD = "0.72";

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
    const url = new URL(`${CC_FINDFACE_URL}/cards/humans/`);
    url.searchParams.set("looks_like", `detection:${detectionId}`);
    if (CC_FINDFACE_WATCHLIST) {
      url.searchParams.set("watch_lists", String(CC_FINDFACE_WATCHLIST));
    }
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
      this.contextService.context
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

  public findByDetectionRange = async (
    detectionId: string
  ): Promise<IHumanCardRow | null> => {
    this.loggerService.logCtx(`cardPrivateService findByDetectionRange`, {
      detectionId,
    });
    const url = new URL(`${CC_FINDFACE_URL}/cards/humans/`);
    url.searchParams.set("ordering", "-created_date");
    url.searchParams.set("looks_like", `detection:${detectionId}`);
    url.searchParams.set("limit", "5");
    if (CC_FINDFACE_WATCHLIST) {
      url.searchParams.set("watch_lists", String(CC_FINDFACE_WATCHLIST));
    }
    url.searchParams.set("threshold", COMPARE_THRESHOLD);
    const factory = RequestFactory.makeRequest(
      `cardPrivateService findByDetectionRange`,
      url.toString(),
      {
        method: "GET",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
      },
      this.contextService.context
    );
    const { results } = await factory.fetchJson();
    const now = dayjs();
    const [output = null] = results
      .filter(({ modified_date }) => {
        const modifiedDate = dayjs(modified_date);
        return now.diff(modifiedDate, "hour") < HOURS_PASSED_REJECT;
      })
      .sort(
        ({ looks_like_confidence: a }, { looks_like_confidence: b }) => b - a
      );
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
      `${CC_FINDFACE_URL}/cards/humans/${cardId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
      },
      this.contextService.context
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
      `${CC_FINDFACE_URL}/cards/humans/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: JSON.stringify({
          name,
          watch_lists: CC_FINDFACE_WATCHLIST ? [CC_FINDFACE_WATCHLIST] : undefined,
          meta,
        }),
      },
      this.contextService.context
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
      `${CC_FINDFACE_URL}/cards/humans/${id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
        body: JSON.stringify({
          id,
          name,
          watch_lists: CC_FINDFACE_WATCHLIST ? [CC_FINDFACE_WATCHLIST] : undefined,
          meta,
        }),
      },
      this.contextService.context
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
      `${CC_FINDFACE_URL}/human-card-attachments/`,
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
    const { id: fileId, name: fileName } = <any>await response.json();
    return {
      fileId,
      fileName,
    };
  };

  public addHumanCardAttachmentByBlob = async (
    id: number,
    blob: Blob,
    fileName: string = "image.png"
  ): Promise<IAttachment> => {
    this.loggerService.logCtx(
      `cardPrivateService addHumanCardAttachmentByBlob`,
      {
        id,
        fileName,
      }
    );
    const formData = new FormData();
    formData.append("name", fileName);
    formData.append("file", blob, fileName);
    formData.append("card", String(id));
    const factory = RequestFactory.makeRequest(
      `cardPrivateService addHumanCardAttachmentByBlob`,
      `${CC_FINDFACE_URL}/human-card-attachments/`,
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
    const { id: fileId, name: returnedFileName } = <any>await response.json();
    return {
      fileId,
      fileName: returnedFileName,
    };
  };
}

export default CardPrivateService;
