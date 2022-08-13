import * as trpcNext from '@trpc/server/adapters/next';
import * as jwt from 'jsonwebtoken';
import Member from 'app/entities/Member';

export async function authContext({ req }: trpcNext.CreateNextContextOptions) {
  let member: Member | null = null;

  if (req.headers.authorization) {
    try {
      member = jwt.verify(req.headers.authorization, process.env.JWT_SECRET as string) as Member;
    } catch {
      member = null;
    }
  }

  return {
    member,
  };
}
