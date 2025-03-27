import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { IReportComponent, IReportSGO } from '../../type'
import moment from 'moment'
import { Link } from 'react-router'
import { NumericFormat } from 'react-number-format'
import { useEffect, useState } from 'react'

function DetailReportSgo(): JSX.Element {

  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

  const report: IReportSGO | null = useAppSelector((state) => state.opc.reportSgo)

  const [actifs, setActifs] = useState<IReportComponent[]>([])
  const [passifs, setPassifs] = useState<IReportComponent[]>([])
  const [resultats, setResultats] = useState<IReportComponent[]>([])
  const [indicateurs, setIndicateurs] = useState<IReportComponent[]>([])
  const [fonds, setFonds] = useState<IReportComponent[]>([])

  useEffect(() => {

    const actif: IReportComponent[] = []
    const passif: IReportComponent[] = []
    const resultat: IReportComponent[] = []
    const indicateur: IReportComponent[] = []
    const fond: IReportComponent[] = []

    report?.components?.forEach((component) => {
      if (component?.type?.label?.toUpperCase().includes("ACTIF")) {
        actif.push(component)
      }
      if (component?.type?.label?.toUpperCase().includes("PASSIF")) {
        passif.push(component)
      }
      if (component?.type?.label?.toUpperCase().includes("RESULTAT")) {
        resultat.push(component)
      }
      if (component?.type?.label?.toUpperCase().includes("INDICATEUR")) {
        indicateur.push(component)
      }
      if (component?.type?.label?.toUpperCase().includes("FONDS")) {
        fond.push(component)
      }
    })

    setActifs(actif)
    setPassifs(passif)
    setResultats(resultat)
    setIndicateurs(indicateur)
    setFonds(fond)
  }, [])

  return (
    <div className="h-auto">
      <div className="border bg-white rounded-lg dark:border-gray-50 p-6 z-20">
        <div className="flex justify-between gap-4">
          <div className="">
            <h3 className="tracking-tight font-bold text-2xl text-app-title">Détail Rapport SGO</h3>
            <p className="tracking-tight font-light text-1xl text-app-sub-title border-b-2">
              Du {moment(report?.date).format('DD MMMM YYYY')}
            </p>
            <div className="flex justify-between gap-14 mt-2">
              <div>
                <p className="text-sm ml-2 ">
                  <span className="font-black">SGO : </span>{' '}
                  <span className="">{report?.intermediary?.label}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Agrément : </span>{' '}
                  <span className="">{report?.intermediary?.approval_number}</span>
                </p>
                <p className="text-sm ">
                  <span className="ml-2 font-black">Agrément du : </span>{' '}
                  <span className="">
                    {moment(report?.intermediary?.approval_date).format('DD-MM-YYYY')}
                  </span>
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

      <div className="w-full flex gap-2 mt-2">
        <div className="w-1/2 border bg-white rounded-lg dark:border-gray-50 p-6">
          <p className="text-sm font-black mb-2">BILAN : ACTIF</p>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400 mb-2">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Eléments
                  </th>
                  <th scope="col" className="px-4 py-3">
                    N
                  </th>
                  <th scope="col" className="px-4 py-3">
                    N - 1
                  </th>
                  <th scope="col" className="px-4 py-3">
                    N - 2
                  </th>
                </tr>
              </thead>
              <tbody>
                {actifs.map((component) => (
                  <tr
                    key={component.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <th
                      scope="row"
                      className="items-center px-1 py-2 font-bold text-[0.7rem] text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {component?.label?.toUpperCase()}
                    </th>
                    <td className="px-1 py-2">
                      <NumericFormat
                        value={component?.value?.toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={' '}
                        suffix={' XAF'}
                      />
                    </td>
                    <td className="px-1 py-2">
                      <NumericFormat
                        value={component?.value_1?.toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={' '}
                        suffix={' XAF'}
                      />
                    </td>
                    <td className="px-1 py-2">
                      <NumericFormat
                        value={component?.value_2?.toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={' '}
                        suffix={' XAF'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-1/2 border bg-white rounded-lg dark:border-gray-50 p-6">
          <p className="text-sm  font-black">BILAN : PASSIF</p>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400 mb-2">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Eléments
                </th>
                <th scope="col" className="px-4 py-3">
                  N
                </th>
                <th scope="col" className="px-4 py-3">
                  N - 1
                </th>
                <th scope="col" className="px-4 py-3">
                  N - 2
                </th>
              </tr>
              </thead>
              <tbody>
              {passifs.map((component) => (
                <tr
                  key={component.id}
                  className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <th
                    scope="row"
                    className="items-center px-1 py-2 font-bold text-[0.7rem] text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {component?.label?.toUpperCase()}
                  </th>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value_1?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value_2?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-full mt-2">
        <div className="w-full border bg-white rounded-lg dark:border-gray-50 p-6">
          <p className="text-sm  font-black">COMPTE DE RESULTAT</p>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400 mb-2">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Eléments
                </th>
                <th scope="col" className="px-4 py-3">
                  N
                </th>
                <th scope="col" className="px-4 py-3">
                  N - 1
                </th>
                <th scope="col" className="px-4 py-3">
                  N - 2
                </th>
              </tr>
              </thead>
              <tbody>
              {resultats.map((component) => (
                <tr
                  key={component.id}
                  className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <th
                    scope="row"
                    className="items-center px-1 py-2 font-bold text-[0.7rem] text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {component?.label?.toUpperCase()}
                  </th>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value_1?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value_2?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-2 mt-2">
        <div className="w-1/2 border bg-white rounded-lg dark:border-gray-50 p-6">
          <p className="text-sm  font-black">AUTRES INDICATEURS</p>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400 mb-2">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Eléments
                </th>
                <th scope="col" className="px-4 py-3">
                  N
                </th>
                <th scope="col" className="px-4 py-3">
                  N - 1
                </th>
                <th scope="col" className="px-4 py-3">
                  N - 2
                </th>
              </tr>
              </thead>
              <tbody>
              {indicateurs.map((component) => (
                <tr
                  key={component.id}
                  className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <th
                    scope="row"
                    className="items-center px-1 py-2 font-bold text-[0.7rem] text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {component?.label?.toUpperCase()}
                  </th>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value_1?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value_2?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-1/2 border bg-white rounded-lg dark:border-gray-50 p-6">
          <p className="text-sm  font-black">DECOMPOSITION DES FONDS PROPRES</p>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400 mb-2">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Eléments
                </th>
                <th scope="col" className="px-4 py-3">
                  N
                </th>
                <th scope="col" className="px-4 py-3">
                  N - 1
                </th>
                <th scope="col" className="px-4 py-3">
                  N - 2
                </th>
              </tr>
              </thead>
              <tbody>
              {fonds.map((component) => (
                <tr
                  key={component.id}
                  className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <th
                    scope="row"
                    className="items-center px-1 py-2 font-bold text-[0.7rem] text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {component?.label?.toUpperCase()}
                  </th>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value_1?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                  <td className="px-1 py-2">
                    <NumericFormat
                      value={component?.value_2?.toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={' '}
                      suffix={' XAF'}
                    />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailReportSgo
