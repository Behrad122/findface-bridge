import { factory } from "di-factory";
import { createAwaiter } from "functools-kit";

import { v4 as uuid } from "uuid";
import path from "path";

import b64 from "base64-async";
import { fileTypeFromBuffer } from "file-type";
import { inject } from "../core/di";
import MinioService from "../services/base/MinioService";
import TYPES from "../config/types";

export const BaseStorage = factory(
  class {
    readonly minioService = inject<MinioService>(TYPES.minioService);

    constructor(public readonly BUCKET_NAME: string) {}

    async putObject(fileBase64: string, fileName: string) {
      const minioClient = await this.minioService.getClient(this.BUCKET_NAME);
      const fileId = `${uuid()}${path.extname(fileName)}`;
      const buffer = Buffer.from(<any>await b64.decode(fileBase64));
      await minioClient.putObject(
        this.BUCKET_NAME,
        fileId,
        buffer
      );
      return fileId;
    }

    async putBuffer(buffer: Buffer, fileName: string) {
      const minioClient = await this.minioService.getClient(this.BUCKET_NAME);
      const fileId = `${uuid()}${path.extname(fileName)}`;
      await minioClient.putObject(
        this.BUCKET_NAME,
        fileId,
        buffer
      );
      return fileId;
    }

    async getObject(fileId: string) {
      const minioClient = await this.minioService.getClient(this.BUCKET_NAME);
      const dataStream = await minioClient.getObject(this.BUCKET_NAME, fileId);
      const [awaiter, { resolve, reject }] = createAwaiter<Buffer>();
      {
        const chunks: Uint8Array[] = [];
        dataStream.on("data", function (chunk) {
          chunks.push(chunk);
        });
        dataStream.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
        dataStream.on("error", (error) => {
          reject(error);
        });
      }
      const buffer = await awaiter;
      const type = await fileTypeFromBuffer(<any>buffer);
      const mimeType = type?.mime || "image/png";
      // @ts-ignore
      return new Blob([buffer], { type: mimeType });
    }

    async deleteObject(fileId: string) {
      const minioClient = await this.minioService.getClient(this.BUCKET_NAME);
      await minioClient.removeObject(this.BUCKET_NAME, fileId);
    }
  }
);

export type TBaseStorage = InstanceType<ReturnType<typeof BaseStorage>>;

export default BaseStorage;
