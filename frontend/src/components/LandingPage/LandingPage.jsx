import { useCallback, useState } from 'react';
import RouteForm from '../RouteForm/RouteForm.jsx';
import RouteMap from '../RouteMap/RouteMap.jsx';
import { fetchRoute, geocode } from '../../utils/api.js';
import './LandingPage.css';

export default function LandingPage() {
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [fromCoord, setFromCoord] = useState(null);
  const [toCoord, setToCoord] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [durationMin, setDurationMin] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const plotRoute = useCallback(async () => {
    if (!fromText.trim() || !toText.trim()) {
      setStatus('error');
      setErrorMsg('Enter both a start and stop address');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const [from, to] = await Promise.all([geocode(fromText), geocode(toText)]);
      const route = await fetchRoute(from, to);
      setFromCoord(from);
      setToCoord(to);
      setRouteCoords(route.coords);
      setDistanceKm(route.distanceKm);
      setDurationMin(route.durationMin);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong');
    }
  }, [fromText, toText]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-name">TRAFFIC PREDICTOR</span>
        </div>
        <span className="brand-meta">DELHI · ROUTE ENGINE</span>
      </header>

      <main className="landing-main">
        <RouteForm
          fromText={fromText}
          toText={toText}
          onFromChange={setFromText}
          onToChange={setToText}
          onSubmit={plotRoute}
          status={status}
          errorMsg={errorMsg}
          distanceKm={distanceKm}
          durationMin={durationMin}
        />
        <RouteMap fromCoord={fromCoord} toCoord={toCoord} routeCoords={routeCoords} />
      </main>
    </div>
  );
}