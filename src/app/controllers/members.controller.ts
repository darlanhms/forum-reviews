import * as trpc from '@trpc/server';
import MembersRepository from '../repositories/MembersRepository';

export const membersController = trpc.router().query('getAll', {
  async resolve() {
    return new MembersRepository().getAll();
  },
});
