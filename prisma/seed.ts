import { Prisma, PrismaClient } from '@prisma/client';
import { FeatureCollection } from 'geojson';
import citiesData from '../src/data/cities.json';
import countriesDataGEOJSON from '../src/data/countries-geojson.json';
import countriesData from '../src/data/countries-meta.json';

const countryFeatureCollection = countriesDataGEOJSON as FeatureCollection;
const countries = countriesData as {
  name: string;
  'alpha-2': string;
  'alpha-3': string;
  'country-code': string;
  'iso_3166-2': string;
  region: string;
  'sub-region': string;
  'intermediate-region': string;
  'region-code': string;
  'sub-region-code': string;
  'intermediate-region-code': string;
}[];

const cities = citiesData as {
  country: string;
  name: string;
  lat: string;
  lng: string;
}[];

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    await prisma.city.deleteMany({ where: {} });
    await prisma.cityMaster.deleteMany({ where: {} });
    // await prisma.country.deleteMany({ where: {} });
    // await prisma.countryGEOJSON.deleteMany({ where: {} });
    // await prisma.persistentState.deleteMany({ where: {} });

    // await addPersistentStates();
    // await addCountries();
    await addCities();
  } catch (err) {
    console.error(err);
  }
  console.log(`Done !!!`);
  prisma.$disconnect();
}
main();

async function addPersistentStates() {
  const prisma = new PrismaClient();
  await prisma.$connect();
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
  await prisma.$disconnect();
}

async function addCountries() {
  const result: {
    name: string;
    iso_a2: string;
    iso_a3: string;
    region: string;
    subRegion: string;
    geoJson: Prisma.JsonObject;
    pStateId: number;
  }[] = [];
  countries.map((i) => {
    const countryGeoJSON = countryFeatureCollection.features.find((j) => {
      return j.properties?.ISO_A3 === i['alpha-3'];
    });
    if (countryGeoJSON) {
      result.push({
        name: i.name,
        iso_a2: i['alpha-2'],
        iso_a3: i['alpha-3'],
        region: i.region,
        subRegion: i['sub-region'],
        geoJson: countryGeoJSON as unknown as Prisma.JsonObject,
        pStateId: 1,
      });
    }
  });
  console.log(`Uploading countries!`);
  const prisma = new PrismaClient();
  await prisma.countryGEOJSON.createMany({ data: result });
  prisma.$disconnect();
  console.log(`Done uploading countries!`);
}

async function addCities() {
  let counter = 0;
  const uniqueCities = cities.filter(
    (thing, i, arr) =>
      arr.findIndex(
        (t) => t.country === thing.country && t.name === thing.name,
      ) === i,
  );
  console.log(`adding ${uniqueCities.length} cities`);
  while (counter < uniqueCities.length) {
    const list = uniqueCities.slice(counter, counter + 100);
    const result: {
      name: string;
      lat: number;
      lon: number;
      countryGEOJSONId: number;
      pStateId: number;
    }[] = [];
    await Promise.all(
      list.map(async (city) => {
        const countryData = await prisma.countryGEOJSON.findFirst({
          where: { iso_a2: city.country },
          select: {
            id: true,
            name: true,
          },
        });
        if (countryData) {
          result.push({
            name: city.name,
            lat: Number(city.lat),
            lon: Number(city.lng),
            countryGEOJSONId: countryData.id,
            pStateId: 1,
          });
        }
      }),
    );
    console.log(result);
    console.log(
      `Uploading ${counter + 100} / ${uniqueCities.length} cities to database`,
    );
    await prisma.cityMaster.createMany({ data: result });
    counter = counter + 100;
  }
  console.log(`Done Uploading Cities!`);
}
