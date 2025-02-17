import { useEffect } from 'react'

type Props = {
  loading: boolean
}

function GlobalLoadingDialog({ loading }: Props): JSX.Element {

  useEffect(() => {
    console.log(loading)
    if (!loading) {
      document?.getElementById('btn-close-modal-loading')?.click()
    }
  }, [loading])

  return (
    <dialog id="modal-loading" className="modal">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button
          id="btn-close-modal-loading"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>
      <div className="flex flex-row items-center justify-center">
        <span className="loading loading-spinner"></span>
      </div>
    </dialog>
  )
}

export default GlobalLoadingDialog
