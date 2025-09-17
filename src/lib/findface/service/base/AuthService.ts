import { CC_FINDFACE_URL, CC_FINDFACE_USER } from "../../config/params";
import { inject } from "../../core/di";
import { v4 as uuid } from "uuid";
import LoggerService from "./LoggerService";
import TYPES from "../../config/types";

import RequestFactory from "../../common/RequestFactory";
import { IContext } from "./ContextService";

type Context = Omit<IContext, "token">;

export class AuthService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  private readonly clientId = uuid();

  public login = async (login: string, password: string, context: Context): Promise<string> => {
    this.loggerService.log("authService login", { login, password, context });
    const factory = RequestFactory.makeRequest(
      "authService login",
      `${CC_FINDFACE_URL}/auth/login/`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`,
        },
        body: JSON.stringify({
          video_auth_token: "A",
          uuid: this.clientId,
          mobile: false,
          device_info: {},
        }),
      },
      context as IContext,
    );
    const data = await factory.fetchJson();
    return data.token;
  };

  public logout = async (token: string, context: Context) => {
    this.loggerService.log("authService logout", { token, context });
    const factory = RequestFactory.makeRequest(
      "authService logout",
      `${CC_FINDFACE_URL}/auth/logout/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      },
      context as IContext,
    );
    await factory.fetch();
  };

  public terminateOfflineSessions = async (token: string, context: Context) => {
    this.loggerService.log("authService terminateOfflineSessions", { token, context });
    const url = new URL(`${CC_FINDFACE_URL}/sessions/`);
    url.searchParams.append("limit", "20");
    url.searchParams.append("status", "offline");
    url.searchParams.append("user_name_in", CC_FINDFACE_USER);
    const sessionEntries: { id: string }[][] = [];
    const fetchSessionPage = async (url: string) => {
      const factory = RequestFactory.makeRequest(
        "authService terminateOfflineSessions list",
        url,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        },
        context as IContext,
      );
      const { next_page, results } = await factory.fetchJson();
      sessionEntries.push(results);
      if (next_page) {
        await fetchSessionPage(next_page);
      }
    };
    await fetchSessionPage(url.toString());
    const sessionList = sessionEntries.flatMap((rows) => rows);
    this.loggerService.log(
      "authService terminateOfflineSessions sessions count",
      { totalSessions: sessionList.length, context }
    );
    for (const { id: sessionId } of sessionList) {
      const factory = RequestFactory.makeRequest(
        "authService terminateOfflineSessions terminate",
        `${CC_FINDFACE_URL}/sessions/${sessionId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        },
        context as IContext,
      );
      await factory.fetch();
    }
  };
}

export default AuthService;
