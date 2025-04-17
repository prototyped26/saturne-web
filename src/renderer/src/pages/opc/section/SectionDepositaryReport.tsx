import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { IReportSGO } from '../../../type'
import { Fragment, useState } from 'react'
import { removeReportSgo, setReportSgo } from '../../../store/opcSlice'
import moment from 'moment'
import {
  deleteReportSGO,
  getCapitalSocialReportSGO, getResultatNetReportSGO,
  getTotalActifReportSGO,
  getTotalPassifReportSGO
} from '../../../services/opcService'
import LoadingTable from '../../../components/LoadingTable'
import NoDataList from '../../../components/NoDataList'
import { FiEye, FiTrash } from 'react-icons/fi'
import TableNavigationFooter from '../../../components/TableNavigationFooter'
import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog'
import { NumericFormat } from 'react-number-format'
import { useNavigate } from 'react-router'
import { FaTriangleExclamation } from 'react-icons/fa6'

type Props = {
  token: string,
  loading: boolean,
  total: number,
  currentPage: number,
  perPage: number,
  setPerPage: (val: number) => void,
  numberPage: number,
  tableSize: number[],
  changePage: (page: number) => void,
  showSuccess: (t: string) => void,
  showError: (t: string) => void
}

function SectionSgoReport({ token, loading, total, currentPage, perPage, setPerPage, numberPage, tableSize, changePage, showError, showSuccess } : Props): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const reports: IReportSGO[] = useAppSelector((state) => state.opc.reportsSgo)

  const [contentDelete, setContentDelete] = useState("")
  const [toDelete, setToDelete] = useState<IReportSGO | null>(null)

  const onHandleDetail = (report: IReportSGO): void => {
    dispatch(setReportSgo(report))
    navigate("sgo")
  }

  const onHandleConfirmDelete = (report: IReportSGO): void => {
    setToDelete(report)
    setContentDelete("Le rapport du dépositaire " + report?.intermediary?.label + " du " + moment(report.date).format("DD/MM/YYYY") + " ?")
    // @ts-ignore Diasy UI
    document?.getElementById('modal')?.showModal()
  }

  const onHandleDelete = async (): Promise<void> => {
    await deleteReportSGO(token as string, toDelete?.id as number)
    dispatch(removeReportSgo(toDelete as IReportSGO))
  }

  return (
    <div>
      {loading && <LoadingTable />}

      {!loading && reports.length === 0 && <NoDataList />}

      {!loading && reports.length > 0 && (
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
                      <th scope="col" className="px-4 py-3">
                        Rapport du
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Reçu le
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Dépositaire
                      </th>
                      <th scope="col" className="px-4 py-3">
                        SGO
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Total Actif
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Total Passif
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Résultat Net
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Capital Social
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Alerte
                      </th>
                      <th scope="col" className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((opc) => (
                      <tr
                        key={opc.id}
                        className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <th
                          scope="row"
                          className=" items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {moment(opc?.date).format('DD MMMM YYYY')}
                        </th>
                        <th
                          scope="row"
                          className=" items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {moment(opc?.created_at).format('DD MMMM YYYY')}
                        </th>
                        <td className="px-4 py-2">
                          <label className="font-medium">
                            {opc?.intermediary?.label?.toUpperCase()}
                          </label>
                        </td>
                        <td className="px-4 py-2">
                          <label className="font-medium">
                            {opc?.intermediary_check?.label?.toUpperCase()}
                          </label>
                        </td>
                        <td className="px-4 py-2">
                          <NumericFormat
                            value={ getTotalActifReportSGO(opc?.components)?.toFixed(2)}
                            displayType={'text'}
                            thousandSeparator={' '}
                            suffix={' XAF'}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <NumericFormat
                            value={ getTotalPassifReportSGO(opc?.components)?.toFixed(2)}
                            displayType={'text'}
                            thousandSeparator={' '}
                            suffix={' XAF'}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <NumericFormat
                            value={ getResultatNetReportSGO(opc?.components)?.toFixed(2)}
                            displayType={'text'}
                            thousandSeparator={' '}
                            suffix={' XAF'}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <NumericFormat
                            value={ getCapitalSocialReportSGO(opc?.components)?.toFixed(2)}
                            displayType={'text'}
                            thousandSeparator={' '}
                            suffix={' XAF'}
                          />
                        </td>
                        <td className="px-4 py-2 justify-center">
                          <FaTriangleExclamation size={18} color="red" />
                        </td>

                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex justify-end">
                            <button onClick={() => onHandleDetail(opc)} className="btn btn-sm">
                              <FiEye />
                            </button>
                            <button
                              onClick={() => onHandleConfirmDelete(opc)}
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
              <TableNavigationFooter
                total={total}
                current={currentPage}
                perPage={perPage}
                pages={numberPage}
                action={changePage}
              />
            </div>
          </div>

          <ConfirmDeleteDialog
            content={contentDelete}
            action={onHandleDelete}
            success={showSuccess}
            error={showError}
          />
        </div>
      )}
    </div>
  )
}

export default SectionSgoReport
