import LoadingTable from '../../../components/LoadingTable'
import NoDataList from '../../../components/NoDataList'
import { Fragment, useState } from 'react'
import moment from 'moment/moment'
import { NumericFormat } from 'react-number-format'
import { deleteReportOpc, getActifNet, getActifSousGestion, getValeurLiquid, weekReport } from '../../../services/opcService'
import { IAssetLine, IOpc, IPeriodicity, ISearchOpc } from '../../../type'
import { FiEye, FiSearch, FiTrash } from 'react-icons/fi'
import TableNavigationFooter from '../../../components/TableNavigationFooter'
import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { removeOpc, setOpc, setOpcs } from '../../../store/opcSlice'
import { useNavigate } from 'react-router'
import { getMessageErrorRequestEx } from '@renderer/utils/errors'

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
  showError: (t: string) => void,
  setLoading: (v: boolean) => void,
  setTotal: (page: number) => void,
  setNumberPage: (page: number) => void,
}

function SectionOpcReport({ token, loading, total, currentPage, perPage, setPerPage, numberPage, tableSize, changePage, showError, showSuccess, setLoading, setTotal, setNumberPage } : Props ): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const opcs: IOpc[] = useAppSelector((state) => state.opc.opcs)
  const periodicities: IPeriodicity[] = useAppSelector((state) => state.system.periodicities)

  const [contentDelete, setContentDelete] = useState("")
  const [toDelete, setToDelete] = useState<IOpc | null>(null)
  const [search, setSearch] = useState<ISearchOpc>({ periodicity_id: null, date: null, term: null })
  const [labelPeriod, setLabelPeriod] = useState("")


  const onHandleDetail = (opc: IOpc): void => {
    dispatch(setOpc(opc))
    navigate('details')
  }

  const loadOpcsOfWeek = async (): Promise<void> => {
      try {
        const res =  await weekReport(token as string, currentPage, search)
        //console.log(res.data)
        dispatch(setOpcs(res.data.content as IOpc[]))
        setTotal(res.data.totalElements)
        setNumberPage(res.data.totalPages)
      } catch (e) {
        showError(getMessageErrorRequestEx(e))
      } finally {
        setLoading(false)
      }
    }

  const onHandleConfirmDelete = (opc: IOpc): void => {
    setToDelete(opc)
    setContentDelete("Le rapport " + opc?.fund?.label + " du " + moment(opc.date).format("DD/MM/YYYY") + " ?")
    // @ts-ignore Diasy UI
    document?.getElementById('modal')?.showModal()
  }

  const onHandleDelete = async (): Promise<void> => {
    await deleteReportOpc(token as string, toDelete?.id as number)
    dispatch(removeOpc(toDelete as IOpc))
  }

  const onHandleChangePeriodicity = (val): void => {
    const data = search
    setLabelPeriod(val)
    if (val.length > 0) {
      setSearch({ periodicity_id: Number.parseInt(val), date: data.date, term: data.term })
    } else {
      setSearch({ periodicity_id: null, date: data.date, term: data.term })
    }
  }

  const onHandleChangeTerm = (val): void => {
    const data = search
    if (val.length > 0) {
      setSearch({ periodicity_id: search.periodicity_id, date: data.date, term: val })
    } else {
      setSearch({ periodicity_id: search.periodicity_id, date: data.date, term: null })
    }
  }

  const onHandleChangeDate = (val): void => {
    const data = search
    if (val.length > 0) {
      setSearch({ periodicity_id: search.periodicity_id, date: val, term: data.term })
    } else {
      setSearch({ periodicity_id: search.periodicity_id, date: null, term: data.term })
    }
  }

  const onHandleSearch = async (): Promise<void> => {
    loadOpcsOfWeek()
  }

  return (
    <div>

      <div className="flex shadow-md ">
        <div className="flex mb-4 p-2 gap-2">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Tri par période</span>
            </div>
            <select
              value={labelPeriod}
              className="select select-bordered select-md"
              onChange={(e) => onHandleChangePeriodicity(e.target.value)}
            >
              <option value="">Tous</option>
              {periodicities.map((period) => (
                <option key={period.id * Math.random()} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control w-[60rem] max-w-xs">
            <div className="label">
              <span className="label-text">Fond</span>
            </div>
            <input type="text" onChange={(e) => onHandleChangeTerm(e.target.value)} className="input input-bordered w-full" placeholder="Nom du fond / N° agré..." />
          </label>
          <label className="form-control w-48 max-w-xs">
            <div className="label">
              <span className="label-text">Date du rapport</span>
            </div>
            <input type="date" onChange={(e) => onHandleChangeDate(e.target.value)} className="input input-bordered w-full" />
          </label>
          <button onClick={() => onHandleSearch()} className="btn btn-md ml-2 mt-9">
            <FiSearch size={24} />
          </button>
        </div>
      </div>

      {loading && <LoadingTable />}

      {!loading && opcs.length === 0 && <NoDataList />}

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
                      <th scope="col" className="px-4 py-3">
                        Rapport du
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
                            {opc?.fund?.intermediary?.label?.toUpperCase()}
                          </label>
                        </td>
                        <td className="px-4 py-2">
                          <label className="font-medium">{opc?.fund?.label?.toUpperCase()}</label>
                        </td>
                        <td className="px-4 py-2">
                          {' '}
                          <NumericFormat
                            value={getActifNet(opc?.assetLines as IAssetLine[])?.toFixed(2)}
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

export default SectionOpcReport
