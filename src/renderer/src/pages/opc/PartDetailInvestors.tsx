import { IInvestor } from '../../type'
import { NumericFormat } from 'react-number-format'

type Props = {
  investors: IInvestor[]
}

function PartDetailInvestors({ investors }: Props): JSX.Element {
  return (
    <div className="border bg-white dark:border-gray-50 rounded-lg p-4 mb-2">
      <p className="text-sm font-black">Investisseurs</p>
      <div>
        <table className="table text-xs">
          <thead>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <th>Valeur</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {investors?.map((investor) => (
              <tr key={Number(investor.id) + Math.random()}>
                <td>{investor.label}</td>
                <td></td>
                <td></td>
                <td><NumericFormat value={Number(investor?.value?.toFixed(2))} displayType={'text'} thousandSeparator={true}  suffix={' XAF'} /> </td>
                <td>{investor.percent ? Number(Number((investor.percent as number) * 100).toFixed(2)) + ' %' : 0 + ' %'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PartDetailInvestors
