import { useCallback, useState } from 'react';
import RouteForm from '../RouteForm/RouteForm.jsx';
import RouteMap from '../RouteMap/RouteMap.jsx';
import { fetchRoute, geocode } from '../../utils/api.js';
import './LandingPage.css';
import { extractKnownArea } from '../../utils/extract.js';
import { predict } from '../../utils/predict.js';

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
  const [predictedDuration, setPredictedDuration] = useState(null);

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

      const fromArea = await extractKnownArea(fromText);
      const toArea = await extractKnownArea(toText);
      const predicted = await predict(fromArea, toArea, route.distanceKm);
      setPredictedDuration(predicted); 

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
          durationMin={predictedDuration}
        />
        <RouteMap fromCoord={fromCoord} toCoord={toCoord} routeCoords={routeCoords} />
      </main>
    </div>
  );
}