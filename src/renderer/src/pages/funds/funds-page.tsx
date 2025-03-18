import { Link, useNavigate } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IClassification, IDepository, IDistribution, IFund, IIntermediary, ITypeOpc } from '../../type'
import { useEffect, useState } from 'react'
import { getSgos } from '../../services/intermediaryService'
import { setIntermediaries } from '../../store/intermediarySlice'
import { toast, ToastContainer } from 'react-toastify'
import { getMessageErrorRequestEx } from '../../utils/errors'
import {
  deleteFund, getAllShareholders,
  getClassifications,
  getDepositaries,
  getDistributions,
  getFunds,
  getTypesOpc
} from '../../services/fundService'
import {
  removeFund,
  setClassifications,
  setDepositaries,
  setDistributions, setFund,
  setFunds, setShareholders,
  setTypesOpc
} from '../../store/fundSlice'
import { FiEye, FiMoreHorizontal, FiPlus, FiSearch, FiTrash } from 'react-icons/fi'
import LoadingTable from '../../components/LoadingTable'
import NoDataList from '../../components/NoDataList'
import moment from 'moment/moment'
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog'
import AlertNotificationSuccess from '../../components/AlertNotificationSuccess'
import { setSuccess } from '../../store/informationSlice'
import ImportFundModal from './import-fund-modal'

function FundsPage() : JSX.Element {
  const navigate = useNavigate()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const funds: IFund[] = useAppSelector((state) => state.fund.funds)
  const typesOpc: ITypeOpc[] = useAppSelector((state) => state.fund.typesOpc)
  const claissifications: IClassification[] = useAppSelector((state) => state.fund.classifications)
  const depositaries: IDepository[] = useAppSelector((state) => state.fund.depositaries)
  const distributions: IDistribution[] = useAppSelector((state) => state.fund.distributions)
  const intermediaries: IIntermediary[] = useAppSelector((state) => state.intermediary.intermediaries)

  const message: string | null = useAppSelector((state) => state.information.message)
  const success: string | null = useAppSelector((state) => state.information.success)

  const [loading, setLoading] = useState(true)
  const [contentDelete, setContentDelete] = useState('')
  const [toDelete, setToDelete] = useState<IFund | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadClassifications(token as string)
    loadSgos(token as string)
    loadTypesOpc(token as string)
    loadDepositaries(token as string)
    loadDistributions(token as string)
    loadAllShareholders(token as string)
    loadFunds(token as string)
  }, [])

  useEffect(() => {

  }, [intermediaries, typesOpc, claissifications, depositaries, distributions])

  useEffect(() => {
    if (success !== null) setTimeout(() => dispatch(setSuccess(null)), 5000)
  })

  const loadFunds = async (t: string): Promise<void> => {
    try {
      const res = await getFunds(t)
      dispatch(setFunds(res.data))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadClassifications = async (t: string): Promise<void> => {
    try {
      const res = await getClassifications(t)
      dispatch(setClassifications(res.data))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    }
  }

  const loadSgos = async (t: string): Promise<void> => {
    try {
      const res = await getSgos(t)
      dispatch(setIntermediaries(res.data))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    }
  }

  const loadDepositaries = async (t: string): Promise<void> => {
    try {
      const res = await getDepositaries(t)
      dispatch(setDepositaries(res.data))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    }
  }

  const loadDistributions = async (t: string): Promise<void> => {
    try {
      const res = await getDistributions(t)
      dispatch(setDistributions(res.data))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    }
  }

  const loadTypesOpc = async (t: string): Promise<void> => {
    try {
      const res = await getTypesOpc(t)
      dispatch(setTypesOpc(res.data))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    }
  }

  const loadAllShareholders = async (t: string): Promise<void> => {
    try {
      const res = await getAllShareholders(t)
      dispatch(setShareholders(res.data))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    }
  }

  const onHandleTermChange = (val): void => {
    //const s = search
    //s.term = val
    setSearch(val)
  }

  const onHandleClickImport = (): void => {
    // @ts-ignore DiasyUI
    document?.getElementById('modal-import-fund')?.showModal()
  }

  const onHandleNavToUpdate = (fund: IFund): void => {
    dispatch(setFund(fund))
    navigate('update')
  }

  const onHandleNavToDetails = (fund: IFund): void => {
    dispatch(setFund(fund))
    navigate('details')
  }

  const onHandleConfirmDelete = async (f: IFund): Promise<void> => {
    setToDelete(f)
    setContentDelete("du fond " + f.label + " ?")
    // @ts-ignore DiasyUI
    document?.getElementById('modal')?.showModal()
  }

  const onHandleDelete = async (): Promise<void> => {
    const f = toDelete as IFund
    await deleteFund(token as string, f.id as number)
    dispatch(removeFund(f))
  }

  const showSuccessToast = (msg: string): void => {
    toast.success(msg, { theme: 'colored'})
  }

  const showErrorToast = (msg: string): void => {
    toast.error(msg, { theme: 'colored'})
  }

  const onHandleSearch = async (): Promise<void> => {
    if (search?.length === 0) setSearch('')

    //setSearchLoading(true)

    try {
      //const res = await searchIntermediaries(token as string, search)
     //  dispatch(setIntermediaries(res.data as IIntermediary[]))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), { theme: 'colored' })
    } finally {
      //setSearchLoading(false)
    }
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 p-6 mb-4 z-20">
      <ToastContainer key={11223223} />
      <ImportFundModal token={token as string} action={showSuccessToast} error={showErrorToast} />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">Les Fonds</h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Suivi et gestion des différents fonds
          </p>
        </div>
        <div className="flex  justify-end ">
          <Link to="new" className="btn btn-md bg-app-primary text-white font-medium">
            <FiPlus />
            Nouveau Fond
          </Link>
          <button onClick={() => onHandleClickImport()} className="btn btn-md btn-outline ml-2">
            Importer (Excel)
          </button>
          <button className="btn btn-md btn-outline ml-2">Exporter</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="border-b-2 border-app-primary flex items-center pb-4">
          <div className="flex mt-8 w-full">
            <input onChange={(e) => onHandleTermChange(e.target.value)} type="text" placeholder="Recherche..."
                   className="input input-bordered w-1/3" />
            <button onClick={() => onHandleSearch()} className="btn btn-md ml-2">
              <FiSearch size={24} />
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingTable />}

      {!loading && funds.length === 0 && <NoDataList />}

      {success !== null && <AlertNotificationSuccess message={message} />}

      {!loading && funds.length > 0 && (
        <div className="grid">
          <div className="max-w-screen-2xl ">
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
              <div
                className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                <div className="flex items-center flex-1 space-x-4">
                  <h5>
                    <span className="text-gray-500">Il y a :</span>
                    <span className="dark:text-white">
                      {funds.length + ' fond' + (funds.length > 1 ? 's' : '')}{' '}
                    </span>
                  </h5>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400 mb-10">
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
                      Dénomination
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Agrément
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Type OPC
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Dépositaire
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Classification
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Distribution
                    </th>
                    <th scope="col" className="px-4 py-3"></th>
                  </tr>
                  </thead>
                  <tbody>
                  {funds.map((fund) => (
                    <tr
                      key={fund.id}
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
                        className=" items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {fund?.label} <br />
                        <label className="font-light">
                          {fund?.intermediary?.label?.toUpperCase()}
                        </label>
                      </th>
                      <td className="px-4 py-2">
                        <label className="font-medium">{fund?.approval_number}</label>
                        <br />
                        <label className="font-light">
                          Du {moment(fund?.approval_date).format('DD MMMM YYYY')}
                        </label>
                      </td>
                      <td className="px-4 py-2">
                          <span
                            className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                            {fund?.typeOpc?.label?.toUpperCase()}
                          </span>
                      </td>
                      <td className="px-4 py-2">{fund?.depositary?.label?.toUpperCase()}</td>
                      <td className="px-4 py-2">{fund?.classification?.label?.toUpperCase()}</td>
                      <td className="px-4 py-2">{fund?.distribution?.label?.toUpperCase()}</td>

                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex justify-end">
                          <button
                            onClick={() => onHandleNavToDetails(fund)}
                            className="btn btn-sm"
                          >
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
                                <a onClick={() => onHandleNavToUpdate(fund)}>Historique Valeur L.</a>
                              </li>
                              <li>
                                <a onClick={() => onHandleNavToUpdate(fund)}>Modifier</a>
                              </li>
                              <li>
                                <a onClick={() => onHandleNavToDetails(fund)}>Détails</a>
                              </li>
                            </ul>
                          </div>
                          <button
                            onClick={() => onHandleConfirmDelete(fund)}
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

export default FundsPage
