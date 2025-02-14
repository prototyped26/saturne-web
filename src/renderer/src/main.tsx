import './assets/main.css'

import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router'
import LoginPage from './pages/login-page'
import DashPage from './pages/dash-page'
import DashLayout from './pages/dash-layout'
import ReportHebdo from './pages/report-hebdo'
import FundsPage from './pages/funds-page'
import IntermediariesPage from './pages/intermediaries/intermediaries-page'
import { Provider } from 'react-redux'
import { store } from './store/store'
import UsersPage from './pages/users/users-page'
import AddUserPage from './pages/users/add-user-page'
import UpdateUserPage from './pages/users/update-user-page'
import AddIntermediaryPage from './pages/intermediaries/add-intermediary-page'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dash" element={<DashLayout />} >
          <Route index element={<DashPage />} />
          <Route path="main" element={<DashPage />} />
          <Route path="reports" element={<ReportHebdo />} />
          <Route path="intermediaries" element={<IntermediariesPage />} />
          <Route path="intermediaries/new" element={<AddIntermediaryPage />} />
          <Route path="funds" element={<FundsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/new" element={<AddUserPage />} />
          <Route path="users/update" element={<UpdateUserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
  /**
   * <React.StrictMode>
    <App />
  </React.StrictMode>
   */
)
