import S3FileManager from 'app/core/S3FileManager';

export abstract class BaseRepository<Entity> {
  protected fileManager = new S3FileManager();

  abstract compare(a: Entity, b: Entity): boolean;

  async saveFileContent(filePath: string, entities: Array<Entity>): Promise<void> {
    await this.fileManager.update(filePath, JSON.stringify(entities));
  }

  async getAll(filePath: string): Promise<Array<Entity>> {
    const buffer = await this.fileManager.get(filePath);

    if (!buffer) {
      return [];
    }

    return this.fileManager.bufferToJson(buffer);
  }

  updateOrInsertInArray(entities: Array<Entity>, entity: Entity): Array<Entity> {
    const alreadyExistingIndex = entities.findIndex(entitySaved => this.compare(entitySaved, entity));

    if (alreadyExistingIndex !== -1) {
      const oldEntity = entities[alreadyExistingIndex];

      const updatedEntity = {
        ...oldEntity,
        ...entity,
      };

      entities[alreadyExistingIndex] = updatedEntity;
    } else {
      entities.push(entity);
    }

    return entities;
  }
}
