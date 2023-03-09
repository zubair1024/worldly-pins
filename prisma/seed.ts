import { Prisma, PrismaClient } from '@prisma/client';
import { FeatureCollection } from 'geojson';
import countriesData from '../src/data/countries.json';

const countryFeatureCollection = countriesData as FeatureCollection;

const prisma = new PrismaClient();
async function main() {
  await prisma.$connect();
  await prisma.persistentState.deleteMany({ where: {} });
  await prisma.persistentState.createMany({
    data: [
      {
        id: 1,
        state: 'Active',
      },
      {
        id: 6,
        state: 'Deleted',
      },
    ],
  });
  await prisma.countryGEOJSON.deleteMany({ where: {} });
  const countriesDataToInsert = countryFeatureCollection.features.map((i) => ({
    name: i.properties?.ADMIN as string,
    geoJson: i as unknown as Prisma.JsonObject,
    iso_a3: i.properties?.ISO_A3 as string,
  }));
  await prisma.countryGEOJSON.createMany({ data: countriesDataToInsert });
  console.log(`Done !!!`);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
