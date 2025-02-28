import { IHistoryShareholder, IShareholder } from '../../../type'
import { determineNumberOfPartShareholder } from '../../../services/fundService'
import moment from 'moment'

type Props = {
  histories: IHistoryShareholder[]
}

function DialogHistoryShareholders({ histories }: Props): JSX.Element {
  return (
    <dialog id="modal-show-history-shareholders" className="modal">
      <div className="modal-box w-11/12 max-w-5xl h-2/3">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            id="close-dialog-history-shareholders"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Historique des porteurs de parts du fond </h3>
        <div className="flex w-full items-center justify-center mt-4">
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
                  Catégorie
                </th>
                <th scope="col" className="px-4 py-3">
                  Entre dans le fond
                </th>
                <th scope="col" className="px-4 py-3">
                  Sors le
                </th>
                <th scope="col" className="px-4 py-3">
                  Nb. Parts
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {histories.map((shareholder) => (
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
                  <th>{shareholder?.shareholder?.label?.toUpperCase()}</th>
                  <td>{shareholder?.shareholder?.type?.label}</td>
                  <td>{moment(shareholder?.date_start).format('DD MMM YYYY')}</td>
                  <td>{shareholder?.date_end !== null ? moment(shareholder?.date_end).format('DD MMM YYYY') : ' '}</td>
                  <td>
                    {determineNumberOfPartShareholder(shareholder?.shareholder as IShareholder)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </dialog>
  )
}

export default DialogHistoryShareholders
