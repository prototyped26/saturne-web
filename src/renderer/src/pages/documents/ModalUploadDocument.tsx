import {  useRef, useState } from 'react'
import { IFolder } from '../../type'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { loadDocuments } from '@renderer/services/documentService'

type Props = {
  token: string,
  parent: IFolder | null,
  success: (m) => void,
  error: (m) => void,
  reload: (page: number) => void
}

function ModalUploadDocument({ token, success, error, reload, parent}: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)


  const onHandleImport = async (): Promise<void> => {
    if (file) {
      setLoading(true)

      const data = new FormData()
      data.append('file', file)
      try {
        await loadDocuments(token, data, parent !== null ? (parent?.id as number) : 0)
        success('Rapport chargé avec succès ! ')
        reload(1)
        document?.getElementById('close-modal')?.click()
      } catch (e) {
        error(getMessageErrorRequestEx(e))
      } finally {
        setLoading(false)
      }
    }
   
  }

  const onFileChange = (e): void => {
    setFile(e.target.files[0])
  }

  const onCloseModal = (): void => {
   
  }

  return (
    <dialog id="modal-load-document" className="modal">
      <div className="modal-box max-w-3xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button onClick={onCloseModal} id="close-modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg ">Charger un document.</h3>

        <div className="flex w-full mt-2">
          <div className="w-full flex gap-2">
            <input
                type="file"
                ref={inputRef}
                onChange={(e) => onFileChange(e)}
                className="file-input file-input-bordered w-full max-w-xs"
                />
             {!loading && (
                  <button
                    id="non-btn"
                    onClick={() => onHandleImport()}
                    className="btn btn-md bg-app-primary  text-white"
                  >
                    Charger les fichiers
                  </button>
                )}
                {loading && (
                  <button id="non-btn" className="btn btn-md btn-disabled text-white">
                    <span className="loading loading-spinner"></span>
                    Traitement...
                  </button>
                )}
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

export default ModalUploadDocument
