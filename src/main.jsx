import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store'
import seedInitialData from './data/seedData'
import localStorageService, { STORAGE_KEYS } from './services/localStorageService'
import { hydrateUsers } from './redux/users/userSlice'
import { setCars, setWishlist } from './redux/cars/carsSlice'
import { setSuppliers } from './redux/suppliers/suppliersSlice'
import { setCustomers } from './redux/customers/customersSlice'
import { setApplications } from './redux/applications/applicationsSlice'
import { setNotifications } from './redux/notifications/notificationsSlice'

seedInitialData()
store.dispatch(hydrateUsers(localStorageService.getData(STORAGE_KEYS.USERS, [])))
store.dispatch(setCars(localStorageService.getData(STORAGE_KEYS.CARS, [])))
store.dispatch(setWishlist(localStorageService.getData(STORAGE_KEYS.WISHLIST, [])))
store.dispatch(setSuppliers(localStorageService.getData(STORAGE_KEYS.SUPPLIERS, [])))
store.dispatch(setCustomers(localStorageService.getData(STORAGE_KEYS.CUSTOMERS, [])))
store.dispatch(setApplications(localStorageService.getData(STORAGE_KEYS.APPLICATIONS, [])))
store.dispatch(setNotifications(localStorageService.getData(STORAGE_KEYS.NOTIFICATIONS, [])))
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
