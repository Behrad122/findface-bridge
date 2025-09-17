import { inject } from "../core/di";
import { trycatch } from "functools-kit";
import TYPES from "../config/types";
import LoggerService from "../service/base/LoggerService";
import { IContext } from "../service/base/ContextService";

const PAYLOAD_METHODS = ['POST', 'PUT', 'PATCH'];

export type Method = "GET" | "POST" | "DELETE" | "PATCH" | "PUT" | "HEAD" | "OPTIONS";

export interface FetchOptions {
    url?: string;
    method?: Method | string;
    headers?: Record<string, unknown>;
    body?: any;
    [rest: string]: any 
}

class FetchError extends Error {
    constructor(
        readonly originalError: any,
        readonly request: string | FetchOptions,
        readonly response: Response | undefined,
        readonly statusCode: number,
        readonly info: string | FetchOptions,
        readonly init: FetchOptions | undefined
    ) {
        super(originalError.message || 'FetchError');
    }
};

export class RequestFactory {

  private readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  private constructor(
    public readonly requestName: string,
    public readonly requestInfo: string | FetchOptions,
    public readonly requestInit?: FetchOptions,
    public readonly context?: IContext,
  ) {}

  public fetch = async () => {
    const request = this.requestInfo instanceof URL ? this.requestInfo.toString() : this.requestInfo;
    let response: Response | undefined = undefined;
    try {
        this.loggerService.log(`requestFactory ${this.requestName} fetch begin`, {
            requestInfo: this.requestInfo,
            requestInit: this.requestInit,
            context: this.context,
        });
        response = await fetch(<any>this.requestInfo, <any>this.requestInit);
        if (!response.ok) {
            const responseText = await trycatch(async () => await response!.text(), { defaultValue: null })();
            const requestInfo = trycatch(JSON.stringify, { defaultValue: null })(this.requestInfo);
            const requestInit = trycatch(JSON.stringify, { defaultValue: null })(this.requestInit);
            throw new Error(`${this.requestName} fetch response not ok. Info: ${requestInfo}, Init: ${requestInit}, Status: ${response.status}, Message: ${responseText}`);
        }
        this.loggerService.log(`requestFactory ${this.requestName} fetch ok`, {
            requestInfo: this.requestInfo,
            requestInit: this.requestInit,
            context: this.context,
        });
        return response;
    } catch (error) {
        this.loggerService.log(`requestFactory ${this.requestName} fetch caught`, {
            requestInfo: this.requestInfo,
            requestInit: this.requestInit,
            context: this.context,
        });
        throw new FetchError(
            error,
            request,
            response,
            response?.status || 0,
            this.requestInfo,
            this.requestInit!
        );
    }
  }

  public fetchJson = async <T = any>(): Promise<T> => {
    const request = this.requestInfo instanceof URL ? this.requestInfo.toString() : this.requestInfo;
    let response: Response | undefined = undefined;
    try {
        this.loggerService.log(`requestFactory ${this.requestName} fetchJson begin`, {
            requestInfo: this.requestInfo,
            requestInit: this.requestInit,
            context: this.context,
        });
        response = await fetch(<any>request, {
            ...this.requestInit,
            headers: {
                ...(PAYLOAD_METHODS.includes(this.requestInit?.method?.toUpperCase()!) && {
                    "Content-Type": "application/json",
                }),
                ...<any>this.requestInit?.headers,
            },
        });
        if (!response.ok) {
            const responseText = await trycatch(async () => await response!.text(), { defaultValue: null })();
            const requestInfo = trycatch(JSON.stringify, { defaultValue: null })(this.requestInfo);
            const requestInit = trycatch(JSON.stringify, { defaultValue: null })(this.requestInit);
            throw new Error(`${this.requestName} fetchJson response not ok. Info: ${requestInfo}, Init: ${requestInit}, Status: ${response.status}, Message: ${responseText}`);
        }
        this.loggerService.log(`requestFactory ${this.requestName} fetchJson ok`, {
            requestInfo: this.requestInfo,
            requestInit: this.requestInit,
            context: this.context,
        });
        return await response.json() as unknown as T;
    } catch (error: any) {
        this.loggerService.log(`requestFactory ${this.requestName} fetchJson caught`, {
            requestInfo: this.requestInfo,
            requestInit: this.requestInit,
            context: this.context,
        });
        throw new FetchError(
            error,
            request,
            response,
            response?.status || 0,
            this.requestInfo,
            this.requestInit!
        );
    }
  }

  public static makeRequest = (
    requestName: string,
    requestInfo: string | FetchOptions,
    requestInit?: FetchOptions,
    context?: IContext,
  ) => new RequestFactory(requestName, requestInfo, requestInit, context);
}

export default RequestFactory;
