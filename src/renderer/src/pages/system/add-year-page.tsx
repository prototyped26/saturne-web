import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { getMessageErrorRequestEx } from '../../utils/errors'
import { IYear } from '../../type'
import { createYear, generateWeek } from '../../services/systemService'
import { addYear } from '../../store/systemSlice'
import { setInformationMessage, setSuccess } from '../../store/informationSlice'

function AddYearPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const token: string | null = useAppSelector((state) => state.user.token)
  const [loading, setLoading] = useState(false)

  const [label, setLabel] = useState("")

  const onHandleAdd = async (): Promise<void> => {
    setLoading(true)

    try {
      const year: IYear = {
        label: label,
        code: label,
        active: false
      }

      const res = await createYear(token, year)
      dispatch(addYear(res.data as IYear))
      await generateWeek(token, year.code as string)
      dispatch(setSuccess("Année ajoutée avec succés !"))
      dispatch(setInformationMessage("Année ajoutée avec succés !"))
      navigate("/dash/system/years")

    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), {
        theme: 'colored'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 h-full p-6 mb-4 z-20">
      <ToastContainer />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">
           Ajout d'une année
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Veuillez remplir le formulaire
          </p>
        </div>
        <div className="flex  justify-end ">
          <Link to="/dash/system/years" className="btn btn-md ml-2">
            Fermer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 flex gap-4 mb-4 items-center justify-center ">
        <div className="w-2/3 h-64 mx-auto px-12">
          <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">Saisir l'année</p>
          <input type="number" placeholder="1990" className="input input-bordered w-full"
                 onChange={(e) => setLabel(e.target.value)} />

          <div className="flex justify-between mt-2">
            <Link to="/dash/system/years" className="btn btn-md">
              Annuler
            </Link>

            {!loading && (
              <button onClick={onHandleAdd}
                      className="btn btn-md bg-app-primary text-white text-base">Enregister</button>
            )}

            {loading && (
              <button className="btn bg-app-primary text-white text-base btn-disabled">
                <span className="loading loading-spinner"></span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddYearPage
