import { City, CityMaster, Country, CountryGEOJSON } from '@prisma/client';
import axios from 'axios';
import { create } from 'zustand';

interface StoreState {
  userCountries: (Country & {
    countryGEOJSON: CountryGEOJSON;
  })[];
  userCities: (City & { cityMaster: CityMaster })[];
  fetchUserCountries: () => Promise<void>;
  fetchUserCities: () => Promise<void>;
  setUserCountries: (
    countries: (Country & {
      countryGEOJSON: CountryGEOJSON;
    })[],
  ) => void;
  setUserCities: (cities: (City & { cityMaster: CityMaster })[]) => void;
  addUserCountry: (countries: Country) => Promise<void>;
  addUserCity: (city: CityMaster) => Promise<void>;
  removeUserCountry: (
    country: Country & {
      countryGEOJSON: CountryGEOJSON;
    },
  ) => Promise<void>;
  removeUserCity: (city: City) => Promise<void>;
}

const useGlobalStore = create<StoreState>()((set, get) => ({
  userCountries: [],
  userCities: [],
  fetchUserCountries: async () => {
    const res = await axios.get(`/api/geojson/country`);
    if (res.data?.data?.length) {
      const countries = res.data?.data as (Country & {
        countryGEOJSON: CountryGEOJSON;
      })[];
      set({ userCountries: countries });
    }
  },
  fetchUserCities: async () => {
    const res = await axios.get(`/api/city`);
    if (res.data?.data?.length) {
      const cities = res.data?.data as (City & { cityMaster: CityMaster })[];

      set({ userCities: cities });
    }
  },
  setUserCountries: (countries) => {
    set({
      userCountries: countries,
    });
  },
  setUserCities: (cities) => {
    set({ userCities: cities });
  },
  addUserCountry: async (country) => {
    if (!get().userCountries.find((i) => i.iso_a3 === country.iso_a3)) {
      const res = await axios.post('/api/country', { ...country });

      if (res.data?.data) {
        const newCountry: Country & { countryGEOJSON: CountryGEOJSON } =
          res.data?.data?.[0];
        const exists = get().userCountries.find(
          (i) => i.iso_a3 === newCountry.iso_a3,
        );
        if (!exists) {
          set({
            userCountries: [...get().userCountries, newCountry],
          });
        }
      }
    }
  },
  addUserCity: async (city) => {
    if (!get().userCities.find((i) => i.cityMaster.name === city.name)) {
      const res = await axios.post('/api/city', { ...city });

      if (res.data?.data) {
        const newCity: City & { cityMaster: CityMaster } = res.data?.data?.[0];
        const exists = get().userCities.find(
          (i) => i.cityMaster.name === newCity.name,
        );
        if (!exists) {
          set({
            userCities: [...get().userCities, newCity],
          });
        }
      }
    }
  },
  removeUserCountry: async (country) => {
    const res = await axios.delete('/api/country', { data: { ...country } });
    if (res.data?.data) {
      const country: Country & { countryGEOJSON: CountryGEOJSON } =
        res.data?.data?.[0];

      set({
        userCountries: get().userCountries.filter(
          (i) => i.iso_a3 !== country.iso_a3,
        ),
      });
    }
  },
  removeUserCity: async (city) => {
    const res = await axios.delete('/api/city', { data: { ...city } });
    if (res.data?.data) {
      const newCity: City & { cityMaster: CityMaster } = res.data?.data?.[0];

      set({
        userCities: get().userCities.filter((i) => i.name !== newCity.name),
      });
    }
  },
}));

export default useGlobalStore;
