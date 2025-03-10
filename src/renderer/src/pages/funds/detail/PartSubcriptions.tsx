import { IFund, IShareholder, IShareHolderOperation, IShareholderType } from '../../../type'
import NoDataList from '../../../components/NoDataList'
import { useEffect, useState } from 'react'
import DialogAddSubscription from './DialogAddSubscription'
import { NumericFormat } from 'react-number-format'
import DialogAddPurchase from './DialogAddPurchase'
type Props = {
  token: string,
  fund: IFund,
  shareholders: IShareholder[],
  types: IShareholderType[],
  success: (m) => void,
  error: (m) => void,
  parts: number,
  liquidation: number,
  noaction?: boolean
}

function PartSubcriptions({
  token,
  fund,
  shareholders,
  success,
  error,
  types, parts, liquidation, noaction = false
}: Props): JSX.Element {
  const [souscriptions, setSouscriptions] = useState<IShareHolderOperation[]>([])
  const [purchases, setPurchases] = useState<IShareHolderOperation[]>([])


  useEffect(() => {
    const sous: IShareHolderOperation[] = []
    const purch: IShareHolderOperation[] = []

    shareholders.forEach((shareholder) => {
      shareholder?.operations?.forEach((operation) => {
        const val: IShareHolderOperation = {
          id: shareholder.id as number,
          label: shareholder.label,
          shares: operation.shares,
          amount: operation.amount,
          percent: operation.percent
        }
        if (operation?.type?.code === 'SOUSCRIPTION') sous.push(val)
        else purch.push(val)
      })
    })

    setSouscriptions(sous)
    setPurchases(purch)
  }, [])

  const onHandleNewSubscription = (): void => {
    // @ts-ignore for disable error but showModal exist in DaisyUI
    document?.getElementById('modal-add-subscription')?.showModal()
  }
  //purchase
  const onHandleNewPurchase = (): void => {
    // @ts-ignore for disable error but showModal exist in DaisyUI
    document?.getElementById('modal-add-purchase')?.showModal()
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 px-6 py-3 mt-2 gap-4 w-full">
      {!noaction && (
        <div className="flex w-full py-2 gap-2">
          <button onClick={onHandleNewSubscription} className="btn btn-outline btn-sm btn-success">
            {' '}
            Ordre de souscription
          </button>
          <button onClick={onHandleNewPurchase} className="btn btn-outline btn-sm btn-error">
            {' '}
            Ordre de rachat
          </button>
        </div>
      )}

      {shareholders.length === 0 && <NoDataList />}

      <div className="mt-2 flex gap-2">
        <div className="w-full">
          <p className="flex font-medium w-full items-center justify-center text-sm">
            SOUSCRIPTIONS
          </p>
          <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400 mb-10">
            <thead className=" text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Porteur de part
                </th>
                <th scope="col" className="px-4 py-3">
                  Nb. Parts
                </th>
                <th scope="col" className="px-4 py-3">
                  Montant
                </th>
                <th scope="col" className="px-4 py-3">
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {souscriptions.map((shareholder) => (
                <tr key={shareholder.id + Math.random()}>
                  <th>{shareholder.label}</th>
                  <td>{shareholder.shares}</td>
                  <td>
                    <NumericFormat
                      value={shareholder.amount}
                      suffix={' XAF'}
                      thousandSeparator={' '}
                      displayType={'text'}
                    />
                  </td>
                  <td>{shareholder.percent.toFixed(2)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full">
          <p className="flex font-medium w-full items-center justify-center text-sm">RACHATS</p>
          <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400 mb-10">
            <thead className=" text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Porteur de part
                </th>
                <th scope="col" className="px-4 py-3">
                  Nb. Parts
                </th>
                <th scope="col" className="px-4 py-3">
                  Montant
                </th>
                <th scope="col" className="px-4 py-3">
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((shareholder) => (
                <tr key={shareholder.id + Math.random()}>
                  <td>{shareholder.label}</td>
                  <td>{shareholder.shares}</td>
                  <td>
                    <NumericFormat
                      value={shareholder.amount}
                      suffix={' XAF'}
                      thousandSeparator={' '}
                      displayType={'text'}
                    />
                  </td>
                  <td>{shareholder.percent.toFixed(2)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DialogAddSubscription
        inputs={shareholders}
        types={types}
        error={error}
        success={success}
        fund={fund}
        token={token}
        parts={parts}
        liquidation={liquidation}
      />

      <DialogAddPurchase
        inputs={shareholders}
        success={success}
        error={error}
        fund={fund}
        token={token}
        parts={parts}
        liquidation={liquidation}
      />
    </div>
  )
}

export default PartSubcriptions
