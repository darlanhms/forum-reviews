import S3FileManager from 'app/core/S3FileManager';

export abstract class BaseRepository<Entity> {
  protected fileManager = new S3FileManager();

  protected abstract compare(a: Entity, b: Entity): boolean;

  protected async saveFileContent(filePath: string, entities: Array<Entity>): Promise<void> {
    await this.fileManager.update(filePath, JSON.stringify(entities));
  }

  protected async getAll(filePath: string): Promise<Array<Entity>> {
    const buffer = await this.fileManager.get(filePath);

    if (!buffer) {
      return [];
    }

    return this.fileManager.bufferToJson(buffer);
  }

  protected updateOrInsertInArray(entities: Array<Entity>, entity: Entity): Array<Entity> {
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

  protected removeFromArray(entities: Array<Entity>, entity: Entity): Array<Entity> {
    return entities.filter(entitySaved => !this.compare(entitySaved, entity));
  }
}
