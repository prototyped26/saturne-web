import { Link, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './store/store'
import { useEffect, useState } from 'react'
import { getCurrentInformation } from './services/systemService'
import { IAssetLineType, IFollowRule, IInvestmentRuleType, IOpcvmType, ISysInfo, IWeek, IYear } from './type'
import { setCurrentWeek, setCurrentYear, setWeeks } from './store/systemSlice'
import { getAssetLinesTypes, getFollowRules, getInvestmentRuleTypes, getOpcvmTypes } from './services/opcService'
import { setAssetLineTypes, setFollowsRules, setInvestmentRuleTypes, setOpcvmTypes } from './store/opcSlice'
import { getMessageErrorRequestEx } from './utils/errors'
import { FaRotate, FaTriangleExclamation } from 'react-icons/fa6'

function App(): JSX.Element {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const [haveError, setHaveError] = useState(false)
 // const [errorMessage, setErrorMessage] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMessage('Initialisation du serveur...')
    setTimeout(() => {
      loadData()
    }, 40000)
  }, [])

  const loadData = async (): Promise<void> => {
    setMessage('Chargement des données ...')
    loadCurrentSysInfo()
    loadFollowsRules()
    loadOpcvmTypes()
    loadAssetLineTypes()
    loadInvestmentRuleTypes()
  }

  const loadCurrentSysInfo = async (): Promise<void> => {
    const res = await getCurrentInformation()
    const data: ISysInfo = res.data
    dispatch(setCurrentYear(data.year as IYear))
    dispatch(setCurrentWeek(data.currentWeek as IWeek))
    dispatch(setWeeks(data.weeks as IWeek[]))
  }

  const loadFollowsRules = async (): Promise<void> => {
    const res = await getFollowRules()
    dispatch(setFollowsRules(res.data as IFollowRule[]))
  }

  const loadOpcvmTypes = async (): Promise<void> => {
    const res = await getOpcvmTypes()
    dispatch(setOpcvmTypes(res.data as IOpcvmType[]))
  }

  const loadInvestmentRuleTypes = async (): Promise<void> => {


    try {
      const res = await getInvestmentRuleTypes()
      dispatch(setInvestmentRuleTypes(res.data as IInvestmentRuleType[]))
      navigate("/login")
    } catch (e) {
      console.log(getMessageErrorRequestEx(e))
      //setErrorMessage(getMessageErrorRequestEx(e))
      setHaveError(true)
    }

  }

  const loadAssetLineTypes = async (): Promise<void> => {
    const res = await getAssetLinesTypes()
    dispatch(setAssetLineTypes(res.data as IAssetLineType[]))
  }

  const onHandleReload = async (): Promise<void> => {
    setHaveError(false)
    loadData()
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <Link className="text-white" to="/login"> Login </Link>
      <Link className="text-white" to="/dash"> Dashboard </Link>

      {haveError && (
        <div className="items-center w-full mt-12">
          <div className="flex w-2/3 mx-auto">
            <div role="alert" className="alert">
              <FaTriangleExclamation size={20} />
              <span className="font-bold">
              Nous vous informons que la connexion au serveur est actuellement indisponible. Si le problème persiste, contactez le fournisseur de service.
            </span>
            </div>
          </div>
          <div className="flex w-2/3 mx-auto items-center mt-4">
            <div role="alert" className="alert alert-warning text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Le serveur d'applications démarre. Veuillez patienter 30 secondes. Si le problème persiste, cliquez sur le bouton 'Réessayer'.</span>
            </div>
          </div>
          <div className="flex w-2/3 mx-auto items-center justify-center mt-10">
            <button disabled={!haveError} className="btn btn-sm btn-outline" onClick={onHandleReload}>
              <FaRotate /> Veuillez réessayer
            </button>
          </div>
        </div>
      )}

      {!haveError && (
        <div className="flex items-center py-8 px-4 mx-auto h-max mt-12 justify-center">
          <div className=" w-1/3">
            <div className="flex w-full items-center justify-center">{message}</div>
            <progress className="progress w-full"></progress>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
