import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { toast, ToastContainer } from 'react-toastify'
import { useEffect, useState } from 'react'
import { IOpc, IReportSGO, IWeek } from '../../type'
import { listReportSGO, weekReport } from '../../services/opcService'
import { setOpcs, setReportsSgo } from '../../store/opcSlice'
import { getMessageErrorRequestEx } from '../../utils/errors'
import LoadReportModal from './load-report-modal'
import SectionOpcReport from './section/SectionOpcReport'
import SectionSgoReport from './section/SectionSgoReport'

function ReportHebdo(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)

  const currentWeek: IWeek | null = useAppSelector((state) => state.system.currentWeek)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [numberPage, setNumberPage] = useState(0)
  const [tableSize, setTableSize] = useState<number[]>()
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState("opc")

  useEffect(() => {
    //loadOpcsOfWeek()
    setTableSize([5, 10, 20, 50, 100])
  }, [])

  useEffect(() => {
    if (currentPage !== undefined && currentPage !== null) {
      if (current === "opc") loadOpcsOfWeek(currentPage)
      if (current === "sgo") loadReportSgo(currentPage)
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

  const loadReportSgo = async (page: number = 0): Promise<void> => {
    try {
      const res = page ? await listReportSGO(token as string, page) : await listReportSGO(token as string)
      //console.log(res.data)
      dispatch(setReportsSgo(res.data.content as IReportSGO[]))
      setTotal(res.data.totalElements)
      setNumberPage(res.data.totalPages)
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), { theme: 'colored' })
    } finally {
      setLoading(false)
    }
  }

  const onHandleChangePartDetail = (step: 'opc' | 'sgo' ): void => {
    setCurrentPage(0)
    setCurrent(step)
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

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 p-6 mb-4 z-20">
      <ToastContainer key={21223223} />

      <div className="grid grid-cols-2 gap-4 mb-4 pb-2 border-b-2 border-app-primary ">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">
            Rapports
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Rapports OPC, SGO, Dépositaires (Hebdo, Mensuel, Trimestriel, Annuel)
          </p>
        </div>
        <div className="flex  justify-end ">
          <button onClick={() => onHandleUpReport()} className="btn btn-md btn-outline ml-2">
            Charger un rapport (Excel)
          </button>
        </div>
      </div>

      <div className="flex gap-4 border bg-white dark:border-gray-50 rounded-lg mt-2 p-4 mb-2">
        <button
          onClick={() => onHandleChangePartDetail('opc')}
          className={current === 'opc' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'}
        > Rapports OPC
        </button>
        <button
          onClick={() => onHandleChangePartDetail('sgo')}
          className={current === 'sgo' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'}
        >Rapports SGO
        </button>
      </div>

      {current === "opc" && (
        <SectionOpcReport token={token as string} loading={loading} total={total} currentPage={currentPage} perPage={perPage} setPerPage={setPerPage}
                          numberPage={numberPage} tableSize={tableSize as number[]} changePage={onHandleChangePage} showSuccess={showSuccessToast} showError={showErrorToast} />
      )}

      {current === "sgo" && (
        <SectionSgoReport token={token as string} loading={loading} total={total} currentPage={currentPage} perPage={perPage} setPerPage={setPerPage}
                          numberPage={numberPage} tableSize={tableSize as number[]} changePage={onHandleChangePage} showSuccess={showSuccessToast} showError={showErrorToast} />
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
