import { Country } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { GrAdd, GrClose } from 'react-icons/gr';
import Loading from './Loading';

const CountryTable = ({ countries }: { countries: Country[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((i) => {
            return (
              <tr key={i.id}>
                <td></td>
                <td className="text-sm">{i.name}</td>
                <td>
                  <button className="rounded-full btn btn-xs btn-primary">
                    <GrClose />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ModalControl = () => {
  const [isShown, setIsShown] = useState(false);
  const [toggleState, setToggleState] = useState<'country' | 'city'>('country');
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [userCountries, setUserCountries] = useState<Country[]>([]);
  // const [userCities, setUserCities] = useState<City[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res1 = await axios.get('/api/country');
      if (res1.data?.data) {
        setUserCountries(res1.data.data as Country[]);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleToggleState = () => {
    setToggleState(toggleState === 'country' ? 'city' : 'country');
  };

  const handleShowModalControl = () => {
    setIsShown(true);
  };

  const handleCloseModal = () => {
    setIsShown(false);
  };

  useEffect(() => {
    if (isShown) {
      fetchData();
    }
  }, [isShown]);

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

  const handleAddCountry = (country: Country) => {
    axios
      .post('/api/country', { ...country })
      .then((res) => {
        if (res.data?.data) {
          console.log(res.data.data);
        }
      })
      .then(() => {
        setFilteredCountries([]);
        setSearchText('');
        fetchData();
      });
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
      <div className="modal">
        <div className="modal-box">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <h3 className="text-lg font-bold">Add Country / City</h3>
              <div className="form-control w-md">
                <label className="cursor-pointer label">
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
                      <Loading />
                    ) : (
                      filteredCountries.map((i) => (
                        <li className="py-2" key={i.id}>
                          <button
                            className="w-full btn"
                            onClick={() => {
                              handleAddCountry(i);
                            }}
                          >
                            {i.name}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
              <p className="py-4">
                {toggleState === 'country' ? (
                  <CountryTable countries={userCountries} />
                ) : (
                  <div></div>
                )}
              </p>
              <div className="modal-action" onClick={handleCloseModal}>
                <label htmlFor="my-modal" className="btn">
                  Close
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalControl;
