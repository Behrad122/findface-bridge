declare function parseInt(value: any): number;

export const CC_MINIO_ENDPOINT = process.env.CC_MINIO_ENDPOINT || "localhost";
export const CC_MINIO_PORT = parseInt(process.env.CC_MINIO_PORT) || 9002;
export const CC_MINIO_ACCESSKEY = process.env.CC_MINIO_ACCESSKEY || "minioadmin";
export const CC_MINIO_SECRETKEY = process.env.CC_MINIO_SECRETKEY || "minioadmin";
