import { Country, CountryGEOJSON, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCountriesForUser(
  user: User,
  { geojson }: { geojson: boolean },
) {
  await prisma.$connect();

  const data = await prisma.country.findMany({
    where: {
      userId: user.id,
    },
    include: {
      countryGEOJSON: geojson,
    },
    orderBy: [{ name: 'asc' }],
  });
  await prisma.$disconnect();
  return data;
}

export async function addCountryForUser(
  country: Pick<CountryGEOJSON, 'name' | 'id' | 'iso_a3'>,
  user: User,
) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const data = await prisma.country.create({
    data: {
      name: country.name,
      pStateId: 1,
      userId: user.id,
      countryGEOJSONId: country.id,
      iso_a3: country.iso_a3,
    },
    include: {
      countryGEOJSON: true,
    },
  });

  await prisma.$disconnect();
  return data;
}

export async function checkIfCountryExistsForUser(
  country: Pick<CountryGEOJSON, 'name' | 'id' | 'iso_a3'>,
  user: User,
) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const exists = await prisma.country.findFirst({
    where: {
      pStateId: 1,
      userId: user.id,
      countryGEOJSONId: country.id,
    },
  });
  await prisma.$disconnect();
  return exists ? true : false;
}

export async function deleteCountryForUser(
  country: Pick<Country, 'name'>,
  user: User,
) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const data = await prisma.country.delete({
    where: {
      name_userId: {
        userId: user.id,
        name: country.name,
      },
    },
  });
  await prisma.$disconnect();
  return data;
}

export async function isCountryValid(str: string) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const country = await prisma.country.findFirst({ where: { name: str } });
  prisma.$disconnect();
  return country ? true : false;
}

export async function findCountries(str: string, limit = 10) {
  prisma.$connect();
  const countries = await prisma.countryGEOJSON.findMany({
    where: { name: { contains: str, mode: 'insensitive' } },
    select: { name: true, id: true, iso_a3: true },
    take: limit,
    orderBy: [{ name: 'asc' }],
  });
  prisma.$disconnect();
  return countries;
}
