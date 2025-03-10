
type Props = {
  label: string
}

function BadgeRiskString({ label }: Props): JSX.Element {
  if (label.includes("CRITIQUE")) return (<label className="badge badge-error font-bold text-white text-[11px]">{label}</label>)
  if (label.includes("ELEVE")) return (<label className="badge badge-warning font-bold text-white text-[11px]">{label}</label>)
  if (label.includes("MODERE")) return (<label className="badge badge-info font-bold text-white text-[11px]">{label}</label>)
  return (<label className="badge badge-success font-bold text-white text-[11px]">{label}</label>)
}

export default BadgeRiskString
