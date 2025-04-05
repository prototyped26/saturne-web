import { IFileElement, IPeriodicity, IWeek } from '../../type'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useEffect, useState } from 'react'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { loadWeekMandateReport } from '../../services/mandateService'
import { FiCheck, FiTrash } from 'react-icons/fi'

type Props = {
  token: string,
  currentWeek: IWeek,
  success: (m) => void,
  error: (m) => void,
  reload: () => void
}

function LoadMandateModal({ token, currentWeek, success, error, reload }: Props): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

  const periodicities: IPeriodicity[] = useAppSelector((state) => state.system.periodicities)

  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<IFileElement[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('')

  useEffect(() => {
    console.log(currentWeek)
  }, [])

  const onHandleImport = async (): Promise<void> => {
    setLoading(true)

     for (const f of files) {
        if (f.file) {
          const data = new FormData()
          data.append('file', f.file)
          const newArr = [...files]

          const periodId: number = Number(selectedPeriod)

          try {
            await loadWeekMandateReport(token, data, periodId)
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

    try {
      /* if (file) {
        const data = new FormData()
        data.append('file', file )

        const periodId: number = Number(selectedPeriod)

        await loadWeekMandateReport(token, data, periodId)
        reload()
        success("Rapport chargé avec succès ! ")
      }
      document?.getElementById("close-btn-up-mandate")?.click() */
    } catch (e) {
      //error(getMessageErrorRequestEx(e))
    } finally {
      //setLoading(false)
    }
  }

  const onFileChange = (e): void => {
    //setFile(e.target.files[0])
    const filesList = [...e.target.files]
    addFileToList(filesList)
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
              type: '',
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
    <dialog id="modal-load-report-mandate" className="modal">
      <div className="modal-box max-w-3xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button onClick={onCloseModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg ">Charger un repport hebdomadaire du mandat</h3>
        <p className="py-4">
          Le fichier doit être conforme aux exigéances du comité.
        </p>

        <div className="flex w-full gap-4">
          <div className="w-1/2">
          <p className="py-2">Choisir une Périodicité du rapport</p>
          <select
            className="select select-bordered mb-2 w-full"
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
          <input
            type="file"
            multiple
            onChange={(e) => onFileChange(e)}
            className="file-input file-input-bordered w-full"
          />
         
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
            <button id="close-btn-up-mandate" className="btn btn-sm" onClick={onCloseModal}>
              Fermer
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default LoadMandateModal
