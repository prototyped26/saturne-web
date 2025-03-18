import { IFund, IHistoryLiquidationValue, IRequestHistoryLiquidationValue } from '../type'
import { useEffect, useState } from 'react'
import { getHistoryLiquidationValue } from '../services/opcService'
import { getMessageErrorRequestEx } from '../utils/errors'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, ChartData
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import moment from 'moment/moment'
import ValueIndicateFluctuation from './ValueIndicateFluctuation'
import { NumericFormat } from 'react-number-format'

type Props = {
  fund: IFund,
  token: string
}

type TableEvol = {
  label: string,
  value: number,
  evolution: number
}

function HistoryLiquidationDiagram({ fund, token }: Props): JSX.Element {
  const [search, setSearch] = useState<IRequestHistoryLiquidationValue>()
  const [index, setIndex] = useState(1)
  const [labels, setLabels] = useState<string[]>([])
  const [values, setValues] = useState<number[]>([])
  const [dataLine, setDataLine] = useState({})
  const [show, setShow] = useState(false)
  const [liquidations, setLiquidations] = useState<IHistoryLiquidationValue[]>([])
  const [dateTo, setDateTo] = useState('')
  const [dateAt, setDateAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [tableEvolutions, setTableEvolutions] = useState<TableEvol[]>([])

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Historique des valeurs liquidatives'
      }
    }
  }

  useEffect(() => {
    console.log('charge le composant ' + index)
    setIndex(index + 1)
    setSearch({ fund_id: fund?.id as number, date_at: null, date_to: null })
  }, [fund])

  useEffect(() => {
    if (search !== undefined && search?.fund_id !== null) loadHistory()
  }, [search])

  useEffect(() => {
    if (liquidations.length > 0) initChart()
  }, [liquidations])

  useEffect(() => {

  }, [labels, values])

  const loadHistory = async (): Promise<void> => {
    try {
      const res = await getHistoryLiquidationValue(token, search as IRequestHistoryLiquidationValue)
      const tab = res?.data as IHistoryLiquidationValue[]
      setLiquidations(tab)

      const tabEvols: TableEvol[] = []
      tab.forEach((r, index) => {
        const elt: TableEvol = {
          label: r.period,
          value: r.value,
          evolution: index === 0 ? 0 : (((r.value - tab[index - 1].value) * 100) / tab[index - 1].value)
        }
        tabEvols.push(elt)
      })
      setTableEvolutions(tabEvols.reverse())
      //console.log(res?.data)
    } catch (e) {
      console.log(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  const initChart = (): void => {
    const data: string[] = []
    const lines: number[] = []
    liquidations.forEach((l) => {
      data.push(moment(l.period).format('DD MMMM YYYY'))
      lines.push(l.value)
    })
    setLabels(data)
    setValues(lines)

    const r = {
      labels: data,
      datasets: [
        {
          label: 'Val. Liquidative',
          data: lines,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }
      ]
    }

    console.log(r)

    setDataLine(r)
    setShow(true)
  }

  const onHandleSearch = (): void => {

    const isAfter = moment(dateAt).isAfter(dateTo)
    if (!isAfter) {
      setSearch({ fund_id: fund?.id as number, date_at: dateAt, date_to: dateTo })
      setLoading(true)
    } else {
      // la date doit être inférieure
    }
  }

  return (
    <div className="w-full">

      <div className="h-80 w-full ">
        <div className="row flex gap-4">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Du : </span>
            </div>
            <input
              type="date"
              onChange={(e) => setDateAt(e.target.value)}
              placeholder="Type here"
              className="input input-sm input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Au : </span>
            </div>
            <input
              type="date"
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Type here"
              className="input input-sm input-bordered w-full max-w-xs"
            />
          </label>
          {loading && (
            <button disabled className="btn btn-sm mt-9">
              <span className="loading loading-spinner"></span>
            </button>
          )}
          {!loading && <button onClick={() => onHandleSearch()} className="btn btn-sm mt-9">Appliquer</button>}
        </div>

        <div className="row flex items-center justify-center w-full">
          {show && <Line width={760} data={dataLine as ChartData<'line'>} options={options} />}
        </div>

      </div>

      <div className="row flex mt-2 pr-4">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-10">
          <thead className=" text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-4 py-3">
              En date du
            </th>
            <th scope="col" className="px-4 py-3">
              Valeur Liquidative
            </th>
            <th scope="col" className="px-4 py-3">
              Evolution
            </th>
          </tr>
          </thead>
          <tbody>
          {tableEvolutions.map((evolution) => (
            <tr
              key={Math.random() * (Date.now() + Math.random())}
              className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="w-4 px-4 py-3">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <td className="px-4 py-2">
                <label className="font-medium">{moment(evolution.label).format('DD MMMM YYYY')}</label>
              </td>
              <td className="px-4 py-2"> <NumericFormat value={evolution.value.toFixed(2)} displayType={'text'} thousandSeparator={true} suffix={' XAF'} /></td>
              <td className="px-4 py-2 font-bold"> <ValueIndicateFluctuation value={evolution.evolution} /> </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HistoryLiquidationDiagram
