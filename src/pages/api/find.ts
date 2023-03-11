// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IResponse } from '@/lib/types';
import { findCities } from '@/services/city';
import { findCountries } from '@/services/country';
import { CityMaster, CountryGEOJSON } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface IFindResponse extends IResponse {
  data?: Partial<CountryGEOJSON>[] | CityMaster[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IFindResponse>,
) {
  const session = await getSession({ req });
  // if (!session)
  //   return res
  //     .status(401)
  //     .json({ errMessage: 'Unauthorized', error: true, success: false });

  if (req.method === 'GET') {
    const { q, type } = req.query;
    if (type === 'country') {
      const countries = await findCountries(q as string);
      return res.status(200).json({ success: true, data: countries });
    }
    if (type === 'city') {
      const cities = await findCities(q as string);
      return res.status(200).json({ success: true, data: cities });
    }
  }

  return res
    .status(500)
    .json({ success: false, error: true, errMessage: 'Invalid Request' });
}
