import { IFollowFund, IOpc, IReportNote } from '../type'
import { useEffect, useState } from 'react'
import { getReportResult } from '../services/opcService'
import BadgeRiskString from './BadgeRiskString'
import { FiCheck, FiEye } from 'react-icons/fi'
import { FaXmark } from 'react-icons/fa6'

type Props = {
  token: string,
  opc: IOpc
}

function ReportOpcWeekly({ token, opc }: Props): JSX.Element {

  useEffect(() => {
    loadResult()
  }, [])

  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<IReportNote[]>([])
  const [title, setTitle] = useState('')
  const [items, setItems] = useState<IFollowFund[]>([])

  const loadResult = async (): Promise<void> => {
    const res = await getReportResult(token, opc?.id as number)
    setResult(res.data as IReportNote[])
    setLoading(false)
  }

  const onHandleViewDetail = (title: string ,items: IFollowFund[]): void => {
    setTitle(title)
    setItems(items)
    // @ts-ignore fonction DaisyUI
    document?.getElementById("modal-detail-follow")?.showModal();
  }

  return (
    <div>
      {loading && <span className="loading loading-spinner"></span>}
      {!loading && (
        <div>
          <div className="stats shadow">
            {result.map((note) => (
              <div key={Math.random() + Math.random()} className="stat place-items-center">
                <div className="stat-title text-[12px] font-bold">{note.label}
                  <button className="btn btn-outline btn-xs ml-2 font-bold text-[14px]"
                          onClick={() => onHandleViewDetail(note.label, note.items as IFollowFund[])}><FiEye /></button>
                </div>
                <div className="stat-value text-sm">{note.notation} %</div>
                <div className="stat-desc text-[10px]"><BadgeRiskString label={note.note} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <dialog id="modal-detail-follow" className="modal">
        <div className="modal-box w-11/12 max-w-4xl">
          <form id="form-modal-detail-follow" method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg ">{title}</h3>
          <p>Détails de la notation de cette règle.</p>
          <div className="overflow-x-auto">
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
                  Libellé
                </th>
                <th scope="col" className="px-4 py-3"></th>
              </tr>
              </thead>
              <tbody>
              {items.map((elt) => (
                <tr
                  key={Math.random() * Date.now()}
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
                  <th
                    scope="row"
                    className=" items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {elt.rule?.label}
                  </th>
                  <td className="px-4 py-2 font-bold text-gray-900 whitespace-nowrap dark:text-white">
                    {elt.standard && (<FiCheck color={"#28de0a"} size={15} />)}
                    {!elt.standard && (<FaXmark color={"#fb3111"} size={15}  />)}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

        </div>

      </dialog>

    </div>
  )
}

export default ReportOpcWeekly
