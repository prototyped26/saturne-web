import { IFund, IIntermediary } from '../../type'
import { useEffect, useState } from 'react'
import { getMessageErrorRequestEx } from '../../utils/errors'
import LoadingTable from '../../components/LoadingTable'
import NoDataList from '../../components/NoDataList'
import { getFundsBySgo } from '../../services/fundService'

type Props = {
  intermediary: IIntermediary,
  token: string
}

function FundsSgoList({ intermediary, token }: Props): JSX.Element {

  const [loading, setLoading] = useState(true)
  const [funds, setFunds] = useState<IFund[]>([])

  useEffect(() => {
    loadFunds()
  }, [])

  const loadFunds = async (): Promise<void> => {
    try {
      const res = await getFundsBySgo(token, intermediary?.id as number)
      setFunds(res.data as IFund[])
    } catch (e) {
      console.log(getMessageErrorRequestEx(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {loading && (<LoadingTable />)}

      {!loading && funds.length === 0 && (<NoDataList message={"Pas de fonds pour cette société de gestion."} />)}

      {!loading && funds.length > 0 && (
        <div className="flex gap-4 w-full border bg-white rounded-lg dark:border-gray-50">
          <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400 mb-10">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                Dénomination
              </th>
              <th scope="col" className="px-4 py-3">
                Agrément
              </th>
              <th scope="col" className="px-4 py-3">
                Type OPC
              </th>
              <th scope="col" className="px-4 py-3">
                Dépositaire
              </th>
              <th scope="col" className="px-4 py-3">
                Classification
              </th>
              <th scope="col" className="px-4 py-3">
                Distribution
              </th>
              <th scope="col" className="px-4 py-3"></th>
            </tr>
            </thead>
            <tbody>
              {funds.map((fund) => (
                <tr key={Math.random() * Date.now()}>
                  <th></th>
                  <td>{fund.label}</td>
                  <td>{fund.approval_number}</td>
                  <td>{fund.typeOpc?.label}</td>
                  <td>{fund.depositary?.label}</td>
                  <td>{fund.classification?.label}</td>
                  <td>{fund.distribution?.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}

export default FundsSgoList
