export default function PageTitle({ icon, title, copy, action }) {
  return (
    <div className="pageTitle">
      <div className="titleIcon">{icon}</div>
      <div>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      {action && <div className="pageAction">{action}</div>}
    </div>
  );
}
