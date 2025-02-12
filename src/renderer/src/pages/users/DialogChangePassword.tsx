import { toast, ToastContainer } from 'react-toastify'
import { useState } from 'react'
import { IChangePassword, IUser } from '../../type'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { changePasswordUser } from '../../services/userService'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '../../store/store'

type Props = {
  user: IUser | null
}

function DialogChangePassword({ user }: Props): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const token: string | null = useAppSelector((state) => state.user.token)

  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirmed, setPasswordConfirmed] = useState('')

  const onHandleChange = async (): Promise<void> => {

    if (password !== passwordConfirmed) {
      toast.error("Les mots ne sont pas identiques", {
        theme: 'colored'
      })
      return
    }

    try {
      setLoading(true)
      const data: IChangePassword = {
        new_password: password,
        confirm_password: passwordConfirmed
      }

      await changePasswordUser(token, user?.id as number, data)
      toast.success("Mot de passe modifié avec success ! ", {
        theme: 'colored'
      })
      setTimeout(() => document?.getElementById('password-cancel-btn')?.click(), 1500)
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="modal-password" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Modifier le mot de passe</h3>
        <p className="py-2">
          Utilisateur <b>{user?.email}</b>
        </p>
        <p className="tracking-tight font-light text-1xl mb-1 text-app-sub-title">
          Mot de passe (Définir un mot de passe)
        </p>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="**********"
          className="input input-bordered w-full "
        />

        <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
          Confirmer le mot de passe
        </p>
        <input
          type="password"
          onChange={(e) => setPasswordConfirmed(e.target.value)}
          placeholder="**********"
          className="input input-bordered w-full "
        />

        <div className="flex justify-end mt-4">
          <form method="dialog">
            <button id="password-cancel-btn" className="btn btn-sm">
              Annuler
            </button>
          </form>
          {loading && (
            <button className="btn btn-sm text-white text-base bg-app-primary ml-2">
              <span className="loading loading-spinner"></span>
            </button>
          )}

          {!loading && (
            <button
              onClick={onHandleChange}
              className="btn btn-sm bg-app-primary ml-2 font-bold text-white"
            >
              Modifier
            </button>
          )}
        </div>
      </div>

      <ToastContainer />
    </dialog>
  )
}

export default DialogChangePassword
