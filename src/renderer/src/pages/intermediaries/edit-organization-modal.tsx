import { useEffect, useState } from 'react'
import { IOrganization } from '../../type'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { updateOrganization } from '../../services/intermediaryService'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { refreshOrganization } from '../../store/intermediarySlice'

type Props = {
  token: string
  organization: IOrganization | null,
  success: (m) => void,
  error: (m) => void
}

function EditOrganizationModal({ token, organization, success, error }: Props): JSX.Element {
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const [organizationStatus, setOrganizationStatus] = useState('')
  const [capital, setCapital] = useState('')
  const [loading, setLoadding] = useState(false)

  useEffect(() => {
    setOrganizationStatus(organization?.status as string)
    setCapital('' + organization?.capital)
  }, [])

  const onHandleUpdateOrg = async (): Promise<void> => {
    const org: IOrganization = {
      capital: capital,
      status: organizationStatus,
      header: organization?.header,
      label: organization?.label
    }

    setLoadding(true)

    try {
      const res = await updateOrganization(token, organization?.id as number, org)
      dispatch(refreshOrganization(res.data as IOrganization))
      success("Mise à jour effectuée !")
      document?.getElementById('cls-btn-modal-up-org')?.click()
    } catch (e) {
      error(getMessageErrorRequestEx(e))
    } finally {
      setLoadding(false)
    }
  }

  return (
    <dialog id="modal-edit-organization" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg ">Mettre à jour la société</h3>

        <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
          Capital de la socité (F. CFA)
        </p>
        <input
          type="number" value={capital}
          placeholder="... CFA"
          className="input input-bordered w-full "
          onChange={(e) => setCapital(e.target.value)}
        />

        <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
          Forme Juridique
        </p>
        <select
          value={organizationStatus}
          onChange={(e) => setOrganizationStatus(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value=""></option>
          <option value="ETS">Etablissement</option>
          <option value="SARL">SARL</option>
          <option value="SA">S.A</option>
          <option value="SAS">S A S</option>
          <option value="OTHER">Autre</option>
        </select>

        <div className="flex justify-end mt-4">
          <form method="dialog">
            <button id="cls-btn-modal-up-org" className="btn btn-sm">
              Fermer
            </button>
          </form>
          {!loading && (
            <button onClick={() => onHandleUpdateOrg()} className="btn btn-sm bg-app-primary ml-2 text-white">
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

export default EditOrganizationModal
