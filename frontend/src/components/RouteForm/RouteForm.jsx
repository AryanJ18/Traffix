import './RouteForm.css';

export default function RouteForm({
  fromText,
  toText,
  onFromChange,
  onToChange,
  onSubmit,
  status,
  errorMsg,
  distanceKm,
  durationMin,
}) {
  const loading = status === 'loading';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit();
  };

  return (
    <section className="route-form" aria-label="Route planner">
      <p className="route-form-eyebrow">ROUTE PLANNER</p>

      <label className="route-field">
        <span>FROM</span>
        <input
          type="text"
          value={fromText}
          onChange={(e) => onFromChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Connaught Place"
        />
      </label>

      <label className="route-field">
        <span>TO</span>
        <input
          type="text"
          value={toText}
          onChange={(e) => onToChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Hauz Khas"
        />
      </label>

      <button type="button" className="route-submit" onClick={onSubmit} disabled={loading}>
        {loading ? 'Plotting…' : 'Plot route →'}
      </button>

      <div className="route-status" role="status">
        {status === 'error' && <p className="route-status-error">{errorMsg}</p>}
        {status === 'success' && (
          <dl className="route-readout">
            <div>
              <dt>Distance</dt>
              <dd>{distanceKm.toFixed(1)} km</dd>
            </div>
            <div>
              <dt>Drive time</dt>
              <dd>{Math.round(durationMin)} min</dd>
            </div>
          </dl>
        )}
        {status === 'idle' && (
          <p className="route-status-hint">Enter two Delhi addresses to plot a route.</p>
        )}
      </div>
    </section>
  );
}