import { createFolders } from "@renderer/services/documentService"
import { IFolder } from "@renderer/type"
import { getMessageErrorRequestEx } from "@renderer/utils/errors"
import { useState } from "react"

type Props = {
  token: string,
  parent: IFolder | null,
  success: (m) => void,
  error: (m) => void,
  reload: (folder: number) => void
}

function ModalCreateFolder({ token, parent, success, error, reload }: Props): JSX.Element {

    const [label, setLabel] = useState("")
    const [loading, setLoading] = useState(false)


    const onHandleCreate = async (): Promise<void> => {
        if (label.length === 0) {
            return
        }
        const data: IFolder = {
            label: label,
            created_at: "",
            path: "",
        }
        setLoading(true)
        try {
            await createFolders(token, parent === null ? 0 : parent?.id as number, data);
            success("Dossier crée !")
            setLabel("")
            reload(1)
            document.getElementById("close-modal")?.click()
        } catch (e) {
            error(getMessageErrorRequestEx(e))
        } finally {
            setLoading(false)
        }
    }

    return(
       <dialog id="modal-create-folder" className="modal">
        <div className="modal-box max-w-3xl">
            <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button id="close-modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
        <h3 className="font-bold text-lg ">Ajouter un dossier</h3>
        <p className="py-4">Le fichier doit être conforme aux exigéances du comité.</p>

        <div className="flex w-full">
        <div className="w-1/2">
            <p className="py-2">Choix du type de rapport à charger</p>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} className="input input-md input-bordered" />

            <div>
                {!loading && (
                 <button
                    id="non-btn"
                    onClick={() => onHandleCreate()}
                    className="btn btn-md bg-app-primary mt-2 text-white"
                    >
                Créer le dossier
                </button>
                )}
                {loading && (
                <button id="non-btn" className="btn btn-md btn-disabled mt-2 text-white">
                    <span className="loading loading-spinner"></span>
                    Traitement...
                </button>
                )}
            </div>

           
        </div>
        </div>

        <div className="flex justify-end">
            <form method="dialog">
            <button id="close-btn-up-report"  className="btn btn-sm">
                Fermer
            </button>
            </form>
        </div>
        </div>
    </dialog>
    )
}

export default ModalCreateFolder
