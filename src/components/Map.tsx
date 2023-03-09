import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

import { GeoJsonObject } from 'geojson';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';

const Map = ({
  apiKey,
  countriesGeoJSON,
}: {
  apiKey: string;
  countriesGeoJSON: GeoJsonObject[] | undefined;
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
      {/* <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}
      {/* {countriesGeoJSON && <GeoJSON data={countriesGeoJSON} />} */}
      {countriesGeoJSON ? (
        countriesGeoJSON.map((i, idx) => {
          return <GeoJSON key={idx} data={i}></GeoJSON>;
        })
      ) : (
        <></>
      )}
    </MapContainer>
  );
};

export default Map;
