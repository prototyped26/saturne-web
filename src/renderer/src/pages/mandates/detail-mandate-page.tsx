import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IMandate, Iopcvm, ITypeOpc } from '../../type'
import { ToastContainer } from 'react-toastify'
import moment from 'moment'
import { Link } from 'react-router'
import { NumericFormat } from 'react-number-format'
import PartDetailOpcvm from '../opc/PartDetailOpcvm'

function DetailMandatePage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()

  const mandate: IMandate | null = useAppSelector((state) => state.mandate.mandate)
  const typesOpcs: ITypeOpc[] = useAppSelector((state) => state.opc.opcvmTypes)
  const token: string | null = useAppSelector((state) => state.user.token)

  return (
    <div className="h-full">
      <ToastContainer />

      <div className="border bg-white rounded-lg dark:border-gray-50 p-6 z-20">
        <div className="flex justify-between gap-4">
          <div className="">
            <h3 className="tracking-tight font-bold text-2xl text-app-title">Détail de du mandat</h3>
            <p className="tracking-tight font-light text-1xl text-app-sub-title border-b-2">
              au {moment(mandate?.week?.end).format('DD MMMM YYYY')}
            </p>
            <div className="flex justify-between gap-14 mt-2">
              <div>
                <p className="text-sm ml-2 ">
                  <span className="font-black">Client : </span>{' '}
                  <span className="">{mandate?.customer?.label?.toUpperCase()}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">SGO : </span>{' '}
                  <span className="">{mandate?.customer?.intermediary?.label?.toUpperCase()}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Dépositaire </span>{' '}
                  <span className="">{mandate?.depositary?.label?.toUpperCase()}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Stratégie d'investissement : </span>{' '}
                  <span className=""></span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Profil de risque </span>{' '}
                  <span className="">{mandate?.risk_profile}</span>
                </p>
              </div>

            </div>
          </div>

          <div className="flex  justify-end ">
            <Link to="/dash/mandates" className="btn btn-md ml-2">
              Retour aux rapports
            </Link>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-2">

        <div className="w-9/12 ">
          <PartDetailOpcvm typesOpcs={typesOpcs} opcvms={mandate?.opcvms as Iopcvm[]} />
        </div>

        <div className="w-3/12">
          <div className="border bg-white dark:border-gray-50 h-auto rounded-lg p-4">
            {mandate?.assetLines?.map((line) => (
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

export default DetailMandatePage
