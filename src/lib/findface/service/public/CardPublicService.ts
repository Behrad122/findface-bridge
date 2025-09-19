import { IHumanCardDto, IHumanCardRow } from "../../model/HumanCard.model";
import CardPrivateService from "../private/CardPrivateService";
import { inject } from "../../core/di";
import TYPES from "../../config/types";
import { CANCELED_PROMISE_SYMBOL, execpool, retry } from "functools-kit";
import LoggerService from "../base/LoggerService";

const RETRY_COUNT = 5;
const RETRY_DELAY = 1_000;
const RETRY_CONDITION = (error) =>
  error?.statusCode !== 401 && error?.statusCode !== 403;

const MAX_EXEC = 50;
const EXEC_DELAY = 0;

interface ICardPrivateService extends CardPrivateService {}

export type TCardPublicService = {
  [key in keyof ICardPrivateService]: any;
};

export class CardPublicService implements TCardPublicService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  protected readonly cardPrivateService = inject<CardPrivateService>(
    TYPES.cardPrivateService
  );

  public findByDetection = execpool<
    typeof CANCELED_PROMISE_SYMBOL | IHumanCardRow | null
  >(
    retry(async (detectionId: string) => {
      this.loggerService.logCtx("cardPublicService findByDetection", {
        detectionId,
      });
      return await this.cardPrivateService.findByDetection(detectionId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public findByDetectionRange = execpool<
    typeof CANCELED_PROMISE_SYMBOL | IHumanCardRow | null
  >(
    retry(
      async (detectionId: string) => {
        this.loggerService.logCtx("cardPublicService findByDetectionRange", {
          detectionId,
        });
        return await this.cardPrivateService.findByDetectionRange(detectionId);
      },
      RETRY_COUNT,
      RETRY_DELAY,
      RETRY_CONDITION
    ),
    {
      maxExec: MAX_EXEC,
      delay: EXEC_DELAY,
    }
  );

  public findByCardId = execpool(
    retry(async (cardId: string) => {
      this.loggerService.logCtx("cardPublicService findByCardId", {
        cardId,
      });
      return await this.cardPrivateService.findByCardId(cardId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public createHumanCard = execpool(
    retry(async (dto: IHumanCardDto) => {
      this.loggerService.logCtx("cardPublicService createHumanCard", { dto });
      return await this.cardPrivateService.createHumanCard(dto);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public updateHumanCard = execpool(
    retry(async (id: number, dto: IHumanCardDto) => {
      this.loggerService.logCtx("cardPublicService updateHumanCard", {
        id,
        dto,
      });
      return await this.cardPrivateService.updateHumanCard(id, dto);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public addHumanCardAttachment = execpool(
    retry(async (id: number, imageId: string) => {
      this.loggerService.logCtx("cardPublicService addHumanCardAttachment", {
        id,
      });
      return await this.cardPrivateService.addHumanCardAttachment(id, imageId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public addHumanCardAttachmentByBlob = execpool(
    retry(async (id: number, blob: Blob, fileName: string = "image.png") => {
      this.loggerService.logCtx("cardPublicService addHumanCardAttachmentByBlob", {
        id,
        fileName,
      });
      return await this.cardPrivateService.addHumanCardAttachmentByBlob(id, blob, fileName);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );
}

export default CardPrivateService;
