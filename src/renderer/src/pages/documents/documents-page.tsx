import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IDocument } from '../../type'
import { useEffect, useState } from 'react'
import { downloadDocument, getDocuments } from '../../services/documentService'
import { setDocuments } from '../../store/documentSlice'
import { FiDownload } from 'react-icons/fi'
import LoadingTable from '../../components/LoadingTable'
import NoDataList from '../../components/NoDataList'
import moment from 'moment'
import { toast, ToastContainer } from 'react-toastify'
import { getMessageErrorRequestEx } from '../../utils/errors'
import fileDownload from 'js-file-download'

function DocumentsPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const documents: IDocument[] = useAppSelector((state) => state.document.documents)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocuments(token)
  }, [])

  const loadDocuments = async (t: string | null): Promise<void> => {
    try {
      const res = await getDocuments(t as string)
      dispatch(setDocuments(res.data as IDocument[]))
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const onHandleDown = async (doc: IDocument): Promise<void> => {
    try {
      const res = await downloadDocument(doc)
      fileDownload(res.data, doc?.label as string)
    } catch (e) {
      toast.error(getMessageErrorRequestEx(e), { theme: 'colored' })
    }
  }

  return (
    <div className="border bg-white rounded-lg dark:border-gray-50 h-full p-6 mb-4 z-20">
      <ToastContainer />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="">
          <h3 className="tracking-tight font-bold text-3xl text-app-title">
            Documents
          </h3>
          <p className="tracking-tight font-light text-1xl text-app-sub-title">
            Liste des documents
          </p>
        </div>
        <div className="flex  justify-end ">

        </div>
      </div>

      {loading && <LoadingTable />}

      {!loading && documents.length === 0 && <NoDataList />}

      {!loading && documents.length > 0 && (
        <div className="grid">
          <div className="max-w-screen-2xl ">
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
              <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                <div className="flex items-center flex-1 space-x-4">
                  <h5>
                    <span className="text-gray-500">Il y a :</span>
                    <span className="dark:text-white">
                      {' '}
                      {documents.length + ' document' + (documents.length > 1 ? 's' : '')}{' '}
                    </span>
                  </h5>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-10">
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
                      Document
                    </th>
                    <th scope="col" className="px-4 py-3">
                      type
                    </th>
                    <th scope="col" className="px-4 py-3">
                      ajouté le
                    </th>
                    <th scope="col" className="px-4 py-3"></th>
                  </tr>
                  </thead>
                  <tbody>
                  {documents.map((document) => (
                    <tr
                      key={document.id}
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
                        className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {document?.label}
                      </th>
                      <td className="px-4 py-2">
                          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                            {document?.type}
                          </span>
                      </td>
                      <td className="px-4 py-2">{moment(document?.created_at).format('DD MMM YYYY')}</td>
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex justify-end">
                          <button onClick={() => onHandleDown(document)} className="btn btn-sm">
                            <FiDownload />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              <nav
                className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
                aria-label="Table navigation"
              >
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Affichage
                  <span className="font-semibold text-gray-900 dark:text-white">1 - 10</span>
                  sur
                  <span className="font-semibold text-gray-900 dark:text-white">1000</span>
                </span>
                <ul className="inline-flex items-stretch -space-x-px">
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      1
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      2
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      aria-current="page"
                      className="z-10 flex items-center justify-center px-3 py-2 text-sm leading-tight border text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    >
                      3
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      ...
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      100
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default DocumentsPage
