import './assets/main.css'

import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter, Route, Routes } from 'react-router'
import LoginPage from './pages/login-page'
import DashPage from './pages/dash-page'
import DashLayout from './pages/dash-layout'
import ReportHebdo from './pages/opc/report-hebdo'
import FundsPage from './pages/funds/funds-page'
import IntermediariesPage from './pages/intermediaries/intermediaries-page'
import { Provider } from 'react-redux'
import { store } from './store/store'
import UsersPage from './pages/users/users-page'
import AddUserPage from './pages/users/add-user-page'
import UpdateUserPage from './pages/users/update-user-page'
import AddIntermediaryPage from './pages/intermediaries/add-intermediary-page'
import EditIntermediaryPage from './pages/intermediaries/edit-intermediary-page'
import DetailSgoPage from './pages/intermediaries/detail-sgo-page'
import AddFundPage from './pages/funds/add-fund-page'
import EditFundPage from './pages/funds/edit-fund-page'
import YearsPage from './pages/system/years-page'
import AddYearPage from './pages/system/add-year-page'
import UpdateYearPage from './pages/system/update-year-page'
import DetailOpcPage from './pages/opc/detail-opc-page'
import DetailFundPage from './pages/funds/detail-fund-page'
import MandatesPage from './pages/mandates/mandates-page'
import DetailMandatePage from './pages/mandates/detail-mandate-page'
import DocumentsPage from './pages/documents/documents-page'
import QueriesPage from './pages/requetes/queries-page'
import ConfigPage from './pages/configurations/config-page'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dash" element={<DashLayout />} >
          <Route index element={<DashPage />} />
          <Route path="main" element={<DashPage />} />
          <Route path="reports" element={<ReportHebdo />} />
          <Route path="reports/details" element={<DetailOpcPage />} />
          <Route path="mandates" element={<MandatesPage />} />
          <Route path="mandates/details" element={<DetailMandatePage />} />
          <Route path="intermediaries" element={<IntermediariesPage />} />
          <Route path="intermediaries/new" element={<AddIntermediaryPage />} />
          <Route path="intermediaries/update" element={<EditIntermediaryPage />} />
          <Route path="intermediaries/sgo" element={<DetailSgoPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="queries" element={<QueriesPage />} />
          <Route path="funds" element={<FundsPage />} />
          <Route path="funds/new" element={<AddFundPage />} />
          <Route path="funds/update" element={<EditFundPage />} />
          <Route path="funds/details" element={<DetailFundPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/new" element={<AddUserPage />} />
          <Route path="users/update" element={<UpdateUserPage />} />
          <Route path="system/years" element={<YearsPage />} />
          <Route path="system/years/new" element={<AddYearPage />} />
          <Route path="system/years/edit" element={<UpdateYearPage />} />
          <Route path="configurations" element={<ConfigPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </Provider>
  /**
   * <React.StrictMode>
    <App />
  </React.StrictMode>
   */
)
