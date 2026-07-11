import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { DELHI_CENTER } from '../../utils/constants.js';
import 'leaflet/dist/leaflet.css';
import './RouteMap.css';

function pinIcon(className) {
  return divIcon({
    className: '',
    html: `<span class="map-pin ${className}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function FitToRoute({ fromCoord, toCoord, routeCoords }) {
  const map = useMap();

  useEffect(() => {
    if (routeCoords?.length) {
      map.fitBounds(routeCoords, { padding: [56, 56] });
    } else if (fromCoord && toCoord) {
      map.fitBounds(
        [
          [fromCoord.lat, fromCoord.lon],
          [toCoord.lat, toCoord.lon],
        ],
        { padding: [56, 56] }
      );
    }
  }, [fromCoord, toCoord, routeCoords, map]);

  return null;
}

export default function RouteMap({ fromCoord, toCoord, routeCoords }) {
  return (
    <div className="route-map">
      <MapContainer
        center={DELHI_CENTER}
        zoom={12}
        scrollWheelZoom
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />

        {fromCoord && <Marker position={[fromCoord.lat, fromCoord.lon]} icon={pinIcon('map-pin-start')} />}
        {toCoord && <Marker position={[toCoord.lat, toCoord.lon]} icon={pinIcon('map-pin-end')} />}

        {routeCoords && (
          <>
            <Polyline
              key={`glow-${routeCoords.length}`}
              positions={routeCoords}
              pathOptions={{ className: 'route-line-glow', color: '#2dd4ff', weight: 9, opacity: 0.45 }}
            />
            <Polyline
              key={`core-${routeCoords.length}`}
              positions={routeCoords}
              pathOptions={{ className: 'route-line-core', color: '#7ee8ff', weight: 3.5, opacity: 0.95 }}
            />
          </>
        )}

        <FitToRoute fromCoord={fromCoord} toCoord={toCoord} routeCoords={routeCoords} />
      </MapContainer>
      <p className="route-map-attribution">© OpenStreetMap · © CARTO</p>
    </div>
  );
}