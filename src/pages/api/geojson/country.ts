// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IResponse } from '@/lib/types';
import { getCountries } from '@/services/country';
import { Country, CountryGEOJSON, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface IFindResponse extends IResponse {
  data?: (Country & {
    countryGEOJSON: CountryGEOJSON;
  })[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IFindResponse>,
) {
  const session = await getSession({ req });
  //   if (!session)
  //     return res
  //       .status(401)
  //       .json({ errMessage: 'Unauthorized', error: true, success: false });

  //TODO remove this
  const userData = { id: 1 } as User;

  const countries = await getCountries(userData, { geojson: true });

  res.status(200).json({ success: true, data: countries });

  return res
    .status(500)
    .json({ success: false, error: true, errMessage: 'Invalid Request' });
}
