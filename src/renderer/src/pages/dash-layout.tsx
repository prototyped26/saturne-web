import { FiBell, FiFileText, FiFolder, FiGrid, FiLogOut, FiSettings, FiTool, FiUser, FiUsers } from 'react-icons/fi'
import { LuBriefcaseBusiness, LuBuilding2, LuForklift } from 'react-icons/lu'
import { SlWallet } from 'react-icons/sl'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import imageLogo from "./../assets/icon.png"
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { useEffect } from 'react'
import { IUser } from '../type'
import { getAllShareholders, getShareholdersTypes } from '../services/fundService'
import { setShareholders, setShareholdersTypes } from '../store/fundSlice'
import { toast } from 'react-toastify'
import { getMessageErrorRequestEx } from '../utils/errors'

function DashLayout(): JSX.Element {
  const navigate = useNavigate()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const user: IUser = useAppSelector((state) => state.user.current)
  const token: string | null = useAppSelector((state) => state.user.token)

  useEffect(() => {
    console.log(user)
    if (user === null) navigate('/login')
    loadTypesShareholders()
  }, [])

  useEffect(() => {
    if (user === null) navigate('/login')
  }, [user])

  const loadTypesShareholders = async (): Promise<void> => {
    try {
      const res = await getShareholdersTypes(token as string)
      dispatch(setShareholdersTypes(res.data))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    }
  }

  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      <aside
        className="fixed top-0 left-0 z-60 w-64 h-screen pt-2 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
          <p className="text-app-secondary border-b pb-2 mt-14">Menu Principal</p>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dash/main"
                className={({ isActive }) =>
                  isActive
                    ? 'active flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                    : 'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                }
              >
                <FiGrid />
                <span className="ml-3">Tableau de bord</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dash/reports"
                className={({ isActive }) =>
                  isActive
                    ? 'active flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                    : 'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                }
              >
                <FiFileText />
                <span className="ml-3">Rapports Hebdo.</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dash/funds"
                className={({ isActive }) =>
                  isActive
                    ? 'active flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                    : 'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                }
              >
                <SlWallet />
                <span className="ml-3">Fonds</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dash/mandates"
                className={({ isActive }) =>
                  isActive
                    ? 'active flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                    : 'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                }
              >
                <SlWallet />
                <span className="ml-3">Mandats</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dash/intermediaries"
                className={({ isActive }) =>
                  isActive
                    ? 'active flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                    : 'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                }
              >
                <LuBriefcaseBusiness />
                <span className="ml-3">Intermédiaires</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dash/queries"
                className={({ isActive }) =>
                  isActive
                    ? 'active flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                    : 'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                }
              >
                <LuForklift />
                <span className="ml-3">Requêtes</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dash/documents"
                className={({ isActive }) =>
                  isActive
                    ? 'active flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                    : 'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                }
              >
                <FiFolder />
                <span className="ml-3">Documents</span>
              </NavLink>
            </li>
          </ul>

          <p className="pt-3 mt-5 border-t text-app-secondary">Paramètres</p>
          <ul className="pt-1 mt-1 space-y-2  border-gray-200 dark:border-gray-700">
            <li>
              <NavLink
                to="/dash/users"
                className={({ isActive }) =>
                  isActive
                    ? 'active flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                    : 'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                }
              >
                <FiUsers />
                <span className="ml-3">Utilisateurs</span>
              </NavLink>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FiTool />
                <span className="ml-3">Options Fonds, OPC</span>
              </a>
            </li>
            <li>
              <NavLink
                to="/dash/system/years"
                className={({ isActive }) =>
                  isActive
                    ? 'active flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                    : 'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                }
              >
                <FiSettings />
                <span className="ml-3">Système</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      <div className="flex flex-row items-center justify-between fixed left-70 right-0  z-50 bg-white w-full  rounded-lg border-gray-300 dark:border-gray-600 h-20 mb-2">
        <div className="flex mt-2 ml-4 justify-center items-center">
          <div>
            <img src={imageLogo} height="54" width="52" />
          </div>
          <div className="justify-center ml-4">
            <h2 className=" -tracking-tight font-extrabold text-2xl text-black">SATURNE</h2>
          </div>
        </div>

        <div className="flex flex-row items-center ">
          <label className="badge badge-app-secondary font-medium ml-4">
            {' '}
            {user?.role?.label.toUpperCase()}{' '}
          </label>

          <a href="#" className="mx-5 flex justify-center items-center">
            <span className="text-lg font-medium">
              {' '}
              {user?.first_name + ' ' + (user?.last_name ? user.last_name : '')}{' '}
            </span>
            <div className="ml-2 p-2 border-2 rounded-full bg-white ">
              <FiUser size={20} />
            </div>
          </a>

          <a href="#" className="p-2">
            <FiBell size={24} />
          </a>

          <Link to="/login" className="p-2 ml-4 mr-4 btn btn-md btn-outline btn-error">
            <FiLogOut size={24} />
          </Link>
        </div>
      </div>

      <main className="p-4 md:ml-64 h-screen pt-28 bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  )
}

export default DashLayout

