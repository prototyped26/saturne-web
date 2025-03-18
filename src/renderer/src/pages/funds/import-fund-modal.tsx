import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { useState } from 'react'
import { downloadTemplateFund } from '../../services/fileService'
import { getMessageErrorRequestEx } from '../../utils/errors'
import fileDownload from 'js-file-download'
import { addFunds } from '../../store/fundSlice'
import { importFunds } from '../../services/fundService'
import { IFund } from '../../type'

type Props = {
  token: string
  action: (e) => void,
  error: (e) => void
}

function ImportFundModal({ token, action, error }: Props): JSX.Element {
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
      const res = await downloadTemplateFund()
      fileDownload(res.data, 'template_importation_fonds.xlsx')
    } catch (e) {
      error(getMessageErrorRequestEx(e))
    } finally {
      setDownloaded(false)
    }
  }

  const onHandleImportFund = async (): Promise<void> => {
    setLoading(true)
    try {
      if (file) {
        const data = new FormData()
        data.append('file', file)

        const res = await importFunds(token, data)

        const list = res.data as IFund[]
        dispatch(addFunds(list))
        setFile(null)
        action("Ajout réussi de " + list.length + " fonds.")
      }
      //toast.success("Ajout réussi de " + list.length + " fonds.", { theme: 'colored' })
    } catch (e) {
      error(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  const onFileChange = (e): void => {
    setFile(e.target.files[0])
  }

  return (
    <dialog id="modal-import-fund" className="modal">
      <div className="modal-box">
        <form id="form-modal-fund" method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg ">Importation en masse des fonds</h3>
        <p className="py-4">
          Cette opération se fait via un fichier Excel sous un format spécifique, Téléchargez le
          fichier et le remplir suivant les valeurs du tableau
        </p>
        <p>
          {downloaded && <span className="loading loading-spinner"></span>}
          {!downloaded && (
            <a href="" onClick={(e) => onHandleDownloadTemplate(e)}>
              Template Excel (Télécharger le fichier template ici.)
            </a>
          )}
        </p>
        <div className="flex w-full py-2 justify-between">
          <input
            type="file"
            onChange={(e) => onFileChange(e)}
            className="file-input file-input-bordered w-full max-w-xs"
          />
          {!loading && (
            <button id="non-btn" onClick={() => onHandleImportFund()} className="btn btn-md bg-app-primary ml-2 text-white">
              IMPORTER
            </button>
          )}
          {loading && (
            <button className="btn btn-md btn-disabled ml-2 text-white">
              <span className="loading loading-spinner"></span>
              Traitement
            </button>
          )}
        </div>
        <div className="flex justify-end">
          <form id="form-modal-fund-2" method="dialog">
            <button id="non-btn" className="btn btn-sm">
              Fermer
            </button>
          </form>
        </div>
      </div>

    </dialog>
  )
}

export default ImportFundModal
