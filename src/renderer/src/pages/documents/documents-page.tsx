import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { IDocument, IFolder } from '../../type'
import { useEffect, useState } from 'react'
import { downloadDocument, getDocuments, getFolders } from '../../services/documentService'
import { setDocuments } from '../../store/documentSlice'
import { FiDownload } from 'react-icons/fi'
import LoadingTable from '../../components/LoadingTable'
import NoDataList from '../../components/NoDataList'
import moment from 'moment'
import { toast, ToastContainer } from 'react-toastify'
import { getMessageErrorRequestEx } from '../../utils/errors'
import fileDownload from 'js-file-download'
import { FaFile, FaFolder, FaTrash } from 'react-icons/fa6'
import ModalCreateFolder from './ModalCreateFolder'
import ModalUploadDocument from './ModalUploadDocument'

function DocumentsPage(): JSX.Element {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useAppDispatch = () => useDispatch<AppDispatch>()
  const dispatch = useAppDispatch()

  const token: string | null = useAppSelector((state) => state.user.token)
  const documents: IDocument[] = useAppSelector((state) => state.document.documents)
  
  const [folders, setFolders] = useState<IFolder[]>([])
  const [parent, setParent] = useState<IFolder | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
   resetFolders()
  }, [])

  const resetFolders = async (): Promise<void> => {
    loadDocuments(token)
    loadFolders()
  }

  const showSuccessToast = (msg: string): void => {
    toast.success(msg, { theme: 'colored'})
  }

  const showErrorToast = (msg: string): void => {
    toast.error(msg, { theme: 'colored'})
  }

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

  const loadFolders = async (): Promise<void> => {
    try {
      const res = await getFolders(token as string)
      setFolders(res.data)
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

  const onHandleUpFolder = async (): Promise<void> => {
    // @ts-ignore daisyUI
    document?.getElementById("modal-create-folder")?.showModal()
  }

  const onHandleUpReport = async (): Promise<void> => {
    // @ts-ignore daisyUI
    document?.getElementById("modal-load-document")?.showModal()
  }

  const onChangeDir = (e): void => {
    e.preventDefault()
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
        <div className="flex gap-3 justify-end ">
          <button onClick={() => onHandleUpFolder()} className="btn btn-md btn-outline ml-2">
            <FaFolder /> Nouveau dossier
          </button>
          <button onClick={() => onHandleUpReport()} className="btn btn-md btn-outline ml-2">
            <FaFile /> Charger un document
          </button>
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
                  {folders.map((folder) => (
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
                        className="w-4 px-4 py-2 font-medium"
                      >
                        <FaFolder size={16} />
                      </th>
                      <td
                        scope="row"
                        className="flex items-center px-4 py-2 font-bold text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <a href="#" onClick={onChangeDir}> {folder?.label.toUpperCase()}</a>
                       
                      </td>
                      <td className="px-4 py-2">
                        
                      </td>
                      <td className="px-4 py-2">{moment(folder?.created_at).format('DD MMM YYYY')}</td>
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex justify-end">
                          <button className="btn btn-sm">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                        className="w-4 px-4 py-2 font-medium"
                      >
                        <FaFile />
                      </th>
                      <td
                        scope="row"
                        className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {document?.label}
                      </td>
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

            </div>
          </div>
        </div>
      )}

      <ModalCreateFolder token={token as string} error={showErrorToast} parent={parent} success={showSuccessToast} reload={resetFolders} />
      <ModalUploadDocument token={token as string} error={showErrorToast} parent={parent} success={showSuccessToast} reload={resetFolders} />
    </div>
  )
}

export default DocumentsPage
