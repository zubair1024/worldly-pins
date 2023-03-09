// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IResponse, IUser } from '@/lib/types';
import { handleError } from '@/lib/utils';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

interface IUserApiResponse extends IResponse {
  data?: IUser;
}

const userSearchSchema = z.object({
  email: z.string().min(3),
});

const userCreationSchema = userSearchSchema.extend({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  password: z.string().min(3),
});

async function createUser(userData: Required<IUser>) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const data = (await prisma.user.create({
    data: userData,
  })) as IUser;
  await prisma.$disconnect();
  delete data.password;
  return data;
}

async function updateUser(userData: IUser) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const data = (await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: userData,
  })) as IUser;
  await prisma.$disconnect();
  delete data.password;
  return data;
}

async function deleteUser(userData: IUser) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const data = (await prisma.user.delete({
    where: {
      email: userData.email,
    },
  })) as IUser;
  await prisma.$disconnect();
  delete data.password;
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUserApiResponse>,
) {
  try {
    if (req.method == 'POST') {
      userCreationSchema.parse(req.body);
      const data = await createUser(req.body as Required<IUser>);
      return res.status(200).json({
        success: true,
        message: 'User was created successfully',
        data,
      });
    }
    if (req.method === 'PUT') {
      userCreationSchema.parse(req.body);
      const data = await updateUser(req.body as Required<IUser>);
      return res.status(200).json({
        success: true,
        message: 'User was created updated',
        data,
      });
    }
    if (req.method === `DELETE`) {
      userSearchSchema.parse(req.body);
      const data = await deleteUser(req.body as Required<IUser>);
      return res.status(200).json({
        success: true,
        message: 'User was deleted',
        data,
      });
    }
    return res
      .status(500)
      .json({ error: true, errMessage: 'Invalid method used', success: false });
  } catch (err: unknown) {
    console.error(err);
    handleError(res, err);
  }
}
