import { toast, ToastContainer } from 'react-toastify'
import { Link } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IRole, IUser } from '../../type'
import { useState } from 'react'
import { updateUser } from '../../services/userService'
import { updateElt } from '../../store/userSlice'
import { getMessageErrorRequestEx } from '../../utils/errors'

function UpdateUserPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const roles: IRole[] = useAppSelector((state) => state.user.roles)
  const user: IUser | null = useAppSelector((state) => state.user.user)

  const [loading, setLoading] = useState(false)

  const [selectedRole, setSelectedRole] = useState<string | number>('' + user?.role?.id)
  const [firstName, setFirstName] = useState(user?.first_name)
  const [lastName, setLastName] = useState(user?.last_name)
  const [email, setEmail] = useState(user?.email)

  const onHandleChange = async (): Promise<void> => {
    try {
      setLoading(true)

      const data: IUser = {
        last_name: lastName as string,
        first_name: firstName as string,
        role_id: selectedRole as number,
        email: email as string,
        login: email
      }

      const res = await updateUser(token, user?.id as number, data)
      dispatch(updateElt(res.data as IUser))
      toast.success("Mise à jour de l'utilisateur réussié ! ", {
        theme: 'colored'
      })
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 h-full p-6 mb-4 z-20">
      <ToastContainer />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">
            Modification : <b>{user?.email}</b>
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Veuillez remplir le formulaire
          </p>
        </div>
        <div className="flex  justify-end ">
          <Link to="/dash/users" className="btn btn-md ml-2">
            Retour
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 flex gap-4 mb-4 items-center justify-center ">
        <div className="w-2/3 h-64 mx-auto px-12">
          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
            Rôle (Type d'Utilisateur)
          </p>
          <select
            value={'' + selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value=""></option>
            {roles?.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label.toUpperCase()}
              </option>
            ))}
          </select>

          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
            Adresse email
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="utilisateur@mail.com"
            className="input input-bordered w-full"
          />

          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">Nom</p>
          <input type="text" value={lastName} placeholder="John" className="input input-bordered w-full"
                 onChange={(e) => setLastName(e.target.value)} />

          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">Prénom</p>
          <input type="text" value={firstName} placeholder="John" className="input input-bordered w-full "
                 onChange={(e) => setFirstName(e.target.value)} />

          <div className="flex justify-between mt-2">
            <Link to="/dash/users" className="btn btn-md">
              Annuler
            </Link>

            {!loading && (
              <button onClick={onHandleChange}
                      className="btn btn-md bg-app-primary text-white text-base">Enregister</button>
            )}

            {loading && (
              <button className="btn bg-app-primary text-white text-base btn-disabled">
                <span className="loading loading-spinner"></span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateUserPage
