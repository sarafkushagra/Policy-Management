export function PanelHeading({ icon, title }) {
  return <div className="panelHeading">{icon}<h3>{title}</h3></div>;
}

export function FormGrid({ children }) {
  return <div className="formGrid">{children}</div>;
}

export function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}
