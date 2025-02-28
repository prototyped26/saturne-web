import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IAssetLine, IFund, IHistoryShareholder, IOpc, IShareholder, IShareholderType } from '../../type'
import { toast, ToastContainer } from 'react-toastify'
import moment from 'moment'
import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import { getlastReportOfFund, getValeurLiquid } from '../../services/opcService'
import PartGeneralInfo from './detail/PartGeneralInfo'
import PartHistoryValueLiquidation from './detail/PartHistoryValueLiquidation'
import PartCompareTwoValue from './detail/PartCompareTwoValue'
import {
  determineTotalPartFund,
  getAllShareholders,
  getHistoryShareholdersOfFund,
  getShareholdersOfFund
} from '../../services/fundService'
import { setShareholders } from '../../store/fundSlice'
import { getMessageErrorRequestEx } from '../../utils/errors'
import PartSubcriptions from './detail/PartSubcriptions'
import PartShareholders from './detail/PartShareholders'

function DetailFundPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const fund: IFund = useAppSelector((state) => state.fund.fund as IFund)
  const funds: IFund[] = useAppSelector((state) => state.fund.funds)
  const listShareholders: IShareholder[] = useAppSelector((state) => state.fund.shareholders)
  const shareholderTypes: IShareholderType[] = useAppSelector((state) => state.fund.shareholdersTypes)

  const [current, setCurrent] = useState('general')
  const [lastOpc, setLastOpc] = useState<IOpc | null>(null)
  const [holders, setHolders] = useState<IShareholder[]>([])
  const [history, setHistory] = useState<IHistoryShareholder[]>([])
  const [loadSharesholders, setLoadShareholders] = useState(false)
  const [parts, setParts] = useState(0)

  useEffect(() => {
    console.log(fund)
    loadLastOpc()
    loadShareholdersFund()
    loadHistoryShareholdersFund()
  }, [])

  const loadLastOpc = async (): Promise<void> => {
    const res = await getlastReportOfFund(token as string, fund?.id as number)
    setLastOpc(res?.data as IOpc)
    setParts(determineTotalPartFund(res?.data as IOpc))
    console.log(res?.data)
  }

  const loadAllShareholders = async (): Promise<void> => {
    try {
      const res = await getAllShareholders(token as string)
      dispatch(setShareholders(res.data))
    } catch (e) {
      showErrorToast(getMessageErrorRequestEx(e))
    }
  }

  const loadShareholdersFund = async (): Promise<void> => {
    setLoadShareholders(true)
    try {
      const res = await getShareholdersOfFund(token as string, fund?.id as number)
      setHolders(res?.data as IShareholder[])
    } catch (e) {
      showErrorToast(getMessageErrorRequestEx(e))
    } finally {
      setLoadShareholders(false)
    }
  }

  const loadHistoryShareholdersFund = async (): Promise<void> => {
    setLoadShareholders(true)
    try {
      const res = await getHistoryShareholdersOfFund(token as string, fund?.id as number)
      setHistory(res?.data as IHistoryShareholder[])
    } catch (e) {
      showErrorToast(getMessageErrorRequestEx(e))
    } finally {
      setLoadShareholders(false)
    }
  }

  const onHandleChangeContent = (label: string): void => {
    setCurrent(label)
  }

  const showSuccessToast = (msg: string): void => {
    toast.success(msg, { theme: 'colored'})
  }

  const showSuccessToastWithReload = (msg: string): void => {
    toast.success(msg, { theme: 'colored'})
    loadAllShareholders()
    loadShareholdersFund()
  }

  const showErrorToast = (msg: string): void => {
    toast.error(msg, { theme: 'colored'})
  }

  return (
    <div className="h-auto">
      <ToastContainer />
      <div className="border bg-white rounded-lg dark:border-gray-50 p-6 z-20">
        <div className="flex justify-between gap-4">
          <div className="">
            <h3 className="tracking-tight font-bold text-2xl text-app-title">Détail du fond</h3>
            <div className="flex justify-between gap-14 mt-2">
              <div>
                <p className="text-sm ml-2 ">
                  <span className="font-black">Fond : </span>{' '}
                  <span className="">{fund?.label}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Agrément : </span>{' '}
                  <span className="">{fund?.approval_number}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Date d&#39;agrément: </span>{' '}
                  <span className="">{moment(fund?.approval_date).format('DD-MM-YYYY')}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Société : </span>{' '}
                  <span className="">{fund?.intermediary?.label}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Classification : </span>{' '}
                  <span className="">{fund?.classification?.label}</span>
                </p>
              </div>
              <div>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Dépositaire : </span>{' '}
                  <span className="">{fund?.depositary?.label}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Politique de distribution : </span>{' '}
                  <span className="">{fund?.distribution?.label}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Réseau de distribution : </span>{' '}
                  <span className="">{fund?.distribution_network}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Commissaire au compte : </span>{' '}
                  <span className="">{fund?.auditor?.label}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex  justify-end ">
            <Link to="/dash/funds" className="btn btn-md ml-2">
              Retour
            </Link>
          </div>
        </div>
      </div>

      <div className="border bg-white rounded-lg dark:border-gray-50 px-6 py-3 flex mt-4 gap-4">
        <button
          onClick={() => onHandleChangeContent('general')}
          className={current === 'general' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'}
        >
          Général
        </button>
        <button
          onClick={() => onHandleChangeContent('historique')}
          className={
            current === 'historique' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'
          }
        >
          Historique V.L
        </button>
        <button
          onClick={() => onHandleChangeContent('comparer')}
          className={current === 'comparer' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'}
        >
          Evaluer avec un autre
        </button>

        <button
          onClick={() => onHandleChangeContent('souscription')}
          className={
            current === 'souscription' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'
          }
        >
          Souscriptions & rachats
        </button>
        <button
          onClick={() => onHandleChangeContent('parts')}
          className={current === 'parts' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'}
        >
          Porteurs de parts
        </button>
      </div>
      {fund !== null && (
        <div className=" py-2 flex mt-4 gap-4 w-full">
          {current === 'general' && <PartGeneralInfo opc={lastOpc as IOpc} parts={parts} />}
          {current === 'historique' && (
            <PartHistoryValueLiquidation fund={fund} token={token as string} />
          )}
          {current === 'comparer' && (
            <PartCompareTwoValue
              fund={fund}
              token={token as string}
              funds={funds.filter((f) => f.id !== fund?.id)}
              success={showSuccessToast}
              error={showErrorToast}
            />
          )}
          {current === 'souscription' && !loadSharesholders && (
            <PartSubcriptions
              fund={fund}
              types={shareholderTypes}
              token={token as string}
              shareholders={listShareholders}
              success={showSuccessToastWithReload}
              error={showErrorToast}
              parts={parts}
              liquidation={getValeurLiquid(lastOpc?.assetLines as IAssetLine[]) as number}
            />
          )}
          {current === 'parts' && !loadSharesholders && (
            <PartShareholders shareholders={holders} parts={parts} history={history} />
          )}
        </div>
      )}
    </div>
  )
}

export default DetailFundPage
