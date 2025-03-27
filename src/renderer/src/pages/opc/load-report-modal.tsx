import { useState } from 'react'
import { IIntermediary, IOpc, IPeriodicity, IWeek } from '../../type'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { generateReportAnalyze, loadReportOpc, loadReportSgo } from '../../services/opcService'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '../../store/store'

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

  const periodicities: IPeriodicity[] = useAppSelector((state) => state.system.periodicities)

  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const onHandleImport = async (): Promise<void> => {
    console.log(currentWeek)
    setLoading(true)
    try {
      if (file) {
        const data = new FormData()
        data.append('file', file)

        const periodId: number = Number(selectedPeriod)

        if (selectedType === "opc") {
          const res = await loadReportOpc(token, data, periodId)
          const opc = res.data as IOpc
          await analyzeReport(opc?.id as number)
        }

        if (selectedType === "sgo") {
          await loadReportSgo(token, data, periodId)
        }
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
        <p className="py-4">Le fichier doit être conforme aux exigéances du comité.</p>

        <p className="py-2">Choix du type de rapport à charger</p>
        <select
          className="select select-bordered mb-2 w-2/3"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option></option>
          <option value="opc">Rapport OPC</option>
          <option value="sgo">Rapport SGO</option>
        </select>

        <p className="py-2">Choisir une Périodicité du rapport</p>
        <select
          className="select select-bordered mb-2 w-2/3"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option></option>
          {periodicities.map((periodicity) => (
            <option key={(periodicity?.id as number) + Math.random()} value={periodicity.id}>
              {' '}
              {periodicity.label}
            </option>
          ))}
        </select>

        <div className="flex w-full py-2 justify-between">
          {selectedType.length > 0 && selectedPeriod.length > 0 && (
            <div>
              <input
                type="file"
                onChange={(e) => onFileChange(e)}
                className="file-input file-input-bordered w-full max-w-xs"
              />
              {!loading && (
                <button
                  id="non-btn"
                  onClick={() => onHandleImport()}
                  className="btn btn-md bg-app-primary mt-2 text-white"
                >
                  Charger
                </button>
              )}
              {loading && (
                <button id="non-btn" className="btn btn-md btn-disabled mt-2 text-white">
                  <span className="loading loading-spinner"></span>
                  Traitement
                </button>
              )}
            </div>
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
