import { Link, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './store/store'
import { useEffect } from 'react'
import { getCurrentInformation } from './services/systemService'
import { IAssetLineType, IFollowRule, IOpcvmType, ISysInfo, IWeek, IYear } from './type'
import { setCurrentWeek, setCurrentYear } from './store/systemSlice'
import { getAssetLinesTypes, getFollowRules, getOpcvmTypes } from './services/opcService'
import { setAssetLineTypes, setFollowsRules, setOpcvmTypes } from './store/opcSlice'

function App(): JSX.Element {
  const navigate = useNavigate()
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    loadCurrentSysInfo()
    loadFollowsRules()
    loadOpcvmTypes()
    loadAssetLineTypes()
    navigate("/login")
  }, [])

  const loadCurrentSysInfo = async (): Promise<void> => {
    const res = await getCurrentInformation()
    const data: ISysInfo = res.data
    dispatch(setCurrentYear(data.year as IYear))
    dispatch(setCurrentWeek(data.currentWeek as IWeek))
  }

  const loadFollowsRules = async (): Promise<void> => {
    const res = await getFollowRules()
    dispatch(setFollowsRules(res.data as IFollowRule[]))
  }

  const loadOpcvmTypes = async (): Promise<void> => {
    const res = await getOpcvmTypes()
    dispatch(setOpcvmTypes(res.data as IOpcvmType[]))
  }

  const loadAssetLineTypes = async (): Promise<void> => {
    const res = await getAssetLinesTypes()
    dispatch(setAssetLineTypes(res.data as IAssetLineType[]))
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <Link to="/login"> Login </Link>
      <Link to="/dash"> Dashboard </Link>
      <div className="flex items-center py-8 px-4 mx-auto h-screen justify-center">
        <div className=" w-1/3">
          <div className="flex w-full items-center justify-center">
            Chargement ...
          </div>
          <progress className="progress w-full"></progress>
        </div>
      </div>
    </div>
  )
}

export default App
