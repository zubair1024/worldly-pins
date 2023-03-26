import { CityMaster, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCitiesForUser(
  user: User,
  { cityMaster }: { cityMaster: boolean },
) {
  await prisma.$connect();

  const data = await prisma.city.findMany({
    where: {
      userId: user.id,
    },
    include: {
      cityMaster,
    },
    orderBy: [{ name: 'asc' }],
  });
  await prisma.$disconnect();
  return data;
}

export async function addCityForUser(
  city: Pick<CityMaster, 'name' | 'id'>,
  user: User,
) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const data = await prisma.city.create({
    data: {
      name: city.name,
      pStateId: 1,
      userId: user.id,
      cityMasterId: city.id,
    },
    include: {
      cityMaster: true,
    },
  });

  await prisma.$disconnect();
  return data;
}

export async function checkIfCityExistsForUser(
  city: Pick<CityMaster, 'name' | 'id'>,
  user: User,
) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const exists = await prisma.city.findFirst({
    where: {
      pStateId: 1,
      userId: user.id,
      cityMasterId: city.id,
    },
  });
  await prisma.$disconnect();
  return exists ? true : false;
}

export async function deleteCityForUser(
  city: Pick<CityMaster, 'name' | 'id'>,
  user: User,
) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const data = await prisma.city.delete({
    where: {
      name_userId: {
        userId: user.id,
        name: city.name,
      },
    },
  });
  await prisma.$disconnect();
  return data;
}

export async function isCityValid(str: string) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const country = await prisma.city.findFirst({ where: { name: str } });
  prisma.$disconnect();
  return country ? true : false;
}

export async function findCities(str: string, limit = 10) {
  prisma.$connect();
  const countries = await prisma.cityMaster.findMany({
    where: { name: { contains: str, mode: 'insensitive' } },
    include: { countryGEOJSON: true },
    take: limit,
    orderBy: [{ name: 'asc' }],
  });
  prisma.$disconnect();
  return countries;
}
