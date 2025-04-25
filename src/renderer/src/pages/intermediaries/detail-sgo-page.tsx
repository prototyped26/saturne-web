import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IDashActifs, IHolder, IIntermediary, IOrganization } from '../../type'
import { Link, useNavigate } from 'react-router'
import moment from 'moment'
import { FiEdit } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import {
  getHoldersOrganization,
  getIntermediaryTotalActif,
  updateIntermediary
} from '../../services/intermediaryService'
import { setAllHolders } from '../../store/intermediarySlice'
import { toast, ToastContainer } from 'react-toastify'
import EditOrganizationModal from './edit-organization-modal'
import EditHoldersModal from './edit-holders-modal'
import HistoryHolderModal from './history-holder-modal'
import { NumericFormat } from 'react-number-format'
import { getMessageErrorRequestEx } from '../../utils/errors'
import NoDataList from '../../components/NoDataList'
import FundsSgoList from './funds-sgo-list'
import { getDashActifs } from '@renderer/services/opcService'

function DetailSgoPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const token: string | null = useAppSelector((state) => state.user.token)
  const intermediary: IIntermediary | null = useAppSelector((state) => state.intermediary.intermediary)
  const holders: IHolder[] = useAppSelector((state) => state.intermediary.holders)

  const [openModal, setOpenModal] = useState(false)
  const [current, setCurrent] = useState('fonds')
  const [totalActifs, setTotalActifs] = useState(0)
  const [organization, setOrganization] = useState<IOrganization | null>(null)
  const [dashActifs, setDashActifs] = useState<IDashActifs | null>(null)

  useEffect(() => {
    setCurrent('fonds')
    loadDashActifs()
  }, [])

  useEffect(() => {
    console.log(intermediary)
    if (intermediary !== null) {
      if (intermediary?.organization !== null) {
        loadHolders()
        setOrganization(intermediary?.organization as IOrganization)
      } {
        const org: IOrganization = {
          label: intermediary?.label,
          capital: 0,
          header: intermediary?.head,
          status: '',
          id: null
        }
        setOrganization(org)
      }
      loadTotalActifs()
    }
  }, [intermediary])

  const onHandleClickEdit = (): void => {
    navigate("/dash/intermediaries/update")
  }

  const loadDashActifs = async (): Promise<void> => {
    try {
      const res = await getDashActifs(token as string, intermediary?.id as number)
      setDashActifs(res.data as IDashActifs)
    } catch (e) {

    setDashActifs({
        ...dashActifs,
        actifsFund: 0,
        actifsMandate: 0,
        countSgo: 0,
        totalActifs: 0
      })
      console.log(getMessageErrorRequestEx(e))
    }
  }

  const loadHolders = async (): Promise<void> => {
    const res = await getHoldersOrganization(token as string, intermediary?.organization?.id as number)
    dispatch(setAllHolders(res.data as IHolder[]))
  }

  const loadTotalActifs = async (): Promise<void> => {
    try {
      const res = await getIntermediaryTotalActif(token as string, intermediary?.id as number)
      setTotalActifs(res.data as number)
    } catch (e) {
      showErrorToast(getMessageErrorRequestEx(e))
    }
  }

  const updateIntermediaryWithOrg = async (org: IOrganization): Promise<void> => {
    try {
      const interAtt = intermediary as IIntermediary
      const inter: IIntermediary = {
        ...interAtt,
        organization_id: org.id as number,
        category_id: interAtt?.category?.id as number
      }

      await updateIntermediary(token as string, intermediary?.id as number, inter)
    } catch (e) {
      showErrorToast(getMessageErrorRequestEx(e))
    }
  }

  const calculatePercentValue = (value: number): number => {
    let res = 0

    try {
      res = (value / Number(dashActifs?.totalActifs)) * 100
    } catch (e) {
      console.log(e)
    }

    return Number(res.toFixed(2))
  }

  const onHoldeEditOrg = (): void => {
    // @ts-ignore Diasy UI
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
    // @ts-ignore Diasy UI
    document?.getElementById("modal-edit-holders")?.showModal()
  }

  const onHandleShowHistoryHolders = (): void => {
    // @ts-ignore Diasy UI
    document?.getElementById("modal-history-holders")?.showModal()
  }

  const closeModal = (): void => {
    console.log("Appel")
    setOpenModal(false)
  }

  return (
    <div className="h-auto">
      <ToastContainer />

      {organization && (
        <EditOrganizationModal
          token={token as string}
          organization={organization as IOrganization}
          onAddOrganization={updateIntermediaryWithOrg}
          error={showErrorToast}
          success={showSuccessToast}
        />
      )}

      {intermediary?.organization && (
        <div>
          <EditHoldersModal
            data={holders}
            token={token as string}
            success={showSuccessToast}
            error={showErrorToast}
            organization={intermediary?.organization as IOrganization}
            open={openModal}
            change={closeModal}
          />
        </div>
      )}
      {intermediary?.organization && (
        <HistoryHolderModal
          token={token as string}
          success={showSuccessToast}
          error={showErrorToast}
          organization={intermediary?.organization as IOrganization}
        />
      )}

      <div className="border bg-white rounded-lg dark:border-gray-50 p-6 z-20">
        <div className="flex justify-between gap-4">
          <div className="">
            <h3 className="tracking-tight font-bold text-2xl text-app-title">
              {intermediary?.label}
              <button onClick={onHandleClickEdit} className="btn btn-sm ml-2">
                <FiEdit />
              </button>
            </h3>
            <div className="flex gap-6">
              <h4 className="tracking-tight font-bold text-xl text-app-title">
                {intermediary?.approval_number}
              </h4>
              <p className="tracking-tight font-light text-1xl text-app-sub-title">
                Date agrément :{' '}
                <label className="font-bold">
                  {moment(intermediary?.approval_date).format('DD MMMM YYYY')}
                </label>
              </p>
              <h4 className="badge badge-info font-bold text-white mt-1">
                {intermediary?.category?.label?.toUpperCase()}
              </h4>
            </div>
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
          <div className=" flex gap-4 justify-between w-full">
            <div className="w-full">
              <div className="stats shadow w-full">
                <div className="stat">
                  <div className="stat-title text-[18px]">
                    {'Total Actifs gérés'.toUpperCase()}
                  </div>
                  {intermediary?.category?.code === 'SGO' && (
                    <div className="stat-value text-[28px]">
                      <NumericFormat
                        value={totalActifs.toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={' '}
                        suffix={' XAF'}
                      />
                    </div>
                  )}
                  {intermediary?.category?.code !== 'SGO' && (
                    <div className="stat-value text-md"> NON APPLICABLE</div>
                  )}
                </div>
              </div>

              <div className="rounded-lg shadow w-full mt-4 p2">
                <div className="px-4 my-2">
                  <div className="flex justify-between">
                    <p className="text-md">
                      <p>Total Actifs OPC </p>
                    </p>
                    <p>{calculatePercentValue(dashActifs?.actifsFund as number)} %</p>
                  </div>
                  <progress
                    className="progress  w-full"
                    value={calculatePercentValue(dashActifs?.actifsFund as number)}
                    max="100"
                  ></progress>
                </div>
                <div className="px-4 my-2">
                  <div className="flex justify-between">
                    <p className="text-md">
                      <p>Total Actifs Mandats </p>
                    </p>
                    <p>{calculatePercentValue(dashActifs?.actifsMandate as number)} %</p>
                  </div>
                  <progress
                    className="progress progress-accent w-full"
                    value={calculatePercentValue(dashActifs?.actifsMandate as number)}
                    max="100"
                  ></progress>
                </div>
              </div>
            </div>

            <div className="h-28 flex gap-4">
              <div className="stats shadow">
                <div className="stat place-items-center">
                  <div className="stat-title text-[18px]">Nombre de Fonds</div>
                  <div className="stat-value text-md">{intermediary?.countFund}</div>
                </div>
              </div>

              <div className="stats shadow">
                <div className="stat place-items-center">
                  <div className="stat-title text-[18px]">Nombre de Mandats</div>
                  <div className="stat-value text-md">{intermediary?.countMandatory}</div>
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

          <FundsSgoList intermediary={intermediary as IIntermediary} token={token as string} />

        </div>

        {intermediary?.category?.code === 'SGO' && (
          <div className="w-1/3 border bg-white rounded-lg dark:border-gray-50 p-4">
            <div className="flex justify-between">
              <h4 className="tracking-tight font-bold text-app-title">LA SOCIETE</h4>
              {organization && (
                <button onClick={() => onHoldeEditOrg()} className="btn btn-sm ml-2">
                  <FiEdit />
                </button>
              )}
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
              <p className="font-bold">
                <NumericFormat
                  value={intermediary?.organization?.capital}
                  displayType={'text'}
                  thousandSeparator={' '}
                  suffix={' XAF'}
                />
              </p>
            </div>

            {intermediary?.organization && (
              <div>
                <div className="flex justify-between mt-5">
                  <h4 className="tracking-tight font-bold text text-app-title ">ACTIONNAIRES</h4>
                  <div className="flex gap-2">
                    <button onClick={onHandleUpdateHolders} className="btn btn-sm ">
                      <FiEdit />
                    </button>
                    {holders?.length > 0 && (
                      <button onClick={onHandleShowHistoryHolders} className="btn btn-sm">
                        historique
                      </button>
                    )}
                  </div>
                </div>

                {holders?.length > 0 && (
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
                )}

                {holders?.length === 0 && (
                  <NoDataList message={"Aucun actionnaire n'a été enregistré à ce jour.."} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailSgoPage
