// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IResponse } from '@/lib/types';
import { getCountriesForUser } from '@/services/country';
import { Country, CountryGEOJSON } from '@prisma/client';
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
  try {
  } catch (err) {}
  const session = await getSession({ req });
  if (!session)
    return res
      .status(401)
      .json({ errMessage: 'Unauthorized', error: true, success: false });

  const userData = session.user;

  //TODO remove this
  // const userData = { id: 1 } as User;

  const countries = await getCountriesForUser(userData, { geojson: true });

  return res.status(200).json({ success: true, data: countries });
}
