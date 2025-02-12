import { FiEye, FiMoreHorizontal, FiPlus, FiSearch, FiTrash } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IRole, IUser } from '../../type'
import { deleteUser, getRoles, getUsers } from '../../services/userService'
import { removeElt, selectedUser, setRoles, setUsers } from '../../store/userSlice'
import LoadingTable from '../../components/LoadingTable'
import NoDataList from '../../components/NoDataList'
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog'
import { setInformationMessage, setSuccess } from '../../store/informationSlice'
import AlertNotificationSuccess from '../../components/AlertNotificationSuccess'
import DialogChangePassword from './DialogChangePassword'

function UsersPage(): JSX.Element {
  const navigate = useNavigate()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const users: IUser[] = useAppSelector((state) => state.user.users)
  const roles: IRole[] = useAppSelector((state) => state.user.roles)

  const message: string | null = useAppSelector((state) => state.information.message)
  const success: string | null = useAppSelector((state) => state.information.success)

  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<number|string|null>(null)
  const [contentDelete, setContentDelete] = useState("")
  const [toDelete, setToDelete] = useState<IUser | null>(null)
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    loadRoles(token)
    loadUsers(token)
  }, [])

  useEffect(() => {
    if (success !== null) setTimeout(() => dispatch(setSuccess(null)), 5000)
  }, [success])

  const loadUsers = async (t: string | null): Promise<void> => {
    try {
      const res = await getUsers(t)
      dispatch(setUsers(res.data as IUser[]))
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async (t: string | null): Promise<void> => {
    try {
      const res = await getRoles(t)
      dispatch(setRoles(res.data as IRole[]))
    } catch (e) {
      console.log(e)
    }
  }

  const onHandleConfirmDelete = (user: IUser): void => {
    setToDelete(user)
    setContentDelete("L'utilisateur " + user.email + " ?")
    document?.getElementById('modal')?.showModal()
  }

  const onHandleDelete = async (): Promise<void> => {
    const user: IUser = toDelete as IUser
    const res = await deleteUser(token, user?.id as number)
    console.log(res)
    dispatch(removeElt(user))
    console.log("SUPPRIMER " + user.email)
  }

  const onHandleChangePass = (user: IUser): void => {
    console.log("CLICK SUR CHANGE PASS")
    setUser(user)
    document?.getElementById('modal-password')?.showModal()
  }

  const onHandleNavToUpdate = (user: IUser): void => {
    dispatch(selectedUser(user))
    navigate("update")
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 h-full p-6 mb-4 z-20">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">
            Gestion des Utilisateurs
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Gérer les utilisateurs du système
          </p>
        </div>
        <div className="flex  justify-end ">
          <Link to="new" className="btn btn-md bg-app-primary text-white font-medium">
            <FiPlus />
            Nouvel Utilisateur
          </Link>
          <button className="btn btn-md btn-outline ml-2">Exporter</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="border-b-2 border-app-primary flex items-center pb-4">
          <div className="flex mr-2 w-1/3">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Tri par type d'utilisateur</span>
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="select select-bordered"
              >
                <option>Tous</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex mt-8 w-full">
            <input type="text" placeholder="Recherche..." className="input input-bordered w-1/3" />
            <button className="btn btn-md ml-2">
              <FiSearch size={24} />
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingTable />}

      {!loading && users.length === 0 && <NoDataList />}

      {success !== null && <AlertNotificationSuccess message={message} />}

      {!loading && users.length > 0 && (
        <div className="grid">
          <div className="max-w-screen-2xl ">
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
              <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                <div className="flex items-center flex-1 space-x-4">
                  <h5>
                    <span className="text-gray-500">Il y a :</span>
                    <span className="dark:text-white">
                      {' '}
                      {users.length + ' utilisateur' + (users.length > 1 ? 's' : '')}{' '}
                    </span>
                  </h5>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-10">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all"
                            type="checkbox"
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="checkbox-all" className="sr-only">
                            checkbox
                          </label>
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Nom & Prénom
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Role
                      </th>
                      <th scope="col" className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="w-4 px-4 py-3">
                          <div className="flex items-center">
                            <input
                              id="checkbox-table-search-1"
                              type="checkbox"
                              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="checkbox-table-search-1" className="sr-only">
                              checkbox
                            </label>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {user?.first_name + ' ' + user?.last_name}
                        </th>
                        <td className="px-4 py-2">
                          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                            {user?.email}
                          </span>
                        </td>
                        <td className="px-4 py-2">{user?.role?.label.toUpperCase()}</td>
                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex justify-end">
                            <button onClick={() => onHandleNavToUpdate(user)} className="btn btn-sm">
                              <FiEye />
                            </button>
                            <div className="dropdown dropdown-left dropdown-end ml-2">
                              <div tabIndex={0} role="button" className="btn btn-sm ">
                                <FiMoreHorizontal />
                              </div>
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-1 shadow"
                              >
                                <li>
                                  <a onClick={() => onHandleNavToUpdate(user)}>Modifier</a>
                                </li>
                                <li>
                                  <a onClick={() => onHandleChangePass(user)}>Changer de mot de passe</a>
                                </li>
                              </ul>
                            </div>
                            <button
                              onClick={() => onHandleConfirmDelete(user)}
                              className="btn btn-sm btn-error ml-2 font-bold text-white"
                            >
                              <FiTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <nav
                className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
                aria-label="Table navigation"
              >
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Affichage
                  <span className="font-semibold text-gray-900 dark:text-white">1 - 10</span>
                  sur
                  <span className="font-semibold text-gray-900 dark:text-white">1000</span>
                </span>
                <ul className="inline-flex items-stretch -space-x-px">
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      1
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      2
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      aria-current="page"
                      className="z-10 flex items-center justify-center px-3 py-2 text-sm leading-tight border text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    >
                      3
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      ...
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      100
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <ConfirmDeleteDialog content={contentDelete} action={onHandleDelete} />

            <DialogChangePassword user={user} />

          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
