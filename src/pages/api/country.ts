// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IResponse } from '@/lib/types';
import { handleError } from '@/lib/utils';
import {
  addCountryForUser,
  checkIfCountryExistsForUser,
  deleteCountryForUser,
  getCountriesForUser,
  isCountryValid,
} from '@/services/country';
import { Country, CountryGEOJSON, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import z from 'zod';

interface IUserApiResponse extends IResponse {
  data?: Country[];
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
      const data = await getCountriesForUser(userData, { geojson: false });
      return res.status(200).json({
        success: true,
        message: 'Country was created successfully',
        data,
      });
    }
    if (req.method == 'POST') {
      countryCreationSchema.parse(req.body);

      if (!isCountryValid(req.body.name as string))
        return res.status(404).json({
          success: false,
          error: true,
          errMessage: 'Country not found',
        });

      const exists = await checkIfCountryExistsForUser(
        req.body as Pick<CountryGEOJSON, 'name' | 'id' | 'iso_a3'>,
        userData,
      );
      if (exists)
        return res.status(200).json({
          error: true,
          errMessage: 'Country already exists',
          success: false,
        });

      const data = await addCountryForUser(
        req.body as Pick<CountryGEOJSON, 'name' | 'id' | 'iso_a3'>,
        userData,
      );
      return res.status(200).json({
        success: true,
        message: 'Country was created successfully',
        data: [data],
      });
    }
    if (req.method === `DELETE`) {
      countryCreationSchema.parse(req.body);

      if (!isCountryValid(req.body.name as string))
        return res.status(404).json({
          success: false,
          error: true,
          errMessage: 'Country not found',
        });

      const data = await deleteCountryForUser(
        req.body as Pick<CountryGEOJSON, 'name'>,
        userData,
      );
      return res.status(200).json({
        success: true,
        message: 'Country was deleted',
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
