import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IIntermediary } from '../../type'
import { Link, useNavigate } from 'react-router'
import moment from 'moment'
import { FiEdit } from 'react-icons/fi'

function DetailSgoPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const intermediary: IIntermediary | null = useAppSelector((state) => state.intermediary.intermediary)

  const onHandleClickEdit = (): void => {
    navigate("/dash/intermediaries/update")
  }

  return (
    <div className="h-auto">

      <div className="border bg-white rounded-lg dark:border-gray-50 p-6 z-20">
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <h3 className="tracking-tight font-bold text-3xl text-app-title">
              {intermediary?.label + ' ' + intermediary?.approval_number}
              <button onClick={onHandleClickEdit} className="btn btn-sm ml-2"><FiEdit /></button>
            </h3>
            <p className="tracking-tight font-light text-1xl text-app-sub-title">
              Société agrée le {moment(intermediary?.approval_date).format("DD MMMM YYYY")}
            </p>
          </div>
          <div className="flex  justify-end ">
            <Link to="/dash/intermediaries" className="btn btn-md ml-2">
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64"
        ></div>
        <div
          className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"
        ></div>
        <div
          className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"
        ></div>
        <div
          className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div
          className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
        ></div>
        <div
          className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
        ></div>
        <div
          className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
        ></div>
        <div
          className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
        ></div>
      </div>

    </div>
  )
}

export default DetailSgoPage
