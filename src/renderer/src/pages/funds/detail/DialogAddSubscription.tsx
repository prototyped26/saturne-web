import Autocomplete from '../../../components/Autocomplete'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { IFund, IOperation, IShareholder, IShareholderType } from '../../../type'
import { createNewShareholder, subscribeHolder } from '../../../services/fundService'
import { getMessageErrorRequestEx } from '../../../utils/errors'

type Props = {
  inputs: IShareholder[],
  types: IShareholderType[],
  success: (m) => void,
  error: (m) => void,
  fund: IFund,
  token: string,
  parts: number,
  liquidation: number
}

function DialogAddSubscription({ inputs, types, error, success, fund, token, parts, liquidation }: Props): JSX.Element {
  const [step, setStep] = useState(1)
  const [label, setLabel] = useState('')
  const [nationality, setNationality] = useState('')
  const [residence, setResidence] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [pp, setPP] = useState('')
  const [isShareholder, setIsShareholder] = useState(false)
  const [group, setGroup] = useState('')
  const [categorieId, setCategorieId] = useState('')
  const [shares, setShares] = useState('')
  const [amount, setAmount] = useState('')
  const [percent, setPercent] = useState('')
  const [lines, setLines] = useState<IShareholderType[]>([])
  const [loading, setLoading] = useState(false)
  const [selectHolder, setSelectedHolder] = useState<IShareholder | null>(null)

  useEffect(() => {
    setAmount('' + liquidation)
  }, [])

  useEffect(() => {
    //console.log(group)
    if (group.length > 0) {
      const res = types.find((type) => type.id === Number(group))?.subTypes
      setLines(res as IShareholderType[])
    } else {
      setLines([])
    }
  }, [group])

  const getExist = (e): void => {
    console.log(e)
    setIsShareholder(e)
  }

  const getLabel = (s: IShareholder | null): void => {
    if (s !== null) {
      setLabel(s?.label)
      setIsShareholder(true)
      setSelectedHolder(s)
    }
    console.log(s)
  }

  const onHandleNext = (): void => {
    if (isShareholder) {
      setStep(3)
    } else {
      setStep(2)
    }
  }

  const onHandleCreate = async (): Promise<void> => {
    if (formIsValid()) {
      setLoading(true)
      const data: IShareholder = {
        label: label,
        nationality: nationality,
        residence: residence,
        id_number: idNumber,
        pp: pp,
        type_id: Number(categorieId),
        fund_id: fund.id,
        shares: Number(shares),
        amount: Number(amount),
        percent: Number(percent)
      }

      const op: IOperation = {
        shares: Number(shares),
        amount: Number(amount),
        percent: Number(percent)
      }

      try {
        if (isShareholder) {
          await subscribeHolder(token, selectHolder?.id as number, fund.id as number, op)
        } else {
          await createNewShareholder(token, data)
        }
        document?.getElementById('close-dialog-souscribe')?.click()
        success("Action effectuée avec succès")
      } catch (e) {
        error(getMessageErrorRequestEx(e))
      } finally {
        setLoading(false)
      }
    }
  }

  const formIsValid = (): boolean => {
    let res = true

    if (step === 2) {
      // creation du holder contrôle des champs
      if (label.length == 0) {
        res = false
        error('remplir la dénomination ou le nom')
      }
      if (nationality.length == 0) {
        res = false
        error('remplir la nationalité')
      }
      if (residence.length == 0) {
        res = false
        error('remplir la résidence')
      }
      if (idNumber.length == 0) {
        res = false
        error('remplir le numéro de pièce d identitée ')
      }
      if (categorieId.length == 0) {
        res = false
        error('choisir une catégorie')
      }
    }

    if (shares.length == 0) {
      res = false
      error('Saisir le nombre de parts')
    }

    if (amount.length == 0) {
      res = false
      error('Saisir le montant de la souscription')
    }

    if (percent.length == 0) {
      res = false
      error('Saisir le pourcentage')
    }

    return res
  }

  const reset = (): void => {
    setStep(1)
    setLabel('')
    setNationality('')
    setResidence('')
    setPP('')
    setIdNumber('')
    setCategorieId('')
    setShares('')
    setAmount('')
    setPercent('')
    setIsShareholder(false)
  }


  return (
    <dialog id="modal-add-subscription" className="modal">
      <div className="modal-box w-11/12 max-w-5xl h-2/3">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button id="close-dialog-souscribe" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Nouvel Ordre de Souscription <label className="text-sm">*(il y a <NumericFormat value={parts} displayType={'text'} thousandSeparator={' '} /> Parts disponibles)</label> </h3>
        <div className="flex w-full items-center justify-center mt-4">
          <div className="w-2/3 ">
            <p>Nom/Dénomination du Porteur de parts</p>
            <div className="flex w-full flex-wrap">
              <Autocomplete suggestions={inputs} exist={getExist} value={getLabel} reset={reset} />
            </div>

            {step !== 1 && step === 2 && (
              <div className="mt-2">
                <div className="mt-2 flex gap-2">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Son Groupe</span>
                    </div>
                    <select
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="select select-bordered w-full"
                    >
                      <option></option>
                      {types.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Catégorie</span>
                    </div>
                    <select
                      onChange={(e) => setCategorieId(e.target.value)}
                      className="select select-bordered w-full"
                    >
                      <option></option>
                      {lines.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="mt-2 flex gap-2">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Nationalité</span>
                    </div>
                    <input
                      type="text" onChange={(e) => setNationality(e.target.value)}
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Résidence</span>
                    </div>
                    <select onChange={(e) => setResidence(e.target.value)} className="select select-bordered w-full">
                      <option></option>
                      <option value="CEMAC">CEMAC</option>
                      <option value="Hors CEMAC">Hors CEMAC</option>
                    </select>
                  </label>
                </div>
                <div className="mt-2 flex gap-2">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Pièce d&#39;identité N°</span>
                    </div>
                    <input
                      type="text" onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">PP/PM</span>
                    </div>
                    <input
                      type="text" onChange={(e) => setPP(e.target.value)}
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                </div>
              </div>
            )}

            {step !== 1 && (
              <div className="mt-2">
                <p className="font-medium ">Informations sur la souscription</p>
                <div className="mt-2 flex gap-2">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Nombre de parts</span>
                    </div>
                    <input type="number" onChange={(e) => setShares(e.target.value)} className="input input-bordered w-full max-w-xs" />
                  </label>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Montant</span>
                    </div>
                    <NumericFormat
                      thousandSeparator={' '}
                      value={amount}
                      onValueChange={(values) => setAmount(values.value)}
                      suffix={' XAF'}
                      displayType={'input'}
                      className="input input-bordered"
                    />
                  </label>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Pourcentage </span>
                    </div>
                    <NumericFormat
                      thousandSeparator={' '}
                      onValueChange={(values) => setPercent(values.value)}
                      suffix={' %'}
                      displayType={'input'}
                      className="input input-bordered"
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              {step === 1 && (
                <button onClick={onHandleNext} className="btn btn-sm">
                  Continuer
                </button>
              )}
              {step !== 1 && (
                <div className="flex ">
                  {loading && (
                    <button className="btn btn-sm text-white text-base btn-disabled">
                      <span className="loading loading-spinner"></span>
                    </button>
                  )}
                  {!loading && (
                    <button
                      onClick={onHandleCreate}
                      className="btn btn-sm bg-app-primary text-white"
                    >
                      Enregistrer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default DialogAddSubscription
