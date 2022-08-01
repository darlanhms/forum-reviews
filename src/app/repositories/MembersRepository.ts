import { FILE_PREFIX } from '../core/consts';
import S3FileManager from '../core/S3FileManager';
import Member from '../entities/Member';

export default class MembersRepository extends S3FileManager {
  get filePath(): string {
    return `${FILE_PREFIX}/members.json`;
  }

  async getAll(): Promise<Array<Member>> {
    const fileData = await this.get(this.filePath);

    if (!fileData) {
      return [];
    }

    return this.bufferToJson(fileData);
  }
}
