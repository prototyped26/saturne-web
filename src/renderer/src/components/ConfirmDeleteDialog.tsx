import { useState } from 'react'
import { getMessageErrorRequestEx } from '../utils/errors'
import { toast, ToastContainer } from 'react-toastify'

type Props = {
  content: string,
  action: () => void
}

function ConfirmDeleteDialog({ content, action }: Props): JSX.Element {

  const [loading, setLoading] = useState(false)

  const onHandleDelete = async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await action()
      toast.success("Action effectuée avec success ! ", {
        theme: 'colored'
      })
      setTimeout(() => document?.getElementById('non-btn')?.click(), 1500)
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
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
            <button id="non-btn" className="btn btn-sm">NON</button>
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

      <ToastContainer />
    </dialog>
  )
}

export default ConfirmDeleteDialog
