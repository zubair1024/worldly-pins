import useGlobalStore from '@/lib/store';
import { City, CityMaster, Country, CountryGEOJSON } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { GrAdd, GrClose } from 'react-icons/gr';
import { toast } from 'react-toastify';
import Loading from './Loading';

const CountryTable = ({
  userCountries,
  handleRemoveUserCountry,
}: {
  userCountries: (Country & { countryGEOJSON: CountryGEOJSON })[];
  handleRemoveUserCountry: (
    country: Country & { countryGEOJSON: CountryGEOJSON },
  ) => Promise<void>;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Countries</th>
          </tr>
        </thead>
        <tbody>
          {userCountries.map((i) => {
            return (
              <tr key={i.id}>
                <td></td>
                <td className="flex space-x-4 text-sm">
                  {' '}
                  <button
                    className="rounded-full btn btn-xs "
                    onClick={() => {
                      handleRemoveUserCountry(i);
                    }}
                  >
                    <GrClose />
                  </button>
                  <p>{i.name}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const CityTable = ({
  userCities,
  handleRemoveUserCity,
}: {
  userCities: (City & { cityMaster: CityMaster })[];
  handleRemoveUserCity: (city: City) => Promise<void>;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Cities</th>
          </tr>
        </thead>
        <tbody>
          {userCities.map((i) => {
            return (
              <tr key={i.id}>
                <td></td>
                <td className="flex space-x-4 text-sm">
                  {' '}
                  <button
                    className="rounded-full btn btn-xs btn-primary"
                    onClick={() => {
                      handleRemoveUserCity(i);
                    }}
                  >
                    <GrClose />
                  </button>
                  <p>{i.name}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const CountryControls = () => {
  const { userCountries, addUserCountry, removeUserCountry } = useGlobalStore(
    (state) => ({
      userCountries: state.userCountries,
      addUserCountry: state.addUserCountry,
      removeUserCountry: state.removeUserCountry,
    }),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  useEffect(() => {
    setFilteredCountries([]);
    if (searchText.length > 3) {
      setIsFilterLoading(true);
      axios
        .get(`/api/find?type=country&q=${searchText}`)
        .then((res) => {
          if (res.data?.data) {
            setFilteredCountries(res.data.data as Country[]);
          }
        })
        .finally(() => setIsFilterLoading(false));
    }
  }, [searchText]);

  const handleAddCountry = async (country: Country) => {
    try {
      setIsLoading(true);
      await addUserCountry(country);
      toast.success(`Country was added!✅`);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
    setIsLoading(false);
  };

  const handleRemoveCountry = async (
    country: Country & { countryGEOJSON: CountryGEOJSON },
  ) => {
    try {
      setIsLoading(true);
      await removeUserCountry(country);
      toast.success(`Country was removed! ✅`);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
    setIsLoading(false);
  };

  if (isLoading)
    return (
      <div className="py-10">
        <Loading />
      </div>
    );

  return (
    <>
      <div className="flex flex-col justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full mt-5 input input-bordered input-primary"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="z-50 w-full px-10 bg-[#1f212c] rounded-lg">
          <ul>
            {isFilterLoading ? (
              <div className="py-10">
                <Loading />
              </div>
            ) : (
              filteredCountries
                .filter((i) =>
                  userCountries.find((j) => j.name == i.name) ? true : false,
                )
                .map((i) => (
                  <li className="py-2" key={i.id}>
                    <p
                      className="space-x-2 btn btn-sm"
                      onClick={() => {
                        void handleAddCountry(i);
                      }}
                    >
                      <GrAdd />
                      <span>{i.name}</span>
                    </p>
                  </li>
                ))
            )}
          </ul>
        </div>
      </div>
      <p className="py-4">
        <CountryTable
          userCountries={userCountries}
          handleRemoveUserCountry={handleRemoveCountry}
        />
      </p>
    </>
  );
};

const CityControls = () => {
  const { userCities, addUserCity, removeUserCity } = useGlobalStore(
    (state) => ({
      userCities: state.userCities,
      addUserCity: state.addUserCity,
      removeUserCity: state.removeUserCity,
    }),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredCities, setFilteredCities] = useState<CityMaster[]>([]);

  useEffect(() => {
    setFilteredCities([]);
    if (searchText.length > 3) {
      setIsFilterLoading(true);
      axios
        .get(`/api/find?type=city&q=${searchText}`)
        .then((res) => {
          if (res.data?.data) {
            setFilteredCities(res.data.data as CityMaster[]);
          }
        })
        .finally(() => setIsFilterLoading(false));
    }
  }, [searchText]);

  const handleAddCity = async (city: CityMaster) => {
    try {
      setIsLoading(true);
      await addUserCity(city);
      toast.success(`City was successfully added! ✅`);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
    setIsLoading(false);
  };

  const handleRemoveCity = async (city: City) => {
    try {
      setIsLoading(true);
      await removeUserCity(city);
      toast.success(`City was successfully removed! ✅`);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
    setIsLoading(false);
  };

  if (isLoading)
    return (
      <div className="py-10">
        <Loading />
      </div>
    );

  return (
    <>
      <div className="flex flex-col justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full mt-5 input input-bordered input-primary"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="z-50 w-full px-10 bg-[#1f212c] rounded-lg">
          <ul>
            {isFilterLoading ? (
              <div className="py-10">
                <Loading />
              </div>
            ) : (
              filteredCities
                .filter((i) => !userCities.find((j) => j.name == i.name))
                .map((i) => (
                  <li className="w-full py-2 cursor-pointer" key={i.id}>
                    <p
                      className="space-x-2 btn btn-sm"
                      onClick={() => {
                        void handleAddCity(i);
                      }}
                    >
                      <GrAdd />
                      <span>{i.name}</span>
                    </p>
                  </li>
                ))
            )}
          </ul>
        </div>
      </div>
      <p className="py-4">
        <CityTable
          userCities={userCities}
          handleRemoveUserCity={handleRemoveCity}
        />
      </p>
    </>
  );
};

const ModalControl = () => {
  const [isShown, setIsShown] = useState(false);
  const [toggleState, setToggleState] = useState<'country' | 'city'>('country');

  const handleToggleState = () => {
    setToggleState(toggleState === 'country' ? 'city' : 'country');
  };

  const handleShowModalControl = () => {
    setIsShown(true);
  };

  const handleCloseModal = () => {
    setIsShown(false);
  };

  return (
    <>
      <button
        className="btn btn-circle btn-primary"
        onClick={handleShowModalControl}
      >
        <GrAdd />
      </button>
      <input
        type="checkbox"
        id="modal-control"
        className="modal-toggle"
        checked={isShown}
      />
      <div className=" modal">
        <div className="modal-box">
          <div>
            <div className="flex items-start justify-between pb-10">
              <h3 className="text-lg font-bold">Add Country / City</h3>
              <div onClick={handleCloseModal}>
                <label htmlFor="my-modal" className="btn btn-circle btn-sm">
                  <GrClose />
                </label>
              </div>
            </div>
            <div className="text-sm w-md">
              <label className="flex items-center space-x-3 cursor-pointer">
                <span className="label-text">Cities</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={toggleState === 'country'}
                  onClick={handleToggleState}
                />
                <span className="label-text">Countries</span>
              </label>
            </div>
            {toggleState === 'country' ? <CountryControls /> : <CityControls />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalControl;
