import { useState } from 'react'
import { getMessageErrorRequestEx } from '../utils/errors'
import { toast, ToastContainer } from 'react-toastify'

type Props = {
  content: string,
  action: () => void,
  success: (e) => void,
  error: (e) => void
}

function ConfirmDeleteDialog({ content, action, success, error }: Props): JSX.Element {

  const [loading, setLoading] = useState(false)

  const onHandleDelete = async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await action()
      success("Action effectuée avec success !")
      setTimeout(() => document?.getElementById('non-btn-del')?.click(), 200)
    } catch (e) {
      error(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-error">Attention !</h3>
        <p className="py-4">Confirmez-vous la suppréssion <b>{content}</b> </p>
        <div className="flex justify-end">
          <form method="dialog">
            <button id="non-btn-del" className="btn btn-sm">NON</button>
          </form>
          {loading && (
            <button className="btn btn-sm text-white text-base btn-error ml-2">
              <span className="loading loading-spinner"></span>
            </button>
          )}

          {!loading && (
            <button onClick={onHandleDelete} className="btn btn-sm btn-error ml-2 font-bold text-white">OUI</button>
          )}

        </div>
      </div>
    </dialog>
  )
}

export default ConfirmDeleteDialog
