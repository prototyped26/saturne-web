import { IFund } from '../../../type'
import HistoryLiquidationDiagram from '../../../components/HistoryLiquidationDiagram'
import { useEffect } from 'react'

type Props = {
  fund: IFund,
  token: string
}

function PartHistoryValueLiquidation({ fund, token }: Props): JSX.Element {

  useEffect(() => {
  }, [])

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 px-6 py-3 w-full">
      <p>Historique des valeurs liquidatives</p>
      {fund === null && <span className="loading loading-spinner"></span>}
      {fund !== null && <HistoryLiquidationDiagram fund={fund} token={token} />}
    </div>
  )
}

export default PartHistoryValueLiquidation
