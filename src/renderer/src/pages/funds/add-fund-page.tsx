import { Link, useNavigate } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IClassification, IDepository, IDistribution, IFund, IIntermediary, ITypeOpc } from '../../type'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { createFund } from '../../services/fundService'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { addFund } from '../../store/fundSlice'
import { setInformationMessage, setSuccess } from '../../store/informationSlice'

function AddFundPage(): JSX.Element {
  const navigate = useNavigate()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const typesOpc: ITypeOpc[] = useAppSelector((state) => state.fund.typesOpc)
  const classifications: IClassification[] = useAppSelector((state) => state.fund.classifications)
  const depositaries: IDepository[] = useAppSelector((state) => state.fund.depositaries)
  const distributions: IDistribution[] = useAppSelector((state) => state.fund.distributions)
  const intermediaries: IIntermediary[] = useAppSelector((state) => state.intermediary.intermediaries)

  const [label, setLabel] = useState('')
  const [approvalNumber, setApprovalNumber] = useState('')
  const [approvalDate, setApprovalDate] = useState('')
  const [typeOpcId, setTypeOpcId] = useState('')
  const [classificationid, setClassificationId] = useState('')
  const [depositaryId, setDepositaryId] = useState('')
  const [distributionId, setDistributionId] = useState('')
  const [intermediaryId, setIntermediaryId] = useState('')

  const [loading, setLoading] = useState(false)

  const onHandleCreate = async (): Promise<void> => {
    const fund: IFund = {
      label: label,
      approval_number: approvalNumber,
      approval_date: approvalDate,
      intermediary_id: Number(intermediaryId),
      type_opc_id: Number(typeOpcId),
      depositary_id: Number(depositaryId),
      classification_id: Number(classificationid),
      distribution_id: Number(distributionId)
    }

    setLoading(true)

    try {
      const res = await createFund(token as string, fund)
      dispatch(addFund(res.data))
      dispatch(setSuccess('Fond crée avec succes !'))
      dispatch(setInformationMessage('Fond ajouté avec succes !'))

      navigate('/dash/funds')
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), { theme: 'colored' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 h-full p-6 mb-4 z-20">
      <ToastContainer />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">
            Ajout d'un nouveau fond
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Veuillez remplir le formulaire
          </p>
        </div>
        <div className="flex  justify-end ">
          <Link to="/dash/funds" className="btn btn-md ml-2">
            Fermer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 flex gap-4 mb-4 items-center justify-center ">
        <div className="w-2/4 mx-auto px-4">
          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
            Désignation du fond
          </p>
          <input
            type="text"
            placeholder="..."
            className="input input-bordered w-full "
            onChange={(e) => setLabel(e.target.value)}
          />

          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
            Numéro d'agrément
          </p>
          <input
            type="text"
            placeholder="..."
            className="input input-bordered w-full "
            onChange={(e) => setApprovalNumber(e.target.value)}
          />

          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
            Date d'agrément
          </p>
          <input
            type="date"
            placeholder="..."
            className="input input-bordered w-full "
            onChange={(e) => setApprovalDate(e.target.value)}
          />

          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
            Appartient à quelle SGO
          </p>
          <select
            onChange={(e) => setIntermediaryId(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value=""></option>
            {intermediaries.map((inter) => (
              <option key={inter.id} value={inter.id}>
                {inter?.label?.toUpperCase()}
              </option>
            ))}
          </select>

          <div className="flex justify-between">
            <div className="w-full pr-4">
              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Quel est son type d'OPC
              </p>
              <select
                onChange={(e) => setTypeOpcId(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value=""></option>
                {typesOpc.map((opc) => (
                  <option key={opc.id} value={opc.id}>
                    {opc?.label?.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Le dépositaire
              </p>
              <select
                onChange={(e) => setDepositaryId(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value=""></option>
                {depositaries.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep?.label?.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-full pr-4">
              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                La classification
              </p>
              <select
                onChange={(e) => setClassificationId(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value=""></option>
                {classifications.map((cla) => (
                  <option key={cla.id} value={cla.id}>
                    {cla?.label?.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                La distribution
              </p>
              <select
                onChange={(e) => setDistributionId(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value=""></option>
                {distributions.map((dis) => (
                  <option key={dis.id} value={dis.id}>
                    {dis?.label?.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <Link to="/dash/funds" className="btn btn-md">
              Annuler
            </Link>
            <div>
              {loading && (
                <button className="btn bg-app-primary text-white text-base btn-disabled">
                  <span className="loading loading-spinner"></span>
                </button>
              )}
              {!loading && (
                <button
                  onClick={() => onHandleCreate()}
                  className="btn btn-md bg-app-primary text-white font-medium"
                >
                  Enregistrer
                </button>
              )}
          </div>

        </div>
      </div>
    </div>

    </div>
  )
}

export default AddFundPage
