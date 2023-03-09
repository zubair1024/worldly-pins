import { Country, CountryGEOJSON, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCountries(
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
  });
  await prisma.$disconnect();
  return data;
}

export async function addCountry(
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
  });
  await prisma.$disconnect();
  return data;
}

export async function deleteCountry(
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

export async function findCountries(str: string) {
  prisma.$connect();
  const countries = await prisma.countryGEOJSON.findMany({
    where: { name: { contains: str } },
    select: { name: true, id: true, iso_a3: true },
  });
  prisma.$disconnect();
  return countries;
}
