import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import {
  IAssetLine,
  ICategory,
  IClassification,
  IDepository,
  IDistribution, IFollowRule,
  IFund, IFundWithFollowRule, IHistoryShareholder,
  IIntermediary,
  IOpc, IReqFindFundByRatio, IShareholder, IShareholderType,
  IWeek
} from '../../type'
import { useEffect, useState } from 'react'
import {
  determineTotalPartFund,
  getAllShareholders,
  getClassifications,
  getDepositaries,
  getDistributions,
  getFunds, getHistoryShareholdersOfFund, getShareholdersOfFund,
  getTypesOpc
} from '../../services/fundService'
import {
  setClassifications, setCurrentFund,
  setDepositaries,
  setDistributions,
  setFunds, setShareholders,
  setTypesOpc
} from '../../store/fundSlice'
import { toast, ToastContainer } from 'react-toastify'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { getCategories, getIntermediaries } from '../../services/intermediaryService'
import { setCategories, setIntermediaries } from '../../store/intermediarySlice'
import { FiEye, FiSearch } from 'react-icons/fi'
import moment from 'moment'
import {
  getFollowFundGrouped, getFundByFollowInstructions,
  getlastReportOfFund,
  getReportOfFundAndWeek,
  getValeurLiquid
} from '../../services/opcService'
import LoadingTable from '../../components/LoadingTable'
import NoDataList from '../../components/NoDataList'
import CompositionDetailFundReport from '../../components/CompositionDetailFundReport'
import PartHistoryValueLiquidation from '../funds/detail/PartHistoryValueLiquidation'
import PartSubcriptions from '../funds/detail/PartSubcriptions'
import PartShareholders from '../funds/detail/PartShareholders'
import BadgeRiskString from '../../components/BadgeRiskString'
import { useNavigate} from 'react-router'

function QueriesPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const token: string | null = useAppSelector((state) => state.user.token)
  const intermediaries: IIntermediary[] = useAppSelector((state) => state.intermediary.intermediaries)
  const categories: ICategory[] = useAppSelector((state) => state.intermediary.categories)
  const funds: IFund[] = useAppSelector((state) => state.fund.funds)
  const claissifications: IClassification[] = useAppSelector((state) => state.fund.classifications)
  const depositaries: IDepository[] = useAppSelector((state) => state.fund.depositaries)
  const distributions: IDistribution[] = useAppSelector((state) => state.fund.distributions)
  const weeks: IWeek[] = useAppSelector((state) => state.system.weeks)
  const shareholderTypes: IShareholderType[] = useAppSelector((state) => state.fund.shareholdersTypes)
  const listShareholders: IShareholder[] = useAppSelector((state) => state.fund.shareholders)

  const [loading, setLoading] = useState(true)

  const [filterIntermediaries, setFilterIntermediaries] = useState<IIntermediary[]>([])
  const [filterFunds, setFilterFunds] = useState<IFund[]>([])
  const [selectedCategorie, setSelectedCategorie] = useState('')
  const [selectedIntermediary, setSelectedIntermediary] = useState('')
  const [selectedOpration, setSelectedOpration] = useState('')
  const [selectedWeek, setSelectedWeek] = useState('')
  const [selectedFund, setSelectedFund] = useState('')
  const [showList, setShowList] = useState(true)
  const [opc, setOpc] = useState<IOpc | null>(null)
  const [fund, setFund] = useState<IFund | null>(null)
  const [lastOpc, setLastOpc] = useState<IOpc | null>(null)
  const [holders, setHolders] = useState<IShareholder[]>([])
  const [history, setHistory] = useState<IHistoryShareholder[]>([])
  const [loadSharesholders, setLoadShareholders] = useState(false)
  const [parts, setParts] = useState(0)
  const [investorsLoaded, setInvestorsLoaded] = useState(false)
  const [followRules, setFollowRules] = useState<IFollowRule[]>([])
  const [subFollowRules, setSubFollowRules] = useState<IFollowRule[]>([])
  const [selectedFollowRule, setSelectedFollowRule] = useState('')
  const [selectedSubFollowRule, setSelectedSubFollowRule] = useState('')
  const [selectedRatioAction, setSelectedRatioAction] = useState('')
  const [followFunds, setFollowFunds] = useState<IFundWithFollowRule[]>([])

  useEffect(() => {
    loadFollowsRulesGrouped()
    loadCategories(token as string)
    loadIntermediaries(token as string)
    loadFunds(token as string)
    loadClassifications(token as string)
    loadDepositaries(token as string)
    loadDistributions(token as string)
    loadTypesOpc(token as string)
    loadAllShareholders()
  }, [])

  useEffect(() => {
    if (selectedFund.length > 0) {
      const res = funds.find((fund) => fund.id === Number(selectedFund))
      setFund(res as IFund)
    }
  }, [selectedFund])

  useEffect(() => {

  }, [showList, loadSharesholders, distributions, depositaries, claissifications])

  const loadFunds = async (t: string): Promise<void> => {
    try {
      const res = await getFunds(t)
      dispatch(setFunds(res.data))
      setFilterFunds(res.data)
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

  const loadIntermediaries = async (t: string): Promise<void> => {
    try {
      const res = await getIntermediaries(t)
      dispatch(setIntermediaries(res.data))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async (t: string): Promise<void> => {
    try {
      const res = await getCategories(t)
      dispatch(setCategories(res.data))
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
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

  const loadFollowsRulesGrouped = async (): Promise<void> => {
    try {
      const res = await getFollowFundGrouped(token as string)
      const tab = res.data as IFollowRule[]
      const arr = tab.filter((elt) => !elt?.label?.toLowerCase().includes('obligations divers'))
      setFollowRules(arr)
    } catch (e) {
      showErrorToast(getMessageErrorRequestEx(e))
    }
  }

  const showSuccessToast = (msg: string): void => {
    toast.success(msg, { theme: 'colored'})
  }

  const showErrorToast = (msg: string): void => {
    toast.error(msg, { theme: 'colored'})
  }

  const onHandleSearch = async (): Promise<void> => {
    switch (selectedOpration) {
      case 'composition': {
        if (selectedFund.length === 0) {
          toast.error('Veuillez choisir le fond', { theme: 'colored' })
          break
        }
        if (selectedWeek.length === 0) {
          toast.error('Veuillez choisir la semaine', { theme: 'colored' })
          break
        }
        loadOpcWithDetail()
      }
      break
      case 'souscriptions': {
          if (selectedFund.length === 0) {
            toast.error('Veuillez choisir le fond', { theme: 'colored' })
            break
          }
          setLoading(true)
          try {
            loadLastOpc()
          } catch (e) {
            showErrorToast(getMessageErrorRequestEx(e))
          } finally {
            setLoading(false)
          }
      }
      break
      case 'investisseurs': {
        if (selectedFund.length === 0) {
         showErrorToast('Veuillez choisir le fond')
          break
        }
        loadShareholdersFund()
        loadHistoryShareholdersFund()
        setInvestorsLoaded(true)
      }
      break
      case 'ratios': {
        if (selectedFollowRule.length === 0) {
          showErrorToast('Veuillez choisir le ratio')
          break
        }
        if (selectedRatioAction.length === 0) {
          showErrorToast('Veuillez choisir le critère de conformité')
          break
        }
        loadFundByFollowRules()
      }
        break
    }
  }

  const onHandleChangeCategorie = (val): void => {
    if (val.length > 0) {
      setSelectedCategorie(val)
      const arr = intermediaries.filter((inter) => inter?.category?.id === Number(val))
      setFilterIntermediaries(arr)
    } else {
      setSelectedCategorie('')
      setFilterIntermediaries(intermediaries)
    }
  }

  const onHandleChangeIntermediary = (val): void => {
    if (val.length > 0) {
      setSelectedIntermediary(val)
      const arr = funds.filter((fund) => fund?.intermediary?.id === Number(val))
      setFilterFunds(arr)
    } else {
      setSelectedIntermediary('')
      setFilterFunds(funds)
    }
  }

  const onHandleChangeAction = (val): void => {
    setSelectedOpration(val)
    switch (val) {
      case 'composition': {
        setShowList(false)
      }
      break
      default: setShowList(true)
    }
  }

  const onHandleChangeFollowRule = (val): void => {
    setSelectedFollowRule(val)
    if (val.length > 0) {
      const arr = followRules.find((rule) => rule.id === Number(val))?.subRules as IFollowRule[]
      setSubFollowRules(arr)
    } else {
      setSubFollowRules([])
    }
  }

  const onHandleNavToDetails = (fund: IFund): void => {
    dispatch(setCurrentFund(fund))
    navigate('/dash/funds/details')
  }

  const loadOpcWithDetail = async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await getReportOfFundAndWeek(token as string, Number(selectedFund), Number(selectedWeek))
      setOpc(res.data)
      console.log(res.data)
      console.log('chargement ')
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), { theme: 'colored' })
    } finally {
      setLoading(false)
    }
  }

  const loadFundByFollowRules = async (): Promise<void> => {
    setLoading(true)
    try {
      const req: IReqFindFundByRatio = {
        rule_id: Number(selectedFollowRule),
        sub_rule_id: selectedSubFollowRule.length > 0 ? Number(selectedSubFollowRule) : 0,
        standard: selectedRatioAction === 'YES'
      }
      const res = await getFundByFollowInstructions(token as string, req)
      //console.log(res.data)
      setFollowFunds(res.data as IFundWithFollowRule[])
    } catch (e) {
      showErrorToast(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50  p-6 mb-4 z-20">
      <ToastContainer key={112233} />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">Requêtes</h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Système de requêtes interne
          </p>
        </div>
        <div className="flex  justify-end "></div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4 border-b-2 border-app-primary">
        <div className=" flex items-center">
          <div className="flex mr-2 w-1/3">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Catégorie</span>
              </div>
              <select
                value={selectedCategorie}
                onChange={(e) => onHandleChangeCategorie(e.target.value)}
                className="select select-bordered"
              >
                <option>Tous</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex mr-2 w-1/3">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Intermédiaire</span>
              </div>
              <select
                value={selectedIntermediary}
                onChange={(e) => onHandleChangeIntermediary(e.target.value)}
                className="select select-bordered"
              >
                <option>Tous</option>
                {filterIntermediaries.map((intermediary) => (
                  <option key={intermediary.id} value={intermediary.id}>
                    {intermediary.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex mr-2 w-1/3">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Fond</span>
              </div>
              <select
                className="select select-bordered"
                value={selectedFund}
                onChange={(e) => setSelectedFund(e.target.value)}
              >
                <option>Tous</option>
                {filterFunds.map((fund) => (
                  <option key={fund.id} value={fund.id}>
                    {fund.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex mr-2 w-1/3">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Opération</span>
              </div>
              <select
                className="select select-bordered"
                value={selectedOpration}
                onChange={(e) => onHandleChangeAction(e.target.value)}
              >
                <option value="">Liste</option>
                <option value="composition">Composition</option>
                <option value="liquidative">Valeur Liquidative</option>
                <option value="souscriptions">Souscriptions/Rachats</option>
                <option value="investisseurs">Porteurs de parts</option>
                <option value="ratios">Respect des ratios</option>
              </select>
            </label>
          </div>

          <div className="flex mt-8 w-full">
            <button disabled={loading} onClick={() => onHandleSearch()} className="btn btn-md ml-2">
              <FiSearch size={24} /> APPLIQUER
            </button>
          </div>
        </div>

        <div className=" flex items-center pb-4">
          {selectedOpration === 'composition' && (
            <div className="flex mr-2">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Période (Semaine)</span>
                </div>
                <select
                  className="select select-bordered mb-2"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                >
                  <option></option>
                  {weeks.map((week) => (
                    <option key={(week?.id as number) + Math.random()} value={week.id}>
                      {' '}
                      {week.label}{' '}
                      {' : Du ' +
                        moment(week.start).format('DD MMM YYYY') +
                        ' au ' +
                        moment(week.end).format('DD MMM YYYY')}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {selectedOpration === 'ratios' && (
            <div className="flex">
              <div className="flex mr-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Ratio</span>
                  </div>
                  <select
                    className="select select-bordered"
                    value={selectedFollowRule}
                    onChange={(e) => onHandleChangeFollowRule(e.target.value)}
                  >
                    <option value=""></option>
                    {followRules.map((rule) => (
                      <option key={Number(rule.id) + Date.now()} value={rule.id}>
                        {rule.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex mr-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Règle</span>
                  </div>
                  <select
                    className="select select-bordered"
                    value={selectedSubFollowRule}
                    onChange={(e) => setSelectedSubFollowRule(e.target.value)}
                  >
                    <option value=""></option>
                    {subFollowRules.map((rule) => (
                      <option key={Number(rule.id) + Date.now()} value={rule.id}>
                        {rule.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex mr-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Action (Puis <i className="font-medium">APPLIQUER</i>)</span>
                  </div>
                  <select className="select select-bordered" value={selectedRatioAction} onChange={(e) => setSelectedRatioAction(e.target.value)}>
                    <option value=""></option>
                    <option value="YES">Confrme</option>
                    <option value="NO">Non Confrme</option>
                  </select>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* {selectedOpration.length === 0 && funds.length > 0 && (
        <div className="grid">
          <div className="max-w-screen-2xl ">
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
              <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                <div className="flex items-center flex-1 space-x-4">
                  <h5>
                    <span className="text-gray-500">Il y a :</span>
                    <span className="dark:text-white">
                      {filterFunds.length + ' fond' + (filterFunds.length > 1 ? 's' : '')}{' '}
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
                    {filterFunds.map((fund) => (
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
                          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {selectedOpration === 'composition' && (
        <div className="grid">
          {loading && <LoadingTable />}
          {!loading && opc === null && <NoDataList />}
          {!loading && opc !== null && <CompositionDetailFundReport opc={opc} />}
        </div>
      )}

      {selectedOpration === 'liquidative' && fund !== null && (
        <PartHistoryValueLiquidation fund={fund as IFund} token={token as string} />
      )}

      {selectedOpration === 'souscriptions' && (
        <div className="grid">
          {loading && <LoadingTable />}
          {!loading && (
            <PartSubcriptions
              fund={fund as IFund}
              types={shareholderTypes}
              token={token as string}
              shareholders={listShareholders}
              success={showSuccessToast}
              error={showErrorToast}
              parts={parts}
              liquidation={getValeurLiquid(lastOpc?.assetLines as IAssetLine[]) as number}
              noaction={true}
            />
          )}
        </div>
      )}

      {selectedOpration === 'investisseurs' && investorsLoaded && (
        <PartShareholders shareholders={holders} parts={parts} history={history} />
      )}

      {selectedOpration === 'ratios' && (
        <div className="grid">
          {loading && <LoadingTable />}
          {!loading && followFunds === null && <NoDataList />}
          {!loading && followFunds !== null && (
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
                    Risque
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Observation
                  </th>
                  <th scope="col" className="px-4 py-3"></th>
                </tr>
                </thead>
                <tbody>
                {followFunds.map((elt) => (
                  <tr
                    key={Number(elt.fund.id) * Date.now()}
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
                      {elt.fund?.label} <br />
                      <label className="font-light">
                        {elt.fund?.intermediary?.label?.toUpperCase()}
                      </label>
                    </th>
                    <td className="px-4 py-2">
                      <label className="font-medium">{elt.fund?.approval_number}</label>
                      <br />
                      <label className="font-light">
                        Du {moment(elt.fund?.approval_date).format('DD MMMM YYYY')}
                      </label>
                    </td>
                    <td className="px-4 py-2"> {elt.risk.toFixed(2) + ' %'}  </td>
                    <td className="px-4 py-2"><BadgeRiskString label={elt.observation.toUpperCase()} /></td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex justify-end">
                        <button
                          onClick={() => onHandleNavToDetails(elt.fund)}
                          className="btn btn-sm"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default QueriesPage
