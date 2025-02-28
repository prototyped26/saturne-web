import { IHistoryShareholder, IShareholder } from '../../../type'
import NoDataList from '../../../components/NoDataList'
import { determineNumberOfPartShareholder, determinePercentOfShareholder } from '../../../services/fundService'
import { FiPrinter } from 'react-icons/fi'
import DialogHistoryShareholders from './DialogHistoryShareholders'

type Props = {
  shareholders: IShareholder[],
  history: IHistoryShareholder[],
  parts: number
}
function PartShareholders({ shareholders, parts, history }: Props): JSX.Element {

  const onHandleShowHistory = ():void => {
    // @ts-ignore showmodal is use by DaisyUI
    document?.getElementById('modal-show-history-shareholders')?.showModal()
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 px-6 py-3 mt-2 gap-4 w-full">
      {shareholders.length === 0 && <NoDataList />}

      <div className="flex my-4 justify-between">
        <div>
          <h3 className="font-bold text-lg">Liste des porteurs de parts </h3>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm"><FiPrinter /></button>
          <button onClick={onHandleShowHistory} className="btn btn-sm">Historique</button>
        </div>
      </div>

      <table className="w-full text-left text-gray-500 dark:text-gray-400 mb-10">
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
              Porteur de part
            </th>
            <th scope="col" className="px-4 py-3">
              Nationalité
            </th>
            <th scope="col" className="px-4 py-3">
              Résidence
            </th>
            <th scope="col" className="px-4 py-3">
              N° Pièce identité
            </th>
            <th scope="col" className="px-4 py-3">
              PP/PM
            </th>
            <th scope="col" className="px-4 py-3">
              Catégorie
            </th>
            <th scope="col" className="px-4 py-3">
              Nb. Parts
            </th>
            <th scope="col" className="px-4 py-3">
              %
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {shareholders.map((shareholder) => (
            <tr key={Number(shareholder?.id) + Math.random()}>
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
              <th>{shareholder.label.toUpperCase()}</th>
              <td>{shareholder.nationality}</td>
              <td>{shareholder.residence}</td>
              <td>{shareholder.id_number}</td>
              <td>{shareholder.pp}</td>
              <td>{shareholder?.type?.label}</td>
              <td>{determineNumberOfPartShareholder(shareholder)}</td>
              <td>{determinePercentOfShareholder(parts, determineNumberOfPartShareholder(shareholder))} % </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DialogHistoryShareholders histories={history} />
    </div>
  )
}

export default PartShareholders
