import { useState } from 'react'
import { IIntermediary, IOpc, IWeek, IYear } from '../../type'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { generateReportAnalyze, loadWeekReport } from '../../services/opcService'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import moment from 'moment'

type Props = {
  token: string,
  sgo?: IIntermediary[],
  currentWeek: IWeek,
  success: (m) => void,
  error: (m) => void,
  reload: (page: number) => void
}

function LoadReportModal({ token, success, error, currentWeek, reload }: Props): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

  const currentYear: IYear | null = useAppSelector((state) => state.system.currentYear)
  const weeks: IWeek[] = useAppSelector((state) => state.system.weeks)

  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [selectedWeek, setSelectedWeek] = useState('')

  const onHandleImport = async (): Promise<void> => {
    setLoading(true)
    try {
      if (file) {
        const data = new FormData()
        data.append('file', file)

        const weekId: number = selectedWeek.length === 0 ? currentWeek.id as number : Number(selectedWeek)

        const res = await loadWeekReport(token, data, weekId)
        const opc = res.data as IOpc
        await analyzeReport(opc?.id as number)
        reload(1)
        success("Rapport chargé avec succès ! ")
      }
      document?.getElementById("close-btn-up-report")?.click()
    } catch (e) {
      error(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  const onFileChange = (e): void => {
    setFile(e.target.files[0])
  }

  const analyzeReport = async (id: number): Promise<void> => {
    await generateReportAnalyze(token as string, id)
  }

  // @ts-ignore hello
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

        <p className="py-4">
          Choisir une Période dans la liste des Semaines de l&#39;année <b>{currentYear?.label}</b>
        </p>
        <select className="select select-bordered mb-2" value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
          <option></option>
          {weeks.map((week) => (
            <option key={(week?.id) as number + Math.random()} value={week.id}> {week.label} {' : Du ' + moment(week.start).format('DD MMM YYYY') + ' au ' + moment(week.end).format('DD MMM YYYY')}</option>
          ))}
        </select>

        <div className="flex w-full py-2 justify-between">
          <input
            type="file"
            onChange={(e) => onFileChange(e)}
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
