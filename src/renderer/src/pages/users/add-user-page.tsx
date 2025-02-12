import { Link, useNavigate } from 'react-router'
import { createUser, getRoles } from '../../services/userService'
import { addNew, setRoles } from '../../store/userSlice'
import { IRole, IUser } from '../../type'
import { useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { toast, ToastContainer } from 'react-toastify'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { setInformationMessage, setSuccess } from '../../store/informationSlice'

function AddUserPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const token: string | null = useAppSelector((state) => state.user.token)
  const roles: IRole[] = useAppSelector((state) => state.user.roles)

  const [selectedRole, setSelectedRole] = useState<number | string>()
  const [loading, setLoading] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmed, setPasswordConfirmed] = useState("")

  useEffect(() => {
    loadRoles(token)
  }, [])

  const loadRoles = async (t: string | null): Promise<void> => {
    try {
      const res = await getRoles(t)
      dispatch(setRoles(res.data as IRole[]))
    } catch (e) {
      console.log(e)
    }
  }

  const onHandleAdd = async (): Promise<void> => {

    if (password !== passwordConfirmed) {
      console.log("Vérifier les mots de passe")
      return
    }

    try {
      setLoading(true)

      const user: IUser = {
        last_name: lastName,
        first_name: firstName,
        role_id: selectedRole as number,
        email: email,
        login: email,
        password: password
      }

      const res = await createUser(token, user)
      dispatch(addNew(res.data as IUser))
      dispatch(setSuccess("Utilisateur ajouté avec succés !"))
      dispatch(setInformationMessage("Utilisateur ajouté avec succés !"))
      navigate("/dash/users")

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
            Ajout d'un nouvel utilisateur
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Veuillez remplir le formulaire
          </p>
        </div>
        <div className="flex  justify-end ">
          <Link to="/dash/users" className="btn btn-md ml-2">
            Fermer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 flex gap-4 mb-4 items-center justify-center ">
        <div className="w-2/3 h-64 mx-auto px-12">
          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
            Rôle (Type d'Utilisateur)
          </p>
          <select
            onChange={(e) => setSelectedRole(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value=""></option>
            {roles.map((role) => (
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="utilisateur@mail.com"
            className="input input-bordered w-full"
          />

          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">Nom</p>
          <input type="text" placeholder="John" className="input input-bordered w-full" onChange={(e) => setLastName(e.target.value)} />

          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">Prénom</p>
          <input type="text" placeholder="John" className="input input-bordered w-full " onChange={(e) => setFirstName(e.target.value)} />

          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
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

          <div className="flex justify-between mt-2">
            <Link to="/dash/users" className="btn btn-md">
              Annuler
            </Link>

            {!loading && (
              <button onClick={onHandleAdd} className="btn btn-md bg-app-primary text-white text-base">Enregister</button>
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

export default AddUserPage
