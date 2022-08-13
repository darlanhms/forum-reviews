import { z } from 'zod';
import LoginUseCase from 'app/useCases/login/login';
import { createRouter } from 'app/utils/createRouter';

export const loginRequest = z.object({
  name: z.string(),
  password: z.string(),
});

export type LoginRequest = z.infer<typeof loginRequest>;

const loginController = createRouter()
  .mutation('login', {
    input: loginRequest,
    async resolve({ input }) {
      const login = new LoginUseCase();

      const token = await login.execute(input);

      return { token };
    },
  })
  .query('me', {
    async resolve({ ctx }) {
      return ctx.member ? { member: ctx.member } : null;
    },
  });

export default loginController;
