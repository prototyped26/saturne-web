import { useState } from 'react'
import { IIntermediary, IOpc, IWeek } from '../../type'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { generateReportAnalyze, loadWeekReport } from '../../services/opcService'

type Props = {
  token: string,
  sgo?: IIntermediary[],
  currentWeek: IWeek,
  success: (m) => void,
  error: (m) => void,
  reload: () => void
}

function LoadReportModal({ token, success, error, currentWeek, reload }: Props): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<any>(null)

  const onHandleImport = async (): Promise<void> => {
    setLoading(true)
    try {
      const data = new FormData()
      data.append('file', file)

      const res = await loadWeekReport(token, data, currentWeek.id as number)
      const opc = res.data as IOpc
      await analyzeReport(opc?.id as number)
      reload()
      success("Rapport chargé avec succès ! ")
      document?.getElementById("close-btn-up-report")?.click()
    } catch (e) {
      error(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  const analyzeReport = async (id: number): Promise<void> => {
    await generateReportAnalyze(token as string, id)
  }

  return (
    <dialog id="modal-load-report-opc" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg ">Charger un repport hebdo.</h3>
        <p className="py-4">
          Le fichier doit être conforme aux exigéances du comité.
        </p>

        <div className="flex w-full py-2 justify-between">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input file-input-bordered w-full max-w-xs"
          />
          {!loading && (
            <button id="non-btn" onClick={() => onHandleImport()} className="btn btn-md bg-app-primary ml-2 text-white">
              Charger
            </button>
          )}
          {loading && (
            <button id="non-btn" className="btn btn-md btn-disabled ml-2 text-white">
              <span className="loading loading-spinner"></span>
              Traitement
            </button>
          )}
        </div>
        <div className="flex justify-end">
          <form method="dialog">
            <button id="close-btn-up-report" className="btn btn-sm">
              Fermer
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default LoadReportModal
