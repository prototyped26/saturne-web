import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { useEffect, useState } from 'react'
import { IHolder, IOrganization } from '../../type'
import { FiTrash } from 'react-icons/fi'
import { Simulate } from 'react-dom/test-utils'
import { createHolders } from '../../services/intermediaryService'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { setAllHolders } from '../../store/intermediarySlice'

type Props = {
  data: IHolder[] | null | undefined,
  token: string,
  organization: IOrganization | null,
  success: (m) => void,
  error: (m) => void,
  open?: boolean,
  change?: () => void
}

function EditHoldersModal({ data, token, success, error, organization, open, change }: Props): JSX.Element {
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const [holders, setHolders] = useState<IHolder[]>([])
  const [loading, setLoadding] = useState(false)

  useEffect(() => {
    if (open) {
      setHolders(data)
      //console.log(data)
      setTimeout(() => {
        initValue()
      }, 800)
    }
  }, [open])

  const closeModal = (): void => {
    change()
  }

  const onHandleAddHolder = (): void => {
    let value = 0
    if (holders.length > 0) {
      value = holders[0].value as number
    }

    const h: IHolder = {
      first_name: '',
      shares: 0,
      value: value,
      percent: 0,
      ligne: Date.now()
    }
    const arr: IHolder[] = []
    arr.push(h)
    console.log(arr)
    setHolders([...holders, ...arr])
  }

  const onChangeHolderName = (i, val): void => {
    const h = holders.find((holder) => holder.ligne === i)
    if (h) {
      h.first_name = val
      const arr = holders.map((holder) => holder.ligne === i ? h : holder )
      setHolders(arr)
    }
  }

  const onChangeHolderShares = (hold: IHolder, val): void => {
    const value = Number(val)
    let h
    if (hold.id !== null) {
      h = holders.find((holder) => holder.id === hold.id)
    } else {
      h = holders.find((holder) => holder.ligne === hold.ligne)
    }

    if (h) {
      h.shares = value
      h.capital = h.value as number * (h.shares as number)
      h.percent = Number(((h.capital / Number(organization?.capital)) * 100).toFixed(2))
      let arr
      if (hold.id !== null) {
        arr = holders.map((holder) => holder?.id === hold.id ? h : holder )
      } else {
        arr = holders.map((holder) => holder?.ligne === hold.ligne ? h : holder )
      }
      setHolders(arr)
    }
  }

  const onChangeHolderValue = (hold: IHolder, val): void => {
    const value = Number(val)
    const h = holders.find((holder) => holder.ligne === hold.ligne)
    if (h) {
      h.value = value
      h.capital = value * (h.shares as number)
      h.percent = Number(((h.capital / Number(organization?.capital)) * 100).toFixed(2))
      const arr = holders.map((holder) => holder.ligne === hold.ligne ? h : holder )
      setHolders(arr)
    }
  }

  const onChangeHolderCapital = (i, val): void => {
    if (val) {
      const h = holders.find((holder) => holder.ligne === i)
      if (h) {
        h.capital = val as number
        const arr = holders.map((holder) => holder.ligne === i ? h : holder )
        setHolders(arr)
      }
    }
  }

  const onChangeHolderPercent = (i, val): void => {
    if (val) {
      const h = holders.find((holder) => holder.ligne === i)
      if (h) {
        h.percent = val as number
        const arr = holders.map((holder) => holder.ligne === i ? h : holder )
        setHolders(arr)
      }
    }
  }

  const initValue = (): void => {
    const list: IHolder[] = []
    data.forEach((holder) => {
      const h: IHolder = {
        ligne: Date.now() + Math.random(),
        shares: holder.shares,
        value: holder.value,
        percent: holder.percent,
        capital: Number(holder.value) * Number(holder.shares),
        first_name: holder.first_name,
        id: holder.id,
        organization_id: organization?.id
      }
      list.push(h)
    })
    setHolders(list)
  }

  const onHandleRemoveHolder = (i: number): void => {
    const arr = holders.filter((holder) => holder.ligne !== i)
    setHolders(arr)
  }

  const onHandleUpdate = async (): Promise<void> => {
    if (holders.length === 0) error("Opération impossible, la liste est vide !")

    setLoadding(true)

    try {
      const data = {
        holders: holders
      }
      const res = await createHolders(token, data)
      dispatch(setAllHolders(res.data as IHolder[]))
      setHolders([])
      document?.getElementById("cls-btn-modal-up-holders")?.click()
    } catch (e) {
      error(getMessageErrorRequestEx(e))
    } finally {
      setLoadding(false)
    }

  }

  return (
    <dialog id="modal-edit-holders" className="modal">
      <div className="modal-box  w-11/12 max-w-5xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg ">Mettre à jour la liste d'actionnaires</h3>

        <table className="table">
          <thead>
          <tr>
            <th>Nom/Dénomination Sociale</th>
            <th>Actions</th>
            <th>Valeur (F.CFA)</th>
            <th>Capital (F.CFA)</th>
            <th>%</th>
            <th>
              <button onClick={onHandleAddHolder} className="btn btn-sm">
                ajouter
              </button>
            </th>
          </tr>
          </thead>
          <tbody>
          {holders.map((holder) => (
            <tr key={holder.ligne}>
              <th>
                <input
                  type="text"
                  value={holder.first_name}
                  onChange={(e) => onChangeHolderName(holder.ligne, e.target.value)}
                  placeholder="Actionnaire..."
                  className="input input-sm input-bordered w-full "
                />
              </th>
              <td>
                <input
                  type="number"
                  value={holder.shares}
                  onChange={(e) => onChangeHolderShares(holder, e.target.value)}
                  className="input input-sm input-bordered w-full "
                />
              </td>
              <td>
                <input
                  type="number"
                  value={holder.value}
                  onChange={(e) => onChangeHolderValue(holder, e.target.value)}
                  className="input input-sm input-bordered w-full "
                />
              </td>
              <td>
                <input
                  type="number"
                  value={holder.capital}
                  onChange={(e) => onChangeHolderCapital(holder, e.target.value)}
                  placeholder="..."
                  className="input input-sm input-bordered w-full "
                />
              </td>
              <td>
                <input
                  type="number"
                  value={holder.percent}
                  onChange={(e) => onChangeHolderPercent(holder, e.target.value)}
                  placeholder="..."
                  className="input input-sm input-bordered w-full "
                />
              </td>
              <td className="">
                <a
                  onClick={() => onHandleRemoveHolder(holder as number)}
                  className="text-error font-bold"
                >
                  <FiTrash />
                </a>
              </td>
            </tr>
          ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <form method="dialog">
            <button onClick={closeModal} id="cls-btn-modal-up-holders" className="btn btn-sm">
              Fermer
            </button>
          </form>
          {!loading && (
            <button onClick={() => onHandleUpdate()} className="btn btn-sm bg-app-primary ml-2 text-white">
              mettre à jour
            </button>
          )}
          {loading && (
            <button className="btn btn-sm btn-disabled ml-2 text-white">
              <span className="loading loading-spinner"></span>
              Traitement
            </button>
          )}
        </div>
      </div>
    </dialog>
  )
}

export default EditHoldersModal
