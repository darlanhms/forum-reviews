import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || '',
    secretAccessKey: process.env.ACCESS_KEY_SECRET || '',
  },
});

const bucketName = process.env.BUCKET_NAME;

if (!bucketName) {
  throw new Error('Bucket name undefined!!!');
}

export default abstract class S3FileManager {
  protected async create(name: string, body: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: name,
      Body: body,
    });

    await s3Client.send(command);
  }

  protected async update(name: string, newBody: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: name,
      Body: newBody,
    });

    await s3Client.send(command);
  }

  protected async delete(name: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: name,
    });

    await s3Client.send(command);
  }

  protected async get(name: string): Promise<Buffer | undefined> {
    return new Promise(resolve => {
      try {
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: name,
        });

        s3Client
          .send(command)
          .then(response => {
            const chunks: Buffer[] = [];

            const responseBody = response.Body as any;

            responseBody.on('data', (blob: Buffer) => {
              chunks.push(blob);
            });

            responseBody.on('error', (blob: Buffer) => {
              resolve(blob);
            });

            responseBody.on('end', () => {
              resolve(Buffer.concat(chunks));
            });
          })
          .catch(() => resolve(undefined));
      } catch (error) {
        resolve(undefined);
      }
    });
  }

  protected bufferToJson<T>(buffer: Buffer): T {
    return JSON.parse(buffer.toString());
  }
}
