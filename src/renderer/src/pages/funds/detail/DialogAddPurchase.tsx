import { IFund, IOperation, IShareholder } from '../../../type'
import Autocomplete from '../../../components/Autocomplete'
import { NumericFormat } from 'react-number-format'
import { purshaceHolder } from '../../../services/fundService'
import { getMessageErrorRequestEx } from '../../../utils/errors'
import { useEffect, useState } from 'react'

type Props = {
  inputs: IShareholder[],
  success: (m) => void,
  error: (m) => void,
  fund: IFund,
  token: string,
  parts: number,
  liquidation: number
}

function DialogAddPurchase({ inputs, error, success, fund, token, liquidation, parts }: Props): JSX.Element {

  const [step, setStep] = useState(1)
  const [shares, setShares] = useState('')
  const [amount, setAmount] = useState('')
  const [percent, setPercent] = useState('')
  const [loading, setLoading] = useState(false)
  const [isShareholder, setIsShareholder] = useState(false)
  const [selectHolder, setSelectedHolder] = useState<IShareholder | null>(null)

  useEffect(() => {
    setAmount('' + liquidation)
  }, [])

  const getLabel = (s: IShareholder | null): void => {
    if (s !== null) {
      //setLabel(s?.label)
      setIsShareholder(true)
      setSelectedHolder(s)
    }
    console.log(s)
  }

  const getExist = (e): void => {
    //console.log(e)
    setIsShareholder(e)
  }

  const formIsValid = (): boolean => {
    let res = true

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
    setShares('')
    setAmount('')
    setPercent('')
    setIsShareholder(false)
  }

  const onHandleNext = (): void => {
    if (isShareholder) {
      setStep(3)
    }
  }

  const onHandleCreate = async (): Promise<void> => {
    if (formIsValid()) {
      setLoading(true)

      const op: IOperation = {
        shares: Number(shares),
        amount: Number(amount),
        percent: Number(percent)
      }

      try {
        await purshaceHolder(token, selectHolder?.id as number, fund.id as number, op)
        document?.getElementById('close-dialog-purchase')?.click()
        success("Action effectuée avec succès")
      } catch (e) {
        error(getMessageErrorRequestEx(e))
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <dialog id="modal-add-purchase" className="modal">
      <div className="modal-box w-11/12 max-w-5xl h-2/3">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            id="close-dialog-purchase"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Nouvel Ordre de rachat{' '}
          <label className="text-sm">
            *(il y a <NumericFormat value={parts} displayType={'text'} thousandSeparator={' '} />{' '}
            Parts disponibles)
          </label>
        </h3>
        <div className="flex w-full items-center justify-center mt-4">
          <div className="w-2/3 ">
            <p>Nom/Dénomination du Porteur de parts</p>
            <div className="flex w-full flex-wrap">
              <Autocomplete suggestions={inputs} exist={getExist} value={getLabel} reset={reset} />
            </div>

            {step !== 1 && (
              <div className="mt-2">
                <p className="font-medium ">Informations sur la souscription</p>
                <div className="mt-2 flex gap-2">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Nombre de parts</span>
                    </div>
                    <input
                      type="number"
                      onChange={(e) => setShares(e.target.value)}
                      className="input input-bordered w-full max-w-xs"
                    />
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

export default DialogAddPurchase
