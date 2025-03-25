import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { ICategory, IHolder, IIntermediary, IOrganization } from '../../type'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import { FiTrash } from 'react-icons/fi'
import {
  createHolder,
  createIntermediary,
  createOrganization,
  updateIntermediary
} from '../../services/intermediaryService'
import { addIntermediary, refreshIntermediary } from '../../store/intermediarySlice'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { setInformationMessage, setSuccess } from '../../store/informationSlice'

function AddIntermediaryPage(): JSX.Element {
  const navigate = useNavigate()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const categories: ICategory[] = useAppSelector((state) => state.intermediary.categories)

  const [selectedCat, setSelectedCat] = useState('')
  const [category, setCategory] = useState<ICategory | null>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [stepper, setStepper] = useState<string[]>([])
  const [holders, setHolders] = useState<IHolder[]>([])

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
  const [organizationStatus, setOrganizationStatus] = useState('')
  const [capital, setCapital] = useState('')
  const [loading, setLoadding] = useState(false)

  useEffect(() => {

  }, [selectedCat])

  const stepperInit = ['Général', 'Dirigéant', 'Autres']

  const onHandleChangeCat = (val: string): void => {
    setSelectedCat(val)
    if (val !== null) {
      const cat: ICategory = categories.find((cat) => cat.id === Number(val)) as ICategory
      setCategory(cat)
      console.log(cat?.id)
      console.log(cat?.id === Number(val))
      if (cat?.id === Number(val) && cat.code === 'SGO') {
        const arr: string[] = [...stepperInit, 'Société']
        setStepper(arr)
      } else {
        setStepper(stepperInit)
        setHolders([])
        setCurrentStep(1)
      }
    } else {
      setStepper([])
    }

    console.log(stepper)
  }



  const onGotoNext = (): void => {
    setCurrentStep(currentStep + 1)
    console.log(currentStep)
  }

  const onGotoPrevious = (): void => {
    setCurrentStep(currentStep - 1)
  }

  const onHandleAddHolder = (): void => {
    let value = 0
    if (holders.length > 0) {
      value = holders[0].value as number
    }

    const h: IHolder = {
      first_name: '',
      shares: 0,
      value: value,
      percent: 0,
      ligne: Date.now()
    }
    const arr: IHolder[] = []
    arr.push(h)
    console.log(arr)
    setHolders([...holders, ...arr])
  }

  const onHandleRemoveHolder = (i: number): void => {
    const arr = holders.filter((holder) => holder.ligne !== i)
    setHolders(arr)
  }

  const onChangeHolderName = (i, val): void => {
    if (val) {
      const h = holders.find((holder) => holder.ligne === i)
      if (h) {
        h.first_name = val
        const arr = holders.map((holder) => holder.ligne === i ? h : holder )
        setHolders(arr)
      }
    }
  }

  const onChangeHolderShares = (i, val): void => {
    if (val) {
      const h = holders.find((holder) => holder.ligne === i)
      if (h) {
        h.shares = val as number
        h.capital = h.value as number * (h.shares as number)
        h.percent = Number(((h.capital / Number(capital)) * 100).toFixed(2))
        const arr = holders.map((holder) => holder.ligne === i ? h : holder )
        setHolders(arr)
      }
    }
  }

  const onChangeHolderValue = (i, val): void => {
    if (val) {
      const h = holders.find((holder) => holder.ligne === i)
      if (h) {
        h.value = val
        h.capital = val * (h.shares as number)
        h.percent = Number(((h.capital / Number(capital)) * 100).toFixed(2))
        const arr = holders.map((holder) => holder.ligne === i ? h : holder )
        setHolders(arr)
      }
    }
  }

  const onChangeHolderCapital = (i, val): void => {
    if (val) {
      const h = holders.find((holder) => holder.ligne === i)
      if (h) {
        h.capital = val as number
        const arr = holders.map((holder) => holder.ligne === i ? h : holder )
        setHolders(arr)
      }
    }
  }

  const onChangeHolderPercent = (i, val): void => {
    if (val) {
      const h = holders.find((holder) => holder.ligne === i)
      if (h) {
        h.percent = val as number
        const arr = holders.map((holder) => holder.ligne === i ? h : holder )
        setHolders(arr)
      }
    }
  }

  const onHandleCreate = async (): Promise<void> => {
    const intermediary: IIntermediary = {
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
      const res = await createIntermediary(token as string, intermediary)
      const inter: IIntermediary = res.data as IIntermediary
      dispatch(addIntermediary(inter))
      if (category?.code === 'SGO') {
        const org: IOrganization = {
          label: inter.label,
          header: inter.head,
          capital: capital,
          status: organizationStatus
        }

        const resOrg = await createOrganization(token as string, org)
        const organization: IOrganization = resOrg.data as IOrganization
        intermediary.id = inter.id
        intermediary.organization_id = organization?.id as number
        intermediary.category_id = category.id
        const resUpInter = await updateIntermediary(token as string, inter.id as number, intermediary)
        dispatch(refreshIntermediary(resUpInter.data as IIntermediary))

        if (holders.length > 0) {
          for (const holder of holders) {
            holder.organization_id = organization?.id as number
             await createHolder(token as string, holder)
          }
        }
      }

      dispatch(setInformationMessage("Intermédiaire enregistrer avec success"))
      dispatch(setSuccess("Intermédiaire enregistrer avec success"))

      setTimeout(() => {
        navigate("/dash/intermediaries")
      }, 900)
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
          <h3 className="tracking-tight font-bold text-3xl text-app-title">
            Ajout d'un nouvel Intermédiaire
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Veuillez remplir le formulaire
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
            Choisir le type d'intermédiaire
          </p>
          <select
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
                placeholder="..."
                className="input input-bordered w-full "
                onChange={(e) => setLabel(e.target.value)}
              />

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Siège
              </p>
              <select
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
                Numéro d'Agrément
              </p>
              <input
                type="text"
                placeholder="..."
                className="input input-bordered w-full "
                onChange={(e) => setApprovalNumber(e.target.value)}
              />

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Date d'Agrément
              </p>
              <input
                type="date"
                placeholder="..."
                className="input input-bordered w-full "
                onChange={(e) => setApprovalDate(e.target.value)}
              />

              <div className="flex justify-between mt-2">
                <Link to="/dash/intermediaries" className="btn btn-md">
                  Annuler
                </Link>
                <button onClick={() => onGotoNext()} className="btn btn-md text-white font-medium">
                  Suivant
                </button>
              </div>
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
                placeholder="..."
                className="input input-bordered w-full "
                onChange={(e) => setleaderName(e.target.value)}
              />

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Status
              </p>
              <select
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
                Son Numéro d'Agrément
              </p>
              <input
                type="text"
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
                className="input input-bordered w-full "
                onChange={(e) => setApprovalDateTwo(e.target.value)}
              />

              <div className="flex justify-between mt-2">
                <button onClick={onGotoPrevious} className="btn btn-md">
                  Précedent
                </button>
                <button onClick={onGotoNext} className="btn btn-md font-medium">
                  Suivant
                </button>
              </div>
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
                className="input input-bordered w-full "
                onChange={(e) => setAdress(e.target.value)}
              />

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Contacts
              </p>
              <textarea
                placeholder="..."
                className="input input-bordered w-full "
                onChange={(e) => setContacts(e.target.value)}
              />

              <div className="flex justify-between mt-2">
                <button onClick={onGotoPrevious} className="btn btn-md">
                  Précedent
                </button>
                {category?.code === 'SGO' && (
                  <button onClick={onGotoNext} className="btn btn-md font-medium">
                    Suivant
                  </button>
                )}
                {category?.code !== 'SGO' && (
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
                )}
              </div>
            </div>
          )}

          {stepper.length > 0 && currentStep === 4 && (
            <div>
              <h3 className="font-medium">Informations sur la société</h3>
              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Capital de la socité (F. CFA)
              </p>
              <input
                type="text"
                placeholder="... CFA"
                className="input input-bordered w-full "
                onChange={(e) => setCapital(e.target.value)}
              />

              <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                Forme Juridique
              </p>
              <select
                onChange={(e) => setOrganizationStatus(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value=""></option>
                <option value="ETS">Etablissement</option>
                <option value="SARL">SARL</option>
                <option value="SA">S.A</option>
                <option value="SAS">S A S</option>
                <option value="OTHER">Autre</option>
              </select>

              <h3 className="font-medium mt-2">Informations sur les actionnaires</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom/Dénomination Sociale</th>
                      <th>Actions</th>
                      <th>Valeur (F.CFA)</th>
                      <th>Capital (F.CFA)</th>
                      <th>%</th>
                      <th>
                        <button onClick={onHandleAddHolder} className="btn btn-sm">
                          ajouter
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {holders.map((holder) => (
                      <tr key={holder.ligne}>
                        <th>
                          <input
                            type="text"
                            value={holder.first_name}
                            onChange={(e) => onChangeHolderName(holder.ligne, e.target.value)}
                            placeholder="Actionnaire..."
                            className="input input-sm input-bordered w-full "
                          />
                        </th>
                        <td>
                          <input
                            type="number"
                            value={holder.shares}
                            onChange={(e) => onChangeHolderShares(holder.ligne, e.target.value)}
                            placeholder="..."
                            className="input input-sm input-bordered w-full "
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={holder.value}
                            onChange={(e) => onChangeHolderValue(holder.ligne, e.target.value)}
                            placeholder="..."
                            className="input input-sm input-bordered w-full "
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={holder.capital}
                            onChange={(e) => onChangeHolderCapital(holder.ligne, e.target.value)}
                            placeholder="..."
                            className="input input-sm input-bordered w-full "
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={holder.percent}
                            onChange={(e) => onChangeHolderPercent(holder.ligne, e.target.value)}
                            placeholder="..."
                            className="input input-sm input-bordered w-full "
                          />
                        </td>
                        <td className="">
                          <a
                            onClick={() => onHandleRemoveHolder(holder?.ligne as number)}
                            className="text-error font-bold"
                          >
                            <FiTrash />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between mt-2">
                <button onClick={onGotoPrevious} className="btn btn-md">
                  Précedent
                </button>
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
          )}
        </div>
      </div>
    </div>
  )
}

export default AddIntermediaryPage
