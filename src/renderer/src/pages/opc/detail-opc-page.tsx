import { ToastContainer } from 'react-toastify'
import { FiEdit } from 'react-icons/fi'
import moment from 'moment/moment'
import { Link } from 'react-router'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IAssetLine, IInvestmentRule, IInvestmentRuleType, IInvestor, IOpc, Iopcvm, ITypeOpc } from '../../type'
import { useEffect, useState } from 'react'
import PartDetailOpcvm from './PartDetailOpcvm'
import PartInvestmentRule from './PartInvestmentRule'
import PartDetailInvestors from './PartDetailInvestors'
import ReportOpcWeekly from '../../components/ReportOpcWeekly'
import { getActifNet } from '../../services/opcService'
import { NumericFormat } from 'react-number-format'

function DetailOpcPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const opc: IOpc | null = useAppSelector((state) => state.opc.opc)
  const typesOpcs: ITypeOpc[] = useAppSelector((state) => state.opc.opcvmTypes)
  const rulesTypes: IInvestmentRuleType[] = useAppSelector((state) => state.opc.investmentsTypes)

  const [current, setCurrent] = useState("opcvm")

  useEffect(() => {

  }, [])

  useEffect(() => {
    console.log(opc)
  }, [opc])

  const onHandleChangePartDetail = (step: 'opcvm' | 'rules' | 'investment'): void => {
    setCurrent(step)
  }

  return (
    <div className="h-auto">
      <ToastContainer />

      <div className="border bg-white rounded-lg dark:border-gray-50 p-6 z-20">
        <div className="flex justify-between gap-4">
          <div className="">
            <h3 className="tracking-tight font-bold text-2xl text-app-title">Détail de l'OPCVM</h3>
            <p className="tracking-tight font-light text-1xl text-app-sub-title border-b-2">
              au {moment(opc?.created_at).format('DD MMMM YYYY')}
            </p>
            <div className="flex justify-between gap-14 mt-2">
              <div>
                <p className="text-sm ml-2 ">
                  <span className="font-black">Fond : </span>{' '}
                  <span className="">{opc?.fund?.label}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Agrément : </span>{' '}
                  <span className="">{opc?.fund?.approval_number}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Date d'agrément: </span>{' '}
                  <span className="">{moment(opc?.fund?.approval_date).format('DD-MM-YYYY')}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Société : </span>{' '}
                  <span className="">{opc?.fund?.intermediary?.label}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Classification : </span>{' '}
                  <span className="">{opc?.fund?.classification?.label}</span>
                </p>
              </div>
              <div>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Dépositaire : </span>{' '}
                  <span className="">{opc?.fund?.depositary?.label}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Politique de distribution : </span>{' '}
                  <span className="">{opc?.fund?.distribution?.label}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Réseau de distribution : </span>{' '}
                  <span className="">{opc?.fund?.distribution_network}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Commissaire au compte : </span>{' '}
                  <span className="">{opc?.fund?.auditor?.label}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex  justify-end ">
            <Link to="/dash/reports" className="btn btn-md ml-2">
              Retour aux rapports
            </Link>
          </div>
        </div>
      </div>

      <div className="p-2 flex justify-center">
        <ReportOpcWeekly token={token as string} opc={opc as IOpc} />
      </div>

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
          Règles d'investissement
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
                <p className="text-lg">{line.label.toUpperCase()}</p>
                <p className="font-black"><NumericFormat value={Number(line?.value?.toFixed(2))} displayType={'text'} thousandSeparator={' '}  suffix={' XAF'} /> </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailOpcPage
