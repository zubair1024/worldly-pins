import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import axios from 'axios';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const Map = ({ apiKey }: { apiKey: string }) => {
  const [countriesGeoJSON, setCountriesGeoJSON] = useState<
    | {
        features: any[];
      }
    | undefined
  >(undefined);

  useEffect(() => {
    axios.get('/countries.geojson').then((res) => {
      console.log(res.data);
      if (res.data.features.length) {
        setCountriesGeoJSON(res.data);
      }
    });
  }, []);

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${apiKey}`}
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      {/* {countriesGeoJSON && <GeoJSON data={countriesGeoJSON} />} */}
      {countriesGeoJSON ? (
        countriesGeoJSON.features.map((i, idx) => {
          return <GeoJSON key={idx} data={i}></GeoJSON>;
        })
      ) : (
        <></>
      )}
    </MapContainer>
  );
};

export default Map;
