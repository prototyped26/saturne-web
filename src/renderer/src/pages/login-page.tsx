import LogoCosumaf from "./../assets/log_full.png"
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { current, login } from '../services/userService'
import { ILogin, IUser } from '../type'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store'
import { setCurrent, setToken } from '../store/userSlice'

function LoginPage(): JSX.Element {

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()

  const dispatch = useAppDispatch()

  //const token = useAppSelector(state => state.user.token)

  const [email, setEmail] = useState<string|null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const onHandleLogin = async (e): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    const data: ILogin = {
      email: email,
      password: password
    }

    try {
      const res = await login(data)
      //console.log(res)
      dispatch(setToken(res))
      if (res !== null) {
        console.log("LE TOKEN N EST PAS VIDE ")
        await onGetCurrentUser(res)
      } else {
        console.log("LE TOKEN EST VIDE ****")
        setLoading(false)
      }
    } catch (err) {
      setError(true)
      setLoading(false)
      console.log(err)
    }
  }

  const onGetCurrentUser = async (t: string): Promise<void> => {
    try {
      const res = await current(t)
      //console.log(res.data)
      const user = res.data as IUser
      dispatch(setCurrent(user))
      navigate("/dash/main")
    } catch (e) {
      console.log("ERRORR CURRENT USER")
      console.log(e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(false), 4000)
    }
  }, [error])

  return (
    <div className="bg-app-gray-second dark:bg-gray-900  h-screen">
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="dark:border-gray-600 h-full items-center content-center mx-auto">
          <img src={LogoCosumaf} height="650" width="600" />
        </div>

        <div className="border-gray-300 dark:border-gray-600 p-5">
          <div className="bg-white h-full rounded-2xl w-full p-10">
            <div className="flex flex-row items-center justify-center w-full mb-4">
              <div className="w-2/3 flex flex-col items-center">
                <h2 className=" font-extrabold text-3xl border-b-2 border-app-secondary px-32 pb-3 text-app-secondary">
                  SATURNE
                </h2>
              </div>
            </div>

            <div className="mt-14">
              <h3 className="tracking-tight font-bold text-3xl text-app-primary ">Connexion</h3>
              <p className="tracking-tight font-light text-1xl mt-2 text-app-sub-title">
                Veuillez saisir vos données de connexion au système.
              </p>

              {error && (
                <div role="alert" className="alert alert-error text-white mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Erreur de login et mot de passe</span>
                </div>
              )}

              <form>
                <div className="mt-10">
                  <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                    Adresse email
                  </p>
                  <input
                    type="email" required
                    placeholder="utilisateur@mail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full mb-5"
                  />

                  <p className="tracking-tight font-light text-1xl mt-2 mb-1 text-app-sub-title">
                    Mot de passe
                  </p>
                  <input
                    type="password" required
                    placeholder="*****************"
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full mb-10"
                  />
                  {loading ? (
                    <button className="btn btn-block bg-app-secondary text-white text-base disabled">
                      <span className="loading loading-spinner"></span> Traitement
                    </button>
                  ) : (
                    <button
                      onClick={onHandleLogin}
                      className="btn btn-block bg-app-secondary text-white text-base"
                    >
                      CONNEXION
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
