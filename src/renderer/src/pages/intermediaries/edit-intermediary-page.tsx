import { toast, ToastContainer } from 'react-toastify'
import { Link } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { ICategory, IIntermediary } from '../../type'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import {
  updateIntermediary
} from '../../services/intermediaryService'
import { refreshIntermediary } from '../../store/intermediarySlice'
import { getMessageErrorRequestEx } from '../../utils/errors'
import moment from 'moment'

function EditIntermediaryPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const intermediary: IIntermediary | null = useAppSelector((state) => state.intermediary.intermediary)
  const categories: ICategory[] = useAppSelector((state) => state.intermediary.categories)

  const [selectedCat, setSelectedCat] = useState('')
  const [category, setCategory] = useState<ICategory | null>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [stepper, setStepper] = useState<string[]>([])

  const [label, setLabel] = useState('')
  const [head, setHead] = useState('')
  const [approvalNumber, setApprovalNumber] = useState('')
  const [approvalDate, setApprovalDate] = useState('')
  const [leaderName, setleaderName] = useState('')
  const [leaderStatus, setLeaderStatus] = useState('')
  const [approvalNumberTwo, setApprovalNumberTwo] = useState('')
  const [approvalDateTwo, setApprovalDateTwo] = useState('')
  const [contacts, setContacts] = useState('')
  const [adress, setAdress] = useState('')
  const [loading, setLoadding] = useState(false)

  const stepperInit = ['Général', 'Dirigéant', 'Autres']

  useEffect(() => {
    if (intermediary !== null) {
      setCategory(intermediary?.category as ICategory)
      setSelectedCat(intermediary?.category?.id + '')
      setLabel(intermediary?.label)
      setHead(intermediary?.head)
      setApprovalNumber(intermediary?.approval_number)
      setApprovalDate(moment(intermediary?.approval_date as string).format("YYYY-MM-DD"))
      setleaderName(intermediary?.leader_name as string)
      setLeaderStatus(intermediary?.leader_status as string)
      setApprovalNumberTwo(intermediary?.approval_number_two as string)
      setApprovalDateTwo(moment(intermediary?.approval_date_two as string).format("YYYY-MM-DD"))
      setAdress(intermediary?.adress as string)
      setContacts(intermediary?.contacts as string)
      onInitStepper()
    }
  }, [intermediary])

  const onHandleChangeCat = (val: string): void => {
    setSelectedCat(val)
    if (val !== null) {
      const cat: ICategory = categories.find((cat) => cat.id === Number(val)) as ICategory
      setCategory(cat)
      onInitStepper()
    } else {
      setStepper([])
    }

    console.log(stepper)
  }

  const onInitStepper = (): void => {
    setStepper(stepperInit)
    setCurrentStep(1)
  }

  const onGotoNext = (): void => {
    setCurrentStep(currentStep + 1)
    console.log(currentStep)
  }

  const onGotoPrevious = (): void => {
    setCurrentStep(currentStep - 1)
  }

  const onHandleUpdate = async (): Promise<void> => {
    const inter: IIntermediary = {
      label: label,
      head: head,
      approval_number: approvalNumber,
      approval_date: approvalDate,
      leader_name: leaderName,
      leader_status: leaderStatus,
      approval_number_two: approvalNumberTwo,
      approval_date_two: approvalDateTwo,
      contacts: contacts,
      adress: adress,
      category_id: category?.id,
      countFund: 0,
      countMandatory: 0
    }

    setLoadding(true)

    try {
      const res = await updateIntermediary(token as string, intermediary?.id as number, inter)
      const interRes: IIntermediary = res.data as IIntermediary
      dispatch(refreshIntermediary(interRes))
      toast.success("Mise à jour effectuée avec succès !", {
        theme: 'colored'
      })
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    } finally {
      setTimeout(() => {
        setLoadding(false)
      }, 900)
    }

  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 h-full p-6 mb-4 z-20">
      <ToastContainer />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">{label}</h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Vous pouvez modifier les informations de l&#39;intermédiaire via les formulaires.
          </p>
        </div>
        <div className="flex  justify-end ">
          <Link to="/dash/intermediaries" className="btn btn-md ml-2">
            Fermer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 flex gap-4 mb-4 items-center justify-center ">
        <div className="w-3/4 mx-auto px-4">
          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
            Choisir le type d&#39;intermédiaire
          </p>
          <select
            value={selectedCat}
            onChange={(e) => onHandleChangeCat(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value=""></option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat?.label?.toUpperCase()}
              </option>
            ))}
          </select>

          {stepper.length > 0 && (
            <div className="w-full py-2">
              <ul className="steps w-full">
                {stepper.map((step, index) => (
                  <li key={step} className={cn('step', { 'step-primary': currentStep > index })}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stepper.length > 0 && currentStep === 1 && (
            <div>
              <h3 className="font-medium">Informations Générale</h3>
              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                {category?.code === 'SGO' ? 'Désignation/Raison sociale' : 'Nom'}
              </p>
              <input
                type="text"
                value={label}
                placeholder="..."
                className="input input-bordered w-full "
                onChange={(e) => setLabel(e.target.value)}
              />

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Siège
              </p>
              <select
                value={head}
                onChange={(e) => setHead(e.target.value)}
                className="select  select-bordered w-full"
              >
                <option value=""></option>
                <option value="Cameroun">Cameroun</option>
                <option value="Centrafrique">Centrafrique</option>
                <option value="Congo">Congo</option>
                <option value="Gabon">Gabon</option>
                <option value="Guinée Equatoriale">Guinée Equatoriale</option>
                <option value="Tchad">Tchad</option>
              </select>

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Numéro d&#39;Agrément
              </p>
              <input
                type="text"
                value={approvalNumber}
                placeholder="..."
                className="input input-bordered w-full "
                onChange={(e) => setApprovalNumber(e.target.value)}
              />

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Date d&#39;Agrément
              </p>
              <input
                type="date"
                defaultValue={approvalDate}
                placeholder="..."
                className="input input-bordered w-full "
                onChange={(e) => setApprovalDate(e.target.value)}
              />
            </div>
          )}

          {stepper.length > 0 && currentStep === 2 && (
            <div>
              <h3 className="font-medium">Informations sur le Dirigéant</h3>
              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Nom et prénom du dirigéant
              </p>
              <input
                type="text"
                value={leaderName}
                placeholder="..."
                className="input input-bordered w-full "
                onChange={(e) => setleaderName(e.target.value)}
              />

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Status
              </p>
              <select
                value={leaderStatus}
                onChange={(e) => setLeaderStatus(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value=""></option>
                <option value="Directeur Général">Directeur Général</option>
                <option value="Président Directeur Général">Président Directeur Général</option>
                <option value="PCA">PCA</option>
                <option value="Autre">Autre</option>
              </select>

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Son Numéro d&#39;Agrément
              </p>
              <input
                type="text"
                value={approvalNumberTwo}
                placeholder="..."
                className="input input-bordered w-full "
                onChange={(e) => setApprovalNumberTwo(e.target.value)}
              />

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Agrée le
              </p>
              <input
                type="date"
                placeholder="..."
                value={approvalDateTwo}
                className="input input-bordered w-full "
                onChange={(e) => setApprovalDateTwo(e.target.value)}
              />
            </div>
          )}

          {stepper.length > 0 && currentStep === 3 && (
            <div>
              <h3 className="font-medium">Informations supplémentaires</h3>
              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Adresse
              </p>
              <textarea
                placeholder="..."
                value={adress}
                className="input input-bordered w-full "
                onChange={(e) => setAdress(e.target.value)}
              />

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Contacts
              </p>
              <textarea
                placeholder="..."
                value={contacts}
                className="input input-bordered w-full "
                onChange={(e) => setContacts(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-between mt-2">
            <div>
              {currentStep === 1 && (
                <Link to="/dash/intermediaries" className="btn btn-md">
                  Annuler
                </Link>
              )}
              {currentStep > 1 && (
                <button onClick={onGotoPrevious} className="btn btn-md">
                  Précedent
                </button>
              )}
            </div>
            <div className="flex">
              {currentStep < 3 && (
                <button onClick={() => onGotoNext()} className="btn btn-md text-white font-medium">
                  Suivant
                </button>
              )}
              <div className="ml-2">
                {loading && (
                  <button className="btn bg-app-primary text-white text-base btn-disabled">
                    <span className="loading loading-spinner"></span>
                  </button>
                )}
                {!loading && (
                  <button
                    onClick={() => onHandleUpdate()}
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
    </div>
  )
}

export default EditIntermediaryPage
