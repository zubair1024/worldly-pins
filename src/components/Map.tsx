import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { City, CityMaster, Country, CountryGEOJSON } from '@prisma/client';
import { GeoJsonObject } from 'geojson';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';

const Map = ({
  apiKey,
  countries,
  cities,
}: {
  apiKey: string;
  countries: (Country & { countryGEOJSON: CountryGEOJSON })[];
  cities: (City & { cityMaster: CityMaster })[];
}) => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${apiKey}`}
      />
      {cities?.length &&
        cities.map((i) => {
          return (
            <Marker key={i.id} position={[i.cityMaster.lat, i.cityMaster.lon]}>
              <Popup>{i.name}</Popup>
            </Marker>
          );
        })}
      {countries?.length ? (
        countries.map((i, idx) => {
          return (
            <GeoJSON
              key={idx}
              data={i.countryGEOJSON.geoJson as unknown as GeoJsonObject}
            ></GeoJSON>
          );
        })
      ) : (
        <></>
      )}
    </MapContainer>
  );
};

export default Map;
