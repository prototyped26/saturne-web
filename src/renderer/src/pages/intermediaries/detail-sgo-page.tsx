import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IHolder, IIntermediary, IOrganization } from '../../type'
import { Link, useNavigate } from 'react-router'
import moment from 'moment'
import { FiEdit } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { getHoldersOrganization } from '../../services/intermediaryService'
import { setAllHolders } from '../../store/intermediarySlice'
import { toast, ToastContainer } from 'react-toastify'
import EditOrganizationModal from './edit-organization-modal'
import EditHoldersModal from './edit-holders-modal'

function DetailSgoPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const token: string | null = useAppSelector((state) => state.user.token)
  const intermediary: IIntermediary | null = useAppSelector((state) => state.intermediary.intermediary)
  const holders: IHolder[] = useAppSelector((state) => state.intermediary.holders)
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    if (intermediary !== null) {
      if (intermediary?.organization !== null) loadHolders()
    }
  }, [intermediary])

  const onHandleClickEdit = (): void => {
    navigate("/dash/intermediaries/update")
  }

  const loadHolders = async (): Promise<void> => {
    const res = await getHoldersOrganization(token as string, intermediary?.organization?.id as number)
    dispatch(setAllHolders(res.data as IHolder[]))
  }

  const onHoldeEditOrg = (): void => {
    document.getElementById('modal-edit-organization').showModal()
  }

  const showSuccessToast = (msg: string): void => {
    toast.success(msg, { theme: 'colored'})
  }

  const showErrorToast = (msg: string): void => {
    toast.error(msg, { theme: 'colored'})
  }

  const onHandleUpdateHolders = (): void => {
    //setHolders(holders)
    setOpenModal(true)
    document.getElementById("modal-edit-holders").showModal()
  }

  const closeModal = (): void => {
    console.log("Appel")
    setOpenModal(false)
  }

  return (
    <div className="h-auto">

      <ToastContainer />
      <EditOrganizationModal token={token as string} organization={intermediary?.organization as IOrganization} error={showErrorToast} success={showSuccessToast} />
      <EditHoldersModal data={holders} token={token as string} success={showSuccessToast}
                        error={showErrorToast} organization={intermediary?.organization as IOrganization}
                        open={openModal} change={closeModal} />

      <div className="border bg-white rounded-lg dark:border-gray-50 p-6 z-20">
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <h3 className="tracking-tight font-bold text-3xl text-app-title">
              {intermediary?.label + ' ' + intermediary?.approval_number}
              <button onClick={onHandleClickEdit} className="btn btn-sm ml-2">
                <FiEdit />
              </button>
            </h3>
            <p className="tracking-tight font-light text-1xl text-app-sub-title">
              Société agrée le {moment(intermediary?.approval_date).format('DD MMMM YYYY')}
            </p>
            <p className="tracking-tight font-light text-1xl text-app-sub-title">
              {intermediary?.adress}
            </p>
            <p className="tracking-tight font-light text-1xl text-app-sub-title">
              {intermediary?.contacts}
            </p>
          </div>
          <div className="flex  justify-end ">
            <Link to="/dash/intermediaries" className="btn btn-md ml-2">
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>

      <div className="flex w-full my-4 gap-4">
        <div className="w-2/3 h-32 border-2 rounded-lg border-dashed"></div>

        <div className="w-1/3 border bg-white rounded-lg dark:border-gray-50 p-4">
          <div className="flex justify-between">
            <h4 className="tracking-tight font-bold text-app-title">LA SOCIETE</h4>
            <button onClick={() => onHoldeEditOrg()} className="btn btn-sm ml-2">
              <FiEdit />
            </button>
          </div>

          <div className="flex gap-2">
            <div className="w-1/3 items-end flex">
              <p className=""> {intermediary?.leader_status} </p>
            </div>
            <p className="font-bold">{intermediary?.leader_name}</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 items-end flex">
              <p className="">Capital </p>
            </div>
            <p className="font-bold"> {intermediary?.organization?.capital} F.CFA</p>
          </div>

          {holders.length > 0 && (
            <div>
              <div className="flex justify-between mt-5">
                <h4 className="tracking-tight font-bold text text-app-title ">ACTIONNAIRES</h4>
                <div className="flex gap-2">
                  <button onClick={onHandleUpdateHolders} className="btn btn-sm ">
                    <FiEdit />
                  </button>
                  <button className="btn btn-sm">historique</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom & Prénom</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holders.map((holder) => (
                      <tr key={holder.id}>
                        <td className="font-bold">{holder.first_name}</td>
                        <td>{holder.percent} %</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64"></div>
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
      </div>
    </div>
  )
}

export default DetailSgoPage
