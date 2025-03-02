import { useNavigate } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IAssetLine, IMandate, IWeek } from '../../type'
import { useEffect, useState } from 'react'
import { weekMandates } from '../../services/mandateService'
import { setMandate, setMandates } from '../../store/mandateSlice'
import { toast, ToastContainer } from 'react-toastify'
import { getMessageErrorRequestEx } from '../../utils/errors'
import LoadingTable from '../../components/LoadingTable'
import NoDataList from '../../components/NoDataList'
import moment from 'moment/moment'
import { NumericFormat } from 'react-number-format'
import { getActifNet, getActifSousGestion, getValeurLiquid } from '../../services/opcService'
import { FiEye, FiMoreHorizontal, FiTrash } from 'react-icons/fi'
import LoadMandateModal from './load-mandate-modal'

function MandatesPage(): JSX.Element {
  const navigate = useNavigate()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const mandates: IMandate[] = useAppSelector((state) => state.mandate.mandates)
  const currentWeek: IWeek | null = useAppSelector((state) => state.system.currentWeek)

  const message: string | null = useAppSelector((state) => state.information.message)
  const success: string | null = useAppSelector((state) => state.information.success)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMandates()
  }, [])

  const loadMandates = async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await weekMandates(token as string);
      dispatch(setMandates(res.data as IMandate[]))
    } catch (e) {
      showErrorToast(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  const onHandelSee = (mandate: IMandate): void => {
    dispatch(setMandate(mandate))
    navigate('details')
  }

  const showSuccessToast = (msg: string): void => {
    toast.success(msg, { theme: 'colored'})
  }

  const showErrorToast = (msg: string): void => {
    toast.error(msg, { theme: 'colored'})
  }

  const onHandleUpReport = async (): Promise<void> => {
    // @ts-ignore show is function off DiasyUI
    document?.getElementById("modal-load-report-mandate")?.showModal()
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 h-96 p-6 mb-4 z-20">
      <ToastContainer key={Math.random() * Date.now()} />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">
            Mandats Hedbomadaires{' '}
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Rapports Hebdo, différents Mandats
          </p>
        </div>
        <div className="flex  justify-end ">
          <button onClick={() => onHandleUpReport()} className="btn btn-md btn-outline ml-2">
            Charger un rapport (Excel)
          </button>
        </div>
      </div>

      {loading && <LoadingTable />}

      {!loading && mandates.length === 0 && <NoDataList />}

      {!loading && mandates.length > 0 && (
        <div className="grid">
          <div className="max-w-screen-2xl ">
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
              <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                <div className="flex items-center flex-1 space-x-4">
                  <h5>
                    <span className="text-gray-500"> Yl y a : </span>
                    <span className="dark:text-white">
                      {mandates.length + ' rapport' + (mandates.length > 1 ? 's' : '')}
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
                        Dénomination/Client
                      </th>
                      <th scope="col" className="px-4 py-3">
                        SGO
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Dépositaire
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Rapport du
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Profil de risque
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Actif Net
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Chargé le
                      </th>
                      <th scope="col" className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mandates.map((mandate) => (
                      <tr
                        key={mandate.id}
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
                          className=" items-center px-4 py-2 font-bold text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {mandate?.customer?.label?.toUpperCase()}
                        </th>
                        <td className="px-4 py-2">
                          <label className="font-medium">
                            {mandate?.customer?.intermediary?.label?.toUpperCase()}
                          </label>
                        </td>
                        <td className="px-4 py-2">
                          <label className="font-medium">
                            {mandate?.depositary?.label?.toUpperCase()}
                          </label>
                        </td>
                        <td className="px-4 py-2">
                          <label className="font-medium">{moment(mandate?.week?.end).format('DD, MMM YYYY')}</label>
                        </td>
                        <td className="px-4 py-2">
                          <label className="font-medium">{mandate?.risk_profile}</label>
                        </td>
                        <td className="px-4 py-2">
                          <NumericFormat
                            value={getActifNet(mandate?.assetLines as IAssetLine[])}
                            displayType={'text'}
                            thousandSeparator={' '}
                            suffix={' XAF'}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <label className="font-medium">
                            {moment(mandate?.created_at).format('DD, MMM YYYY')}
                          </label>
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex justify-end">
                            <button onClick={() => onHandelSee(mandate)} className="btn btn-sm">
                              <FiEye />
                            </button>
                            <button className="btn btn-sm btn-error ml-2 font-bold text-white">
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
          </div>
        </div>
      )}

      <LoadMandateModal
        token={token as string}
        currentWeek={currentWeek as IWeek}
        success={showSuccessToast}
        error={showErrorToast}
        reload={loadMandates}
      />
    </div>
  )
}

export default MandatesPage
