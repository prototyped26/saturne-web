import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2'
import ChartActifSousGestion from './dash/ChartActifSousGestion'
import { useEffect, useState } from 'react'
import { getMessageErrorRequestEx } from '../utils/errors'
import { getDashActifs, getDashLiquidatives } from '../services/opcService'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { IDashActifs, IDashLiquidative } from '../type'
import { NumericFormat } from 'react-number-format'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function Dash(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

  const token: string | null = useAppSelector((state) => state.user.token)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Valeurs Liquidatives des fonds',
      },
      chartDataLabels: {
        display: true,
        color: 'rgba(256, 256, 256, 1)'
      }
    },
  }

  const [loadActifs, setLoadActifs] = useState(true)
  const [loadLiquidatives, setLoadLiquidatives] = useState(true)
  const [dashActifs, setDashActifs] = useState<IDashActifs | null>(null)
  const [liquidatives, setLiquidatives] = useState<IDashLiquidative[]>([])
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    loadDashActifs()
    loadDashLiquidatives()
  }, [])

  useEffect(() => {

  }, [liquidatives])

  const loadDashActifs = async (): Promise<void> => {
    setLoadActifs(true)

    try {
      const res = await getDashActifs(token as string)
      setDashActifs(res.data as IDashActifs)
    } catch (e) {
      const noData: IDashActifs = {
        actifsMandate: 0,
        totalActifs: 0,
        countSgo: 0,
        actifsFund: 0
      }
      setDashActifs(noData)
      console.log(getMessageErrorRequestEx(e))
    } finally {
      setLoadActifs(false)
    }
  }

  const calculatePercentValue = (value: number): number => {
    let res = 0

    try {
      res = (value / Number(dashActifs?.totalActifs)) * 100
    } catch (e) {
      console.log(e)
    }

    return Number(res.toFixed(2))
  }

  const loadDashLiquidatives = async (): Promise<void> => {
    setLoadLiquidatives(true)

    try {
      const res = await getDashLiquidatives(token as string)
      setLiquidatives(res.data as IDashLiquidative[])
      const val = res.data as IDashLiquidative[]

      const labels: string[] = []
      const values: number[] = []

      val.forEach((elt) => {
        labels.push(elt.label)
        values.push(Number(elt.value.toFixed(2)))
      })

      const data = {
        labels,
        datasets: [
          {
            label: 'V.L (XAF)',
            data: values,
            backgroundColor: 'rgba(229, 182, 102, 0.8)'
          }
        ]
      }

      setData(data)
    } catch (e) {
      console.log(getMessageErrorRequestEx(e))
    } finally {
      setLoadLiquidatives(false)
    }
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 p-6 mb-4 z-20">
      <h3 className="tracking-tight font-bold text-3xl text-app-title">Tableau de bord</h3>
      <p className="tracking-tight font-light text-1xl text-app-sub-title">
        Suivi de l ensemble des données du système.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mt-6 mb-4">
        <div className=" dark:border-gray-600 flex gap-4">
          {loadActifs && (
            <div className="flex w-full items-center justify-center">
              <span className="loading loading-spinner"></span>
            </div>
          )}
          {!loadActifs && (
            <div className="flex gap-4">
              <div className="w-1/2 pt-4">
                <div className="stats shadow bg-app-secondary text-white w-full">
                  <div className="stat">
                    <div className="stat-title text-white font-bold">Total Actifs Gérés</div>
                    <div className="stat-value text-2xl">
                      <NumericFormat
                        value={dashActifs?.totalActifs.toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={' '}
                        suffix={' XAF'}
                      />{' '}
                    </div>
                    <div className="stat-desc"></div>
                  </div>
                </div>

                <div className="rounded-lg shadow w-full mt-4 p2">
                  <div className="px-4 my-2">
                    <div className="flex justify-between">
                      <p className="text-xs">
                        <p>Total Actifs OPC </p>
                        <p>{calculatePercentValue(dashActifs?.actifsFund as number)} %</p>
                      </p>
                      <p className="font-bold text-xs">
                        <NumericFormat
                          value={dashActifs?.actifsFund.toFixed(2)}
                          displayType={'text'}
                          thousandSeparator={' '}
                          suffix={' XAF'}
                        />
                      </p>
                    </div>
                    <progress
                      className="progress  w-full"
                      value={calculatePercentValue(dashActifs?.actifsFund as number)}
                      max="100"
                    ></progress>
                  </div>
                  <div className="px-4 my-2">
                    <div className="flex justify-between">
                      <p className="text-xs">
                        <p>Total Actifs Mandats </p>
                        <p>{calculatePercentValue(dashActifs?.actifsMandate as number)} %</p>
                      </p>
                      <p className="font-bold text-xs">
                        <NumericFormat
                          value={dashActifs?.actifsMandate.toFixed(2)}
                          displayType={'text'}
                          thousandSeparator={' '}
                          suffix={' XAF'}
                        />
                      </p>
                    </div>
                    <progress
                      className="progress progress-accent w-full"
                      value={calculatePercentValue(dashActifs?.actifsMandate as number)}
                      max="100"
                    ></progress>
                  </div>
                </div>

                <div className="stats shadow w-full mt-4">
                  <div className="stat">
                    <div className="stat-title font-bold">Nombre de SGO</div>
                    <div className="stat-value"> {dashActifs?.countSgo}</div>
                    <div className="stat-desc"></div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 flex items-center justify-center ">
                <ChartActifSousGestion
                  mandate={dashActifs?.actifsMandate as number}
                  fund={dashActifs?.actifsFund as number}
                />
              </div>
            </div>
          )}
        </div>
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 flex items-center justify-center">
          {loadLiquidatives && (
            <div className="flex w-full items-center justify-center">
              <span className="loading loading-spinner"></span>
            </div>
          )}
          {!loadLiquidatives && data !== null && data !== undefined && (
            <Bar options={options} data={data} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dash
