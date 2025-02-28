import { IAssetLine, IOpc } from '../../../type'
import { getActifNet, getActifSousGestion, getValeurLiquid } from '../../../services/opcService'
import { NumericFormat } from 'react-number-format'

type Props = {
  opc: IOpc | null,
  parts: number
}

function PartGeneralInfo({ opc, parts }: Props): JSX.Element {
  return (
    <div className="flex gap-4">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Valeur Liquidative</div>
          <div className="stat-value text-2xl"><NumericFormat
            value={getValeurLiquid(opc?.assetLines as IAssetLine[])?.toFixed(2)}
            displayType={'text'} thousandSeparator={' '}
            suffix={' XAF'} /></div>
          {/*<div className="stat-desc">21% more than last month</div>*/}
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total des parts du fond</div>
          <div className="stat-value text-2xl"><NumericFormat
            value={parts}
            displayType={'text'} thousandSeparator={' '}/></div>
          {/*<div className="stat-desc">21% more than last month</div>*/}
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Actif Net</div>
          <div className="stat-value text-2xl"><NumericFormat
            value={getActifNet(opc?.assetLines as IAssetLine[])?.toFixed(2)}
            displayType={'text'} thousandSeparator={' '}
            suffix={' XAF'} /></div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">T. Actifs Sous ges.</div>
          <div className="stat-value text-2xl"><NumericFormat
            value={getActifSousGestion(opc?.assetLines as IAssetLine[])?.toFixed(2)} displayType={'text'}
            thousandSeparator={' '} suffix={' XAF'} /></div>
        </div>
      </div>
    </div>
  )
}

export default PartGeneralInfo
