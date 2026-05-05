import { money } from '../utils/api.js';
import Stat from './Stat.jsx';

export function ClaimTimeline({ claims }) {
  if (!claims.length) return null;
  return (
    <div className="panel">
      <div className="panelHeading"><h3>Claim tracker</h3></div>
      {claims.map(claim => (
        <article className="claimCard" key={claim.id}>
          <div className="itemHeader">
            <div>
              <h3>{claim.claimNumber}</h3>
              <p>{claim.description}</p>
            </div>
            <span className={`status ${claim.status.toLowerCase()}`}>{claim.status}</span>
          </div>
          <div className="statGrid two">
            <Stat label="Amount" value={money(claim.amount)} />
            <Stat label="Incident" value={claim.incidentDate} />
          </div>
          <div className="timeline">
            {claim.history.map(entry => <span key={`${claim.id}-${entry.status}-${entry.at}`}>{entry.status}</span>)}
          </div>
        </article>
      ))}
    </div>
  );
}

export function AdminClaimCard({ claim, onAdvance }) {
  const transitions = {
    Submitted: ['Verified', 'Rejected'],
    Verified: ['Approved', 'Rejected'],
    Approved: ['Disbursed'],
    Rejected: [],
    Disbursed: []
  };
  return (
    <article className="claimReview">
      <div className="itemHeader">
        <div>
          <h3>{claim.claimNumber}</h3>
          <p>Evidence: {claim.evidence.fileName}</p>
        </div>
        <span className={`status ${claim.status.toLowerCase()}`}>{claim.status}</span>
      </div>
      <div className="statGrid two">
        <Stat label="Claim amount" value={money(claim.amount)} />
        <Stat label="Incident date" value={claim.incidentDate} />
      </div>
      <div className="actions">
        {transitions[claim.status].length === 0 ? <span className="subtle">No further actions</span> : transitions[claim.status].map(status => (
          <button key={status} className={status === 'Rejected' ? 'dangerBtn' : 'secondaryBtn'} onClick={() => onAdvance(claim, status)}>
            {status}
          </button>
        ))}
      </div>
    </article>
  );
}
