import { IInvestmentRule, IInvestmentRuleType } from '../../type'
import { useEffect } from 'react'
import { NumericFormat } from 'react-number-format'

type Props = {
  rules: IInvestmentRule[],
  types: IInvestmentRuleType[]
}

function PartInvestmentRule({ rules, types }: Props): JSX.Element {

  useEffect(() => {
    console.log(rules)
  }, [])

  return (
    <div className="border bg-white dark:border-gray-50 rounded-lg p-4 mb-2">
      <p className="text-sm font-black">Règles d'investissement</p>
      <div>
        <table className="table text-xs">
          <thead>
            <tr>
              <td></td>
              <th>Valeur</th>
              <th>%</th>
            </tr>
          </thead>
          {types?.map((type) => (
            <tbody key={Number(type.id) + Math.random() + Math.random()}>
              <tr className="font-bold" key={Number(type.id) + Math.random()}>
                <td colSpan={3}>{type.label}</td>
              </tr>
              {rules?.map(
                (rule) =>
                  rule?.investmentRuleType?.id === type.id && (
                    <tr className={rule?.label?.toLowerCase().includes('total') ? 'font-bold' : ''} key={Number(rule.id) + Math.random()}>
                      <td>{rule.label}</td>
                      <td><NumericFormat value={Number(rule?.value?.toFixed(2))} displayType={'text'} thousandSeparator={true}  suffix={' XAF'} /> </td>
                      <td>{rule.percent ? Number(Number((rule.percent as number) * 100).toFixed(2)) + ' %' : 0 + ' %'}</td>
                    </tr>
                  )
              )}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  )
}

export default PartInvestmentRule
