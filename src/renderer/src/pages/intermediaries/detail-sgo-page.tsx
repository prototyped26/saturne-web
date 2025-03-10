import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IHolder, IIntermediary, IOrganization } from '../../type'
import { Link, useNavigate } from 'react-router'
import moment from 'moment'
import { FiEdit, FiEye, FiMoreHorizontal, FiTrash } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { getHoldersOrganization } from '../../services/intermediaryService'
import { setAllHolders } from '../../store/intermediarySlice'
import { toast, ToastContainer } from 'react-toastify'
import EditOrganizationModal from './edit-organization-modal'
import EditHoldersModal from './edit-holders-modal'
import HistoryHolderModal from './history-holder-modal'
import { NumericFormat } from 'react-number-format'

function DetailSgoPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const token: string | null = useAppSelector((state) => state.user.token)
  const intermediary: IIntermediary | null = useAppSelector((state) => state.intermediary.intermediary)
  const holders: IHolder[] = useAppSelector((state) => state.intermediary.holders)
  const [openModal, setOpenModal] = useState(false)
  const [current, setCurrent] = useState('fonds')

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
    document?.getElementById("modal-edit-holders")?.showModal()
  }

  const onHandleShowHistoryHolders = (): void => {
    document?.getElementById("modal-history-holders")?.showModal()
  }

  const closeModal = (): void => {
    console.log("Appel")
    setOpenModal(false)
  }

  return (
    <div className="h-auto">
      <ToastContainer />
      <EditOrganizationModal
        token={token as string}
        organization={intermediary?.organization as IOrganization}
        error={showErrorToast}
        success={showSuccessToast}
      />
      <EditHoldersModal
        data={holders}
        token={token as string}
        success={showSuccessToast}
        error={showErrorToast}
        organization={intermediary?.organization as IOrganization}
        open={openModal}
        change={closeModal}
      />
      <HistoryHolderModal
        token={token as string}
        success={showSuccessToast}
        error={showErrorToast}
        organization={intermediary?.organization as IOrganization}
      />

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
        <div className="w-2/3  rounded-lg  ">
          <div className="h-28 flex gap-4 justify-between w-full">
            <div className="stats shadow">
              <div className="stat place-items-center">
                <div className="stat-title text-[18px]">
                  {'Total Actifs Sous Gestion'.toUpperCase()}
                </div>
                <div className="stat-value text-md"> 1,000,000 XAF</div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="stats shadow">
                <div className="stat place-items-center">
                  <div className="stat-title text-[18px]">Nombre de Fonds</div>
                  <div className="stat-value text-md"> 10</div>
                </div>
              </div>

              <div className="stats shadow">
                <div className="stat place-items-center">
                  <div className="stat-title text-[18px]">Nombre de Mandats</div>
                  <div className="stat-value text-md"> 05</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full mt-4 mb-4">
            <button
              className={
                current === 'fonds' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'
              }
            >
              Liste des fonds
            </button>
            <button
              className={
                current === 'mandats' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'
              }
            >
              Liste des mandats
            </button>
          </div>

          <div className="flex gap-4 w-full border bg-white rounded-lg dark:border-gray-50">
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

              </tbody>
            </table>
          </div>

        </div>

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
            <p className="font-bold"><NumericFormat value={intermediary?.organization?.capital} displayType={'text'} thousandSeparator={true}  suffix={' XAF'} /></p>
          </div>

          {holders.length > 0 && (
            <div>
              <div className="flex justify-between mt-5">
                <h4 className="tracking-tight font-bold text text-app-title ">ACTIONNAIRES</h4>
                <div className="flex gap-2">
                  <button onClick={onHandleUpdateHolders} className="btn btn-sm ">
                    <FiEdit />
                  </button>
                  <button onClick={onHandleShowHistoryHolders} className="btn btn-sm">
                    historique
                  </button>
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

    </div>
  )
}

export default DetailSgoPage
