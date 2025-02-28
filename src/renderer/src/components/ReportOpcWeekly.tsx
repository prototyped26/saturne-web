import { IOpc, IReportNote } from '../type'
import { useEffect, useState } from 'react'
import { getReportResult } from '../services/opcService'

type Props = {
  token: string,
  opc: IOpc
}

function ReportOpcWeekly({ token, opc }: Props): JSX.Element {

  useEffect(() => {
    loadResult()
  }, [])

  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<IReportNote[]>([])

  const loadResult = async (): Promise<void> => {
    const res = await getReportResult(token, opc?.id as number)
    setResult(res.data as IReportNote[])
    setLoading(false)
  }

  return (
    <div>
      {loading && <span className="loading loading-spinner"></span>}
      {!loading && (
        <div>
          <div className="stats shadow">
            {result.map((note) => (
              <div key={Math.random() + Math.random()} className="stat place-items-center">
                <div className="stat-title text-[14px]">{note.label}</div>
                <div className="stat-value text-xs">{note.notation} %</div>
                <div className="stat-desc text-[11px]">{note.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportOpcWeekly
