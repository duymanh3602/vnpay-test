import { ReactElement } from 'react'
import { Navigate, Outlet, Route } from 'react-router-dom'
import config from '../../config'

import privateRoute from './private.route'
import { useSelector } from 'react-redux'

const PrivateRoute = (): ReactElement => {
  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.isAuthenticated
  )

  return !isAuthenticated ? <Navigate to={config.loginPath} /> : <Outlet />
}

export default (
  <Route element={<PrivateRoute />}>{privateRoute}</Route>
) as ReactElement
