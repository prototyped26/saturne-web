import { IFund, IHistoryLiquidationValue, IRequestHistoryLiquidationValue } from '../../../type'
import { useEffect, useState } from 'react'
import { getHistoryLiquidationValue } from '../../../services/opcService'
import { getMessageErrorRequestEx } from '../../../utils/errors'
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
import { Line } from 'react-chartjs-2';
import moment from 'moment'
import { NumericFormat } from 'react-number-format'
import ValueIndicateFluctuation from '../../../components/ValueIndicateFluctuation'

type Props = {
  token: string,
  fund: IFund,
  funds: IFund[],
  success: (m) => void,
  error: (m) => void
}

type TableEvol = {
  label: string,
  value: number,
  evolution: number
}

type CompareItem = {
  fund: IFund,
  valueStart: number,
  valueEnd: number,
  percent: number
}

function PartCompareTwoValue({ token, fund, funds, error }: Props): JSX.Element {

  const [dateTo, setDateTo] = useState('')
  const [dateAt, setDateAt] = useState('')
  const [compareId, setCompareId] = useState('')
  const [loading, setLoading] = useState(false)
  const [evolutions, setEvolutions] = useState<TableEvol[]>([])
  const [evolutionsTwo, setEvolutionsTwo] = useState<TableEvol[]>([])
  const [secondLoad, setSecondLoad] = useState(false)
  const [labels, setLabels] = useState<string[]>([])
  const [dataLine, setDataLine] = useState({})
  const [show, setShow] = useState(false)
  const [compares, setCompares] = useState<CompareItem[]>([])

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Comparaison Valeur Liquidative des 2 fonds',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  useEffect(() => {
    if (secondLoad) {
      let titles: string[] = []
      evolutions.forEach((e) => {
        titles.push(e.label)
      })
      evolutionsTwo.forEach((e) => {
        titles.push(e.label)
      })
      titles = [...new Set(titles)]
      setLabels(titles)
      console.log(titles)
      initDiagram(titles)
    }
  }, [secondLoad])

  useEffect(() => {

  }, [labels])

  const onHandleSearch = async (): Promise<void> => {

    if (compareId.length === 0) {
      //console.log("Veuillez choisir un autre fond")
      error("Veuillez choisir un autre fond")
      return
    }

    if (dateAt.length === 0) {
      error('Veuillez choisir une date initiale')
      return
    }

    if (dateTo.length === 0) {
      error('Veuillez choisir une date pour la comparaison')
      return
    }

    setShow(false)
    await loadHistory(false)
    await loadHistory(true)
  }

  const loadHistory = async (isCompare: boolean): Promise<void> => {
    setLoading(true)
    try {
      const search: IRequestHistoryLiquidationValue = { fund_id: isCompare ? Number(compareId) : fund?.id as number, date_at: dateAt, date_to: dateTo }
      const res = await getHistoryLiquidationValue(token, search)
      const tab = res?.data as IHistoryLiquidationValue[]
      console.log(tab)

      const tabEvols: TableEvol[] = []

      tab.forEach((r, index) => {
        const elt: TableEvol = {
          label: r.period,
          value: r.value,
          evolution: index === 0 ? 0 : (((r.value - tab[index - 1].value) * 100) / tab[index - 1].value)
        }
        tabEvols.push(elt)
      })

      if (isCompare) {
        setEvolutionsTwo(tabEvols)
        setSecondLoad(true)
      }
      else setEvolutions(tabEvols)
      //setTableEvolutions(tabEvols.reverse())
      //console.log(res?.data)
    } catch (e) {
      console.log(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  const initDiagram = (titles: string[]): void => {

    const data1: number[] = []
    const data2: number[] = []

    titles.forEach((t) => {
      evolutions.forEach((e) => {
        if (t === e.label) {
          data1.push(e.value)
        }
      })

      evolutionsTwo.forEach((e) => {
        if (t === e.label) {
          data2.push(e.value)
        }
      })
    })

    const listCompare: CompareItem[] = []

    const compareElt: CompareItem = {
      fund: funds?.find((f) => f.id === Number(compareId)) as IFund,
      valueStart: Number(data2[0]),
      valueEnd: Number(data2[data2.length - 1]),
      percent: Number((((Number(data2[data2.length - 1]) - Number(data2[0])) * 100) / Number(data2[0])).toFixed(2))
    }

    const compareElt2: CompareItem = {
      fund: fund,
      valueStart: Number(data1[0]),
      valueEnd: Number(data1[data1.length - 1]),
      percent: Number((((Number(data1[data1.length - 1]) - Number(data1[0])) * 100) / Number(data1[0])).toFixed(2))
    }

    listCompare.push(compareElt)
    listCompare.push(compareElt2)

    const r = {
      labels: titles,
      datasets: [
        {
          label: '' + fund?.label?.toUpperCase(),
          data: data1,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y',
        },
        {
          label: '' + funds.find((f) => f.id === Number(compareId))?.label?.toUpperCase(),
          data: data2,
          borderColor: 'rgb(10,93,166)',
          backgroundColor: 'rgba(10,93,166, 0.5)',
          yAxisID: 'y1',
        }
      ]
    }

    console.log(r)

    setCompares(listCompare)
    setDataLine(r)
    setShow(true)
    setSecondLoad(false)
  }

  // @ts-ignore chart
  return (
    <div className="flex w-full gap-4">
      <div className="w-1/3 border bg-white rounded-lg dark:border-gray-50 px-6 py-3">
        <p className="tracking-tight font-medium mb-2">Sélectionner un fond pour comparer</p>
        <select
          onChange={(e) => setCompareId(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value=""></option>
          {funds.map((f) => (
            <option key={f.id} value={f.id}>
              {f?.label?.toUpperCase()}
            </option>
          ))}
        </select>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Sur la période allant du : </span>
          </div>
          <input
            type="date"
            onChange={(e) => setDateAt(e.target.value)}
            placeholder="Type here"
            className="input input-sm input-bordered w-full"
          />
        </label>

        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Au : </span>
          </div>
          <input
            type="date"
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="Type here"
            className="input input-sm input-bordered w-full "
          />
        </label>

        {loading && (
          <button disabled className="btn btn-block btn-sm mt-4">
            <span className="loading loading-spinner"></span>
          </button>
        )}
        {!loading && (
          <button onClick={() => onHandleSearch()} className="btn btn-sm mt-4 btn-block">
            Comparer
          </button>
        )}
      </div>

      <div className="w-2/3 border bg-white rounded-lg dark:border-gray-50 px-6 py-3">
        {show && <Line width={760} height={340} data={dataLine as ChartData<'line'>} options={options} />}

        {show && (
          <div className="mt-2">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400 mb-10">
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
                    FOND
                  </th>
                  <th scope="col" className="px-4 py-3">
                    V.L au {moment(dateAt).format('DD MMMM YYYY')}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    V.L au {moment(dateTo).format('DD MMMM YYYY')}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                {compares.map((compare) => (
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
                      <label className="font-medium">{compare?.fund?.label?.toUpperCase()}</label>
                    </td>
                    <td className="px-4 py-2">
                      <NumericFormat
                        value={compare?.valueStart.toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={' XAF'}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <NumericFormat
                        value={compare?.valueEnd.toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={' XAF'}
                      />
                    </td>
                    <td className="px-4 py-2 font-bold">
                      <ValueIndicateFluctuation value={compare?.percent} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartCompareTwoValue
