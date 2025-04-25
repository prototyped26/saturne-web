import { useNavigate } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IAssetLine, IMandate, IOpc, IPeriodicity, ISearchMandate, IWeek } from '../../type'
import { Fragment, useEffect, useState } from 'react'
import { deleteMandate, weekMandates } from '../../services/mandateService'
import { removeMandate, setMandate, setMandates } from '../../store/mandateSlice'
import { toast, ToastContainer } from 'react-toastify'
import { getMessageErrorRequestEx } from '../../utils/errors'
import LoadingTable from '../../components/LoadingTable'
import NoDataList from '../../components/NoDataList'
import moment from 'moment/moment'
import { NumericFormat } from 'react-number-format'
import { getActifNet } from '../../services/opcService'
import { FiEye, FiSearch, FiTrash } from 'react-icons/fi'
import LoadMandateModal from './load-mandate-modal'
import TableNavigationFooter from '../../components/TableNavigationFooter'
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog'

function MandatesPage(): JSX.Element {
  const navigate = useNavigate()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const mandates: IMandate[] = useAppSelector((state) => state.mandate.mandates)
  const currentWeek: IWeek | null = useAppSelector((state) => state.system.currentWeek)
  const periodicities: IPeriodicity[] = useAppSelector((state) => state.system.periodicities)

  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [numberPage, setNumberPage] = useState(0)
  const [tableSize, setTableSize] = useState<number[]>([])

  const [contentDelete, setContentDelete] = useState("")
  const [toDelete, setToDelete] = useState<IMandate | null>(null)
  const [search, setSearch] = useState<ISearchMandate>({periodicity_id: null, date: null, term: null })
  const [labelPeriod, setLabelPeriod] = useState("")

  useEffect(() => {
    //loadMandates()
    setTableSize([5, 10, 20, 50, 100])
  }, [])

  useEffect(() => {
    console.log("LA VALEUR " + currentPage);
    if (currentPage === 0) setCurrentPage(1)
    if (currentPage !== undefined && currentPage !== null) {
      loadMandates(currentPage)
    }
  }, [currentPage])

  const loadMandates = async (page: number = 0): Promise<void> => {
    setLoading(true)
    try {
      const res = await weekMandates(token as string, page, search)
      dispatch(setMandates(res.data.content as IMandate[]))
      setTotal(res.data.totalElements)
      setNumberPage(res.data.totalPages)
    } catch (e) {
      showErrorToast(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  const onHandleChangePage = (page: number): void => {
    console.log(page)
    setCurrentPage(page)
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

  const onHandleConfirmDelete = (mandate: IMandate): void => {
    setToDelete(mandate)
    setContentDelete("Le mandat " + mandate?.customer?.label + " du " + moment(mandate.date).format("DD/MM/YYYY") + " ?")
    // @ts-ignore Diasy UI
    document?.getElementById('modal')?.showModal()
  }

  const onHandleDelete = async (): Promise<void> => {
    await deleteMandate(token as string, toDelete?.id as number)
    dispatch(removeMandate(toDelete as IOpc))
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

  const onHandleSearch = (): void => {
    console.log("click sur le bouton")
    setCurrentPage(0)
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 p-6 mb-4 z-20">
      <ToastContainer key={Math.random() * Date.now()} />

      <div className="grid grid-cols-2 gap-4 mb-4 pb-2 border-b-2 border-app-primary">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">Les Mandats</h3>
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
          <label className="form-control w-[100rem] max-w-xs">
            <div className="label">
              <span className="label-text">Saisir un texte </span>
            </div>
            <input type="text" onChange={(e) => onHandleChangeTerm(e.target.value)} className="input input-bordered w-full" placeholder="Nom SGO, Dépositaire, Client / N° agré..." />
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

      {!loading && mandates.length === 0 && <NoDataList />}

      {!loading && mandates.length > 0 && (
        <div className="grid">
          <div className="max-w-screen-2xl ">
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
              <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                <div className="flex items-center flex-1 space-x-4 justify-between">
                  <h5>
                    <span className="text-gray-500"> Yl y a : </span>
                    <span className="dark:text-white">
                      {mandates.length + ' rapport' + (mandates.length > 1 ? 's' : '')}
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
                      {tableSize.map((item) => (
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
                          <label className="font-medium">
                            {moment(mandate?.date).format('DD, MMM YYYY')}
                          </label>
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
                            <button className="btn btn-sm btn-error ml-2 font-bold text-white" onClick={() => onHandleConfirmDelete(mandate)}>
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

      <LoadMandateModal
        token={token as string}
        currentWeek={currentWeek as IWeek}
        success={showSuccessToast}
        error={showErrorToast}
        reload={loadMandates}
      />

      <ConfirmDeleteDialog
        content={contentDelete}
        action={onHandleDelete}
        success={showSuccessToast}
        error={showErrorToast}
      />
    </div>
  )
}

export default MandatesPage
