import { IHumanCardDto, IHumanCardRow } from "../../model/HumanCard.model";
import CardPrivateService from "../private/CardPrivateService";
import { inject } from "../../core/di";
import TYPES from "../../config/types";
import { CANCELED_PROMISE_SYMBOL, execpool, retry } from "functools-kit";
import LoggerService from "../base/LoggerService";

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
}

export default CardPrivateService;
