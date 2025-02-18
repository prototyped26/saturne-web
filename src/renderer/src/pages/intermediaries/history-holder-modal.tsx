import { IHolderGrouped, IOrganization } from '../../type'
import { useEffect, useState } from 'react'
import { getHoldersGrouped } from '../../services/intermediaryService'
import { getMessageErrorRequestEx } from '../../utils/errors'

type Props = {
  token: string,
  success: (m) => void,
  error: (m) => void,
  organization: IOrganization
}

const closeModal = (): void => {

}

function HistoryHolderModal({token, success, error, organization}: Props): JSX.Element {

  const [list, setList] = useState<IHolderGrouped[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async (): Promise<void> => {
    try {
      const res = await getHoldersGrouped(token as string, organization.id as number)
      //console.log(res)
      setList(res.data as IHolderGrouped[])
    } catch (e) {
      error(getMessageErrorRequestEx(e));
    }
  }

  return (
    <dialog id="modal-history-holders" className="modal">
      <div className="modal-box  w-11/12 max-w-5xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg ">Historique des actionnaires</h3>
        <div className="mt-1 p-4">
          {list.map((data) => (
            <div key={data.label} className="mb-2">
              <h3 className="font-medium border-b-2">
                Au : <b>{data.label}</b> avec {data.holders.length} actionnaire
                {data.holders.length > 1 ? 's' : ''}
              </h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom & Prénom</th>
                    <th>Part(Actions)</th>
                    <th>Capital (CFA)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.holders.map((holder) => (
                    <tr key={holder.id}>
                      <td className="font-bold">{holder.first_name}</td>
                      <td className="">{holder.shares}</td>
                      <td className="">{Number(holder.value) * Number(holder.shares)} F. CFA</td>
                      <td>{holder.percent} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </dialog>
  )
}

export default HistoryHolderModal
