import { useEffect, useRef, useState } from 'react'
import { IDepository, IFileElement, IIntermediary, IOpc, IPeriodicity, IWeek } from '../../type'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { generateReportAnalyze, loadReportOpc, loadReportSgo } from '../../services/opcService'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { FiCheck, FiTrash } from 'react-icons/fi'

type Props = {
  token: string,
  sgo?: IIntermediary[],
  currentWeek: IWeek,
  depositaires: IDepository[],
  success: (m) => void,
  error: (m) => void,
  reload: (page: number) => void
}

function LoadReportModal({ token, success, error, currentWeek, reload, depositaires }: Props): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

  const periodicities: IPeriodicity[] = useAppSelector((state) => state.system.periodicities)

  const inputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<IFileElement[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [others, setOthers] = useState<string[]>([])
  const [selectedDepositary, setSelectedDepositary] = useState("")
  const [isDepositary, setIsDepositary] = useState(false)
  const [reportType, setReportType] = useState("")

  useEffect(() => {
    setOthers(["Patrimoine (Contexte Financier)", "porteurs de parts", "souscriptions/rachats", "acquisitions", "cessions"])
  }, [])

  useEffect(() => {
    //console.log(selectedType)
    if (selectedType.toLowerCase().includes("positaire")) setIsDepositary(true)
    else setIsDepositary(false)
  }, [selectedType])

  const onHandleImport = async (): Promise<void> => {
    setLoading(true)

    for (const f of files) {
      if (f.file) {
        const data = new FormData()
        data.append('file', f.file)
        const newArr = [...files]

        const periodId: number = Number(selectedPeriod)

        try {
          if (f.type === 'opc') {
            const res = await loadReportOpc(token, data, periodId)
            const opc = res.data as IOpc
            await analyzeReport(opc?.id as number)
          }
          if (f.type === 'sgo') {
            await loadReportSgo(token, data, periodId, 0)
          }
          if (f.type === 'depositaire') {
            if (selectedDepositary.length > 0) await loadReportSgo(token, data, periodId, Number.parseInt(selectedDepositary))
            else error(getMessageErrorRequestEx("Veuillez selectionner le dépositaire."))
          }
          f.success = true
        } catch (e) {
          f.success = false
          f.observation = getMessageErrorRequestEx(e)
          error(getMessageErrorRequestEx(e))
        } finally {
          f.loading = true
        }

        const index = files.findIndex((elt) => elt.ligne === f.ligne)
        if (index >= 0) {
          newArr[index] = f
          setFiles(newArr)
        }
      }
    }

    setLoading(false)
    reload(1)
    success('Rapport chargé avec succès ! ')
    //document?.getElementById('close-btn-up-report')?.click()
  }

  const onFileChange = (e): void => {
    //setFile(e.target.files[0])
    const filesList = [...e.target.files]
    addFileToList(filesList)
  }

  const analyzeReport = async (id: number): Promise<void> => {
    await generateReportAnalyze(token as string, id)
  }

  const addFileToList = (filesList: File[]): void => {
    const arr: IFileElement[] = []
    filesList.forEach((file) => {
      if (file !== null && files.length <= 20) {
        const index = files.findIndex((f) => f.observation === file.name)
        if (index < 0) {
          const f: IFileElement = {
            loading: false,
            file: file as File,
            ligne: Math.random() * Date.now(),
            observation: '' + file.name,
            type: selectedType,
            success: false
          }
          arr.push(f)
        } 
      } else {
        if (files.length >= 20) {
          error("Il n est pas possible de charger plus de 20 rappports ! ")
        }
      }
    })
    const list = [...files, ...arr]
    //setFiles(list)
    setFiles(list)
  }

  const onHandleRemove = (e, file: IFileElement) : void => {
    e.preventDefault()
    let list = files
    list = list.filter((e) => e.ligne !== file.ligne)
    setFiles(list)
  }

  const onCloseModal = (): void => {
    setFiles([])
  }

  return (
    <dialog id="modal-load-report-opc" className="modal">
      <div className="modal-box max-w-3xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button onClick={onCloseModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg ">Charger un repport hebdo.</h3>
        <p className="py-4">Le fichier doit être conforme aux exigéances du comité.</p>

        <div className="flex w-full">
          <div className="w-1/2">
            <p className="py-2">Choix du type de rapport à charger</p>
            <select
              className="select select-bordered mb-2 w-2/3"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option></option>
              <option value="opc">Rapport OPC</option>
              <option value="sgo">Rapport SGO</option>
              <option value="depositaire">Rapport Dépositaire</option>
            </select>

            {isDepositary && (<div>
              <p className="py-2">Quel est le dépositaire ?</p>
              <select
                className="select select-bordered mb-2 w-2/3"
                value={selectedDepositary}
                onChange={(e) => setSelectedDepositary(e.target.value)}
              >
                <option></option>
                {depositaires.map((deposiraty) =>  <option key={Math.random() * Date.now()} value={deposiraty?.id}>{deposiraty.label}</option>)}
              </select>
            </div>
            )}

            <p className="py-2">Choisir une Périodicité du rapport</p>
            <select
              className="select select-bordered mb-2 w-2/3"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option></option>
              {periodicities.map((periodicity) => (
                <option key={(periodicity?.id as number) + Math.random()} value={periodicity.id}>
                  {periodicity.label}
                </option>
              ))}
            </select>

            <p className="py-2">Choix du type de rapport</p>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="select select-bordered mb-2 w-2/3">
              <option value=""></option>
              {others.map((other) => <option key={Math.random() * Date.now()} value={other}>{other}</option>)}
            </select>

            <div className="flex w-full py-2 justify-between">
              {selectedType.length > 0 && selectedPeriod.length > 0 && reportType.length > 0 && (
                <div>
                  <input
                    type="file"
                    ref={inputRef}
                    multiple
                    onChange={(e) => onFileChange(e)}
                    className="file-input file-input-bordered w-full max-w-xs"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-1/2">
          {files.length > 0 && (
              <div>
                {!loading && (
                  <button
                    id="non-btn"
                    onClick={() => onHandleImport()}
                    className="btn btn-md bg-app-primary mt-2 text-white"
                  >
                    Charger les fichiers
                  </button>
                )}
                {loading && (
                  <button id="non-btn" className="btn btn-md btn-disabled mt-2 text-white">
                    <span className="loading loading-spinner"></span>
                    Traitement...
                  </button>
                )}
              </div>
            )}
            {files.map((file) => (
              <p key={file.ligne} className="flex justify-between">
                <label className={!file.success ? 'text-red-600' : 'flex'}>
                {file.loading && file.success && (<FiCheck color="#046c4e"/>)}
                {' ' + file.file.name}
                {loading && !file.loading && (<span className="loading loading-spinner loading-xs"></span>)}
                {file.loading && !file.success && (<span className="text-sm">{' : ' + file.observation}</span>)}
                </label>
                {!file.loading && (
                  <a href="#!"
                    onClick={(e) => onHandleRemove(e, file)}
                    className="ml-2 font-bold text-red-700"
                  >
                    <FiTrash />
                  </a>
                )}
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <form method="dialog">
            <button id="close-btn-up-report" onClick={onCloseModal} className="btn btn-sm">
              Fermer
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default LoadReportModal
