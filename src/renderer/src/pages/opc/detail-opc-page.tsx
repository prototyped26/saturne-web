import { ToastContainer } from 'react-toastify'
import moment from 'moment/moment'
import { Link } from 'react-router'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import {  IOpc} from '../../type'
import { useEffect } from 'react'
import ReportOpcWeekly from '../../components/ReportOpcWeekly'
import CompositionDetailFundReport from '../../components/CompositionDetailFundReport'
import { RootState } from '../../store/store'

function DetailOpcPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

  const token: string | null = useAppSelector((state) => state.user.token)
  const opc: IOpc | null = useAppSelector((state) => state.opc.opc)

  useEffect(() => {

  }, [])

  useEffect(() => {
    console.log(opc)
  }, [opc])

  return (
    <div className="h-auto">
      <ToastContainer />

      <div className="border bg-white rounded-lg dark:border-gray-50 p-6 z-20">
        <div className="flex justify-between gap-4">
          <div className="">
            <h3 className="tracking-tight font-bold text-2xl text-app-title">Détail OPCVM</h3>
            <p className="tracking-tight font-light text-1xl text-app-sub-title border-b-2 border-app-secondary">
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
                  <span className="ml-2 font-black">Agrément du : </span>{' '}
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

      <CompositionDetailFundReport opc={opc as IOpc} />

    </div>
  )
}

export default DetailOpcPage
