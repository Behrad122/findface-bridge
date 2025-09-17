import { memoize } from "functools-kit";
import { Client } from "minio";
import {
  CC_MINIO_ACCESSKEY,
  CC_MINIO_ENDPOINT,
  CC_MINIO_PORT,
  CC_MINIO_SECRETKEY,
} from "../../config/params";

const minioClient = new Client({
  endPoint: CC_MINIO_ENDPOINT,
  port: CC_MINIO_PORT,
  accessKey: CC_MINIO_ACCESSKEY,
  secretKey: CC_MINIO_SECRETKEY,
  useSSL: false,
});

export class MinioService {
  public getClient = memoize(
    (bucketName) => bucketName,
    async (bucketName: string) => {
      if (await minioClient.bucketExists(bucketName)) {
        return minioClient;
      }
      await minioClient.makeBucket(bucketName);
      return minioClient;
    }
  );
}

export default MinioService;
