import PartDetailOpcvm from '../pages/opc/PartDetailOpcvm'
import { IInvestmentRule, IInvestmentRuleType, IInvestor, IOpc, Iopcvm, ITypeOpc } from '../type'
import PartInvestmentRule from '../pages/opc/PartInvestmentRule'
import PartDetailInvestors from '../pages/opc/PartDetailInvestors'
import { NumericFormat } from 'react-number-format'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { useState } from 'react'

type Props = {
  opc: IOpc
}

function CompositionDetailFundReport({ opc }: Props): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

  const typesOpcs: ITypeOpc[] = useAppSelector((state) => state.opc.opcvmTypes)
  const rulesTypes: IInvestmentRuleType[] = useAppSelector((state) => state.opc.investmentsTypes)

  const [current, setCurrent] = useState("opcvm")

  const onHandleChangePartDetail = (step: 'opcvm' | 'rules' | 'investment'): void => {
    setCurrent(step)
  }

  return (
    <div>
      <div className="flex gap-4 border bg-white dark:border-gray-50 rounded-lg mt-2 p-4 ">
        <button
          onClick={() => onHandleChangePartDetail('opcvm')}
          className={current === 'opcvm' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'}
        >
          {' '}
          OPCVM & Classification
        </button>
        <button
          onClick={() => onHandleChangePartDetail('rules')}
          className={current === 'rules' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'}
        >
          {' '}
          Règles Investissement
        </button>
        <button
          onClick={() => onHandleChangePartDetail('investment')}
          className={
            current === 'investment' ? 'btn btn-sm bg-app-primary text-white' : 'btn btn-sm'
          }
        >
          {' '}
          Investisseurs{' '}
        </button>
      </div>

      <div className="flex gap-4 mt-2">
        <div className="w-9/12 ">
          {current === 'opcvm' && (
            <PartDetailOpcvm typesOpcs={typesOpcs} opcvms={opc?.opcvms as Iopcvm[]} />
          )}
          {current === 'rules' && (
            <PartInvestmentRule
              rules={opc?.investmentRules as IInvestmentRule[]}
              types={rulesTypes}
            />
          )}
          {current === 'investment' && (
            <PartDetailInvestors investors={opc?.investors as IInvestor[]} />
          )}
        </div>

        <div className="w-3/12">
          <div className="border bg-white dark:border-gray-50 h-auto rounded-lg p-4">
            {opc?.assetLines?.map((line) => (
              <div key={line.id} className="border-b mb-2 pb-1">
                <p className="text-lg">{line?.label?.toUpperCase()}</p>
                <p className="font-black"><NumericFormat value={Number(line?.value?.toFixed(2))} displayType={'text'}
                                                         thousandSeparator={' '} suffix={' XAF'} /></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompositionDetailFundReport
