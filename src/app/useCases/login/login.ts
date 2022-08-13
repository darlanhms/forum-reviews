import * as trpc from '@trpc/server';
import * as jwt from 'jsonwebtoken';
import members from 'app/consts/members';
import { LoginRequest } from 'app/controllers/login.controller';

export default class LoginUseCase {
  async execute(request: LoginRequest): Promise<string> {
    const member = members.find(({ name }) => name === request.name);

    if (!member) {
      throw new trpc.TRPCError({
        code: 'BAD_REQUEST',
        message: 'Membro não previsto.',
      });
    }

    if (!(request.password === process.env.LOGIN_PASSWORD)) {
      throw new trpc.TRPCError({
        code: 'BAD_REQUEST',
        message: 'Senha não bate com a informada no grupo.',
      });
    }

    const token = jwt.sign(
      {
        name: request.name,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      },
    );

    return token;
  }
}
