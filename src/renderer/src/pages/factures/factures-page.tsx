import { ToastContainer } from 'react-toastify'

function FacturesPage(): JSX.Element {
  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 h-full p-6 mb-4 z-20">
      <ToastContainer />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">
            En Construction ...
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Gestion et configuration des outils
          </p>
        </div>
        <div className="flex  justify-end ">

        </div>
      </div>
    </div>
  )
}

export default FacturesPage
