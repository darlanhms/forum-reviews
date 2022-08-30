import S3FileManager from 'app/core/S3FileManager';

export abstract class BaseRepository<Entity> {
  protected abstract filePath: string;

  protected fileManager = new S3FileManager();

  async saveFileContent(entities: Array<Entity>): Promise<void> {
    await this.fileManager.update(this.filePath, JSON.stringify(entities));
  }

  async getAll(): Promise<Array<Entity>> {
    const buffer = await this.fileManager.get(this.filePath);

    if (!buffer) {
      return [];
    }

    return this.fileManager.bufferToJson(buffer);
  }
}
