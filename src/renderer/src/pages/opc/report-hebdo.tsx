import { useNavigate } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { toast, ToastContainer } from 'react-toastify'
import { FiEye, FiMoreHorizontal, FiTrash } from 'react-icons/fi'
import { Fragment, useEffect, useState } from 'react'
import LoadingTable from '../../components/LoadingTable'
import NoDataList from '../../components/NoDataList'
import AlertNotificationSuccess from '../../components/AlertNotificationSuccess'
import { IAssetLine, IOpc, IWeek } from '../../type'
import { getActifNet, getActifSousGestion, getValeurLiquid, weekReport } from '../../services/opcService'
import { setOpc, setOpcs } from '../../store/opcSlice'
import { getMessageErrorRequestEx } from '../../utils/errors'
import LoadReportModal from './load-report-modal'
import moment from 'moment'
import { NumericFormat } from 'react-number-format'
import TableNavigationFooter from '../../components/TableNavigationFooter'

function ReportHebdo(): JSX.Element {
  const navigate = useNavigate()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const opcs: IOpc[] = useAppSelector((state) => state.opc.opcs)
  const currentWeek: IWeek | null = useAppSelector((state) => state.system.currentWeek)

  const message: string | null = useAppSelector((state) => state.information.message)
  const success: string | null = useAppSelector((state) => state.information.success)

  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [numberPage, setNumberPage] = useState(0)
  const [tableSize, setTableSize] = useState<number[]>()

  useEffect(() => {
    //loadOpcsOfWeek()
    setTableSize([5, 10, 20, 50, 100])
  }, [])

  useEffect(() => {
    if (currentPage !== undefined && currentPage !== null) {
      loadOpcsOfWeek(currentPage)
    }
  }, [currentPage])

  const loadOpcsOfWeek = async (page: number = 0): Promise<void> => {
    try {
      const res = page ? await weekReport(token as string, page) : await weekReport(token as string)
      //console.log(res.data)
      dispatch(setOpcs(res.data.content as IOpc[]))
      setTotal(res.data.totalElements)
      setNumberPage(res.data.totalPages)
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), { theme: 'colored' })
    } finally {
      setLoading(false)
    }
  }

  const onHandleChangePage = (page: number): void => {
    console.log(page)
    setCurrentPage(page)
  }

  const onHandleUpReport = async (): Promise<void> => {
    // @ts-ignore daisyUI
    document?.getElementById("modal-load-report-opc")?.showModal()
  }

  const showSuccessToast = (msg: string): void => {
    toast.success(msg, { theme: 'colored'})
  }

  const showErrorToast = (msg: string): void => {
    toast.error(msg, { theme: 'colored'})
  }

  const onHandleDetail = (opc: IOpc): void => {
    dispatch(setOpc(opc))
    navigate('details')
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 p-6 mb-4 z-20">
      <ToastContainer key={21223223} />

      <div className="grid grid-cols-2 gap-4 mb-4 pb-2 border-b-2 border-app-primary ">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">
            Rapports Hedbomadaires{' '}
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Rapports Hebdo, OPC & Mandats
          </p>
        </div>
        <div className="flex  justify-end ">
          <button onClick={() => onHandleUpReport()} className="btn btn-md btn-outline ml-2">
            Charger un rapport (Excel)
          </button>
        </div>
      </div>

      {loading && <LoadingTable />}

      {!loading && opcs.length === 0 && <NoDataList />}

      {success !== null && <AlertNotificationSuccess message={message} />}

      {!loading && opcs.length > 0 && (
        <div className="grid">
          <div className="max-w-screen-2xl ">
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
              <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                <div className="flex items-center flex-1 space-x-4 justify-between">
                  <h5>
                    <span className="text-gray-500">Pour cette semaine, il y a : </span>
                    <span className="dark:text-white">
                      {total + ' rapport' + (total > 1 ? 's' : '')}
                    </span>
                  </h5>
                  <div className="flex items-center gap-2">
                    Taille de la liste
                    <Fragment></Fragment>{' '}
                    <select
                      className="select select-md select-bordered"
                      name="page"
                      id="page"
                      value={perPage}
                      onChange={(e) => setPerPage(Number(e.target.value))}
                    >
                      {tableSize?.map((item) => (
                        <option key={Math.random() + Date.now()} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
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
                        Reçu le
                      </th>
                      <th scope="col" className="px-4 py-3">
                        De la SGO
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Fond
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Actif Net
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Valeur Liquid.
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Actifs S.G.
                      </th>
                      <th scope="col" className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {opcs.map((opc) => (
                      <tr
                        key={opc.id}
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
                          {moment(opc?.created_at).format('DD MMMM YYYY')}
                        </th>
                        <td className="px-4 py-2">
                          <label className="font-medium">
                            {opc?.fund?.intermediary?.label?.toUpperCase()}
                          </label>
                        </td>
                        <td className="px-4 py-2">
                          <label className="font-medium">{opc?.fund?.label?.toUpperCase()}</label>
                        </td>
                        <td className="px-4 py-2">
                          {' '}
                          <NumericFormat
                            value={getActifNet(opc?.assetLines as IAssetLine[])}
                            displayType={'text'}
                            thousandSeparator={' '}
                            suffix={' XAF'}
                          />{' '}
                        </td>
                        <td className="px-4 py-2">
                          {' '}
                          <NumericFormat
                            value={getValeurLiquid(opc?.assetLines as IAssetLine[])}
                            displayType={'text'}
                            thousandSeparator={' '}
                            suffix={' XAF'}
                          />
                        </td>
                        <td className="px-4 py-2">
                          {' '}
                          <NumericFormat
                            value={getActifSousGestion(opc?.assetLines as IAssetLine[])}
                            displayType={'text'}
                            thousandSeparator={' '}
                            suffix={' XAF'}
                          />
                        </td>

                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex justify-end">
                            <button onClick={() => onHandleDetail(opc)} className="btn btn-sm">
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
                                  <a>Historique Valeur L.</a>
                                </li>
                                <li>
                                  <a>Modifier</a>
                                </li>
                              </ul>
                            </div>
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
              <TableNavigationFooter
                total={total}
                current={currentPage}
                perPage={perPage}
                pages={numberPage}
                action={onHandleChangePage}
              />
            </div>
          </div>
        </div>
      )}

      <LoadReportModal
        token={token as string}
        success={showSuccessToast}
        error={showErrorToast}
        currentWeek={currentWeek as IWeek}
        reload={loadOpcsOfWeek}
      />
    </div>
  )
}

export default ReportHebdo
