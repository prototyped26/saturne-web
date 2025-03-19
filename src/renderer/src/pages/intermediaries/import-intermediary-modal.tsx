import { downloadTemplateIntermediary } from '../../services/fileService'
import { getMessageErrorRequestEx } from '../../utils/errors'
import fileDownload from 'js-file-download'
import { useState } from 'react'
import { importIntermediaries } from '../../services/intermediaryService'
import { IIntermediary } from '../../type'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { addIntermediaries } from '../../store/intermediarySlice'

type Props = {
  token: string;
  onSuccess: (m: string) => void,
  onError: (m: string) => void
}

function ImportIntermediaryModal({ token, onError, onSuccess }: Props): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const [downloaded, setDownloaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const onHandleDownloadTemplate = async (e): Promise<void> => {
    e.preventDefault()
    setDownloaded(true)
    try {
      const res = await downloadTemplateIntermediary()
      fileDownload(res.data, 'template_importations_intermediaires.xlsx')
    } catch (e) {
      onError(getMessageErrorRequestEx(e))
    } finally {
      setDownloaded(false)
    }
  }

  const onHandleImport = async (): Promise<void> => {
    setLoading(true)
    try {
      if (file) {
        const data = new FormData()
        data.append('file', file)

        const res = await importIntermediaries(token, data)

        const list = res.data as IIntermediary[]
        dispatch(addIntermediaries(list))
        setFile(null)
        onSuccess("Ajout réussi de " + list.length + " d'intermédiaires.")
        document?.getElementById("close-up-intermediaries")?.click()
      }
    } catch (e) {
      onError(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  const onFileChange = (e): void => {
    setFile(e.target.files[0])
  }

  return (
    <dialog id="modal-import-intermediary" className="modal">
      <div className="modal-box max-w-3xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button id="close-up-intermediaries" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg ">Importation en masse des intermédiaires</h3>
        <p className="py-4">
          Cette opération se fait via un fichier Excel sous un format spécifique, Téléchargez le
          fichier et le remplir suivant les valeurs du tableau
        </p>
        <p>
          {downloaded && <span className="loading loading-spinner"></span>}
          {!downloaded && (
            <a href="" className="italic" onClick={(e) => onHandleDownloadTemplate(e)}>
              Template Excel (Télécharger le fichier template ici.)
            </a>
          )}
        </p>
        <div role="alert" className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-info "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span className="underline">Important </span>
          <span className="">La catégorie de l'intermédiaire (colonne 1 ou A) doit obligatoirement figurer dans la liste suivante  :  <label className="font-bold">Sociétés de Gestion d'OPC, Dépositaires d'Organismes de Placement Collectif, Commissaires aux Comptes</label> </span>
        </div>
        <div className="flex w-full py-2 justify-between">
          <input
            type="file"
            onChange={(e) => onFileChange(e)}
            className="file-input file-input-bordered w-full max-w-xs"
          />
          {!loading && (
            <button
              id="non-btn"
              onClick={() => onHandleImport()}
              className="btn btn-md bg-app-primary ml-2 text-white"
            >
              IMPORTER
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
            <button id="non-btn" className="btn btn-sm">
              Fermer
            </button>
          </form>
        </div>
      </div>

    </dialog>
  )
}

export default ImportIntermediaryModal
