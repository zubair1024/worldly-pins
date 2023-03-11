// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IResponse } from '@/lib/types';
import { handleError } from '@/lib/utils';
import {
  addCityForUser,
  checkIfCityExistsForUser,
  deleteCityForUser,
  getCitiesForUser,
  isCityValid,
} from '@/services/city';
import { City, CityMaster, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import z from 'zod';

interface IUserApiResponse extends IResponse {
  data?: City[];
}
const countryCreationSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUserApiResponse>,
) {
  const session = await getSession({ req });
  // if (!session)
  //   return res
  //     .status(401)
  //     .json({ errMessage: 'Unauthorized', error: true, success: false });

  // const userData = session.user;

  //TODO remove this
  const userData = { id: 1 } as User;

  try {
    if (req.method == 'GET') {
      const data = await getCitiesForUser(userData, { cityMaster: true });
      return res.status(200).json({
        success: true,
        message: 'Country was created successfully',
        data,
      });
    }
    if (req.method == 'POST') {
      countryCreationSchema.parse(req.body);

      if (!isCityValid(req.body.name as string))
        return res.status(404).json({
          success: false,
          error: true,
          errMessage: 'Country not found',
        });

      const exists = await checkIfCityExistsForUser(
        req.body as Pick<CityMaster, 'name' | 'id'>,
        userData,
      );
      if (exists)
        return res.status(200).json({
          error: true,
          errMessage: 'City already exists',
          success: false,
        });

      const data = await addCityForUser(
        req.body as Pick<CityMaster, 'name' | 'id'>,
        userData,
      );
      return res.status(200).json({
        success: true,
        message: 'City was created successfully',
        data: [data],
      });
    }
    if (req.method === `DELETE`) {
      countryCreationSchema.parse(req.body);

      if (!isCityValid(req.body.name as string))
        return res.status(404).json({
          success: false,
          error: true,
          errMessage: 'City not found',
        });

      const data = await deleteCityForUser(
        req.body as Pick<City, 'name' | 'id'>,
        userData,
      );
      return res.status(200).json({
        success: true,
        message: 'City was deleted',
        data: [data],
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
