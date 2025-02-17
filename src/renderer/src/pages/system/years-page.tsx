import LoadingTable from '../../components/LoadingTable'
import NoDataList from '../../components/NoDataList'
import AlertNotificationSuccess from '../../components/AlertNotificationSuccess'
import { Link, useNavigate } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { useEffect, useState } from 'react'
import { IYear } from '../../type'
import { setSuccess } from '../../store/informationSlice'
import { activeYear, deleteYear, desactiveYear, getManagedYears } from '../../services/systemService'
import { removeYear, setYear, setYears } from '../../store/systemSlice'
import { toast, ToastContainer } from 'react-toastify'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { FiEye, FiMoreHorizontal, FiPlus, FiTrash } from 'react-icons/fi'
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog'
import GlobalLoadingDialog from '../../components/GlobalLoadingDialog'

function YearsPage(): JSX.Element {
  const navigate = useNavigate()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const years: IYear[] = useAppSelector((state) => state.system.years)

  const message: string | null = useAppSelector((state) => state.information.message)
  const success: string | null = useAppSelector((state) => state.information.success)

  const [loading, setLoading] = useState(true)
  const [loadingActive, setLoadingActive] = useState(false)
  const [contentDelete, setContentDelete] = useState("")
  const [toDelete, setToDelete] = useState<IYear | null>(null)

  useEffect(() => {
    loadYears(token as string)
  }, [])

  useEffect(() => {
    if (success !== null) setTimeout(() => dispatch(setSuccess(null)), 5000)
  }, [success])

  const loadYears = async (t: string): Promise<void> => {
    try {
      const res = await getManagedYears(t)
      dispatch(setYears(res.data as IYear[]))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), { theme: 'colored' })
    } finally {
      setLoading(false)
    }
  }

  const onHandleConfirmDelete = (year: IYear): void => {
    setToDelete(year)
    setContentDelete("l'année " + year.label + " ?")
    document?.getElementById('modal')?.showModal()
  }

  const showSuccessToast = (msg: string): void => {
    toast.success(msg, { theme: 'colored'})
  }

  const showErrorToast = (msg: string): void => {
    toast.error(msg, { theme: 'colored'})
  }

  const onHandleNavToUpdate = (year: IYear): void => {
    dispatch(setYear(year))
    navigate("edit")
  }

  const onHandleDelete = async (): Promise<void> => {
    await deleteYear(token, toDelete?.id as number)
    dispatch(removeYear(toDelete as IYear))
  }

  const onHandleChangeActive = async (y: IYear): Promise<void> => {
    document?.getElementById('modal-loading')?.showModal()
    setLoadingActive(true)
    if (y.active) {
      // désactive
      desactivate(y)
    } else {
      // active
      activate(y)
    }
    document?.getElementById('btn-close-modal-loading')?.click()
  }

  const desactivate = async (y: IYear): Promise<void> => {
    try {
      await desactiveYear(token, y.id as number)
      await loadYears(token as string)
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), { theme: 'colored' })
    }
  }

  const activate = async (y: IYear): Promise<void> => {
    try {
      await activeYear(token, y.id as number)
      await loadYears(token as string)
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), { theme: 'colored' })
    }
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 h-full p-6 mb-4 z-20">
      <ToastContainer />
      <GlobalLoadingDialog loading={loadingActive} />

      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b-2 border-app-primary">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">Système, Année</h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Gérer années du système
          </p>
        </div>
        <div className="flex  justify-end ">
          <Link to="new" className="btn btn-md bg-app-primary text-white font-medium">
            <FiPlus />
            Nouvelle année
          </Link>
        </div>
      </div>

      {loading && <LoadingTable />}

      {!loading && years.length === 0 && <NoDataList />}

      {success !== null && <AlertNotificationSuccess message={message} />}

      {!loading && years.length > 0 && (
        <div className="grid">
          <div className="max-w-screen-2xl ">
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
              <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                <div className="flex items-center flex-1 space-x-4">
                  <h5>
                    <span className="text-gray-500">Il y a :</span>
                    <span className="dark:text-white">
                      {' '}
                      {years.length + ' année' + (years.length > 1 ? 's' : '')}{' '}
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
                        Libellé
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Etat
                      </th>
                      <th scope="col" className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {years.map((year) => (
                      <tr
                        key={year.id}
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
                          <label className="text-green-950">{year?.label}</label>

                        </th>
                        <td className="px-4 py-2">
                          {year?.active && (
                            <input
                              type="checkbox"
                              onClick={() => onHandleChangeActive(year)}
                              className="toggle toggle-success"
                              defaultChecked
                            />
                          )}
                          {!year?.active && (
                            <input
                              type="checkbox"
                              onClick={() => onHandleChangeActive(year)}
                              className="toggle toggle-success"
                            />
                          )}
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex justify-end">
                            <button className="btn btn-sm">
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
                                  <a onClick={() => onHandleNavToUpdate(year)}>Modifier</a>
                                </li>
                              </ul>
                            </div>
                            <button
                              onClick={() => onHandleConfirmDelete(year)}
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

            <ConfirmDeleteDialog
              content={contentDelete}
              action={onHandleDelete}
              success={showSuccessToast}
              error={showErrorToast}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default YearsPage
