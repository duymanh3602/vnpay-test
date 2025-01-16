import { lazy, ReactElement, Suspense } from 'react'
import { Navigate, Outlet, Route } from 'react-router-dom'
import config from '../config'
import { useSelector } from 'react-redux'

const Login = lazy(() => import('../pages/auth/login.page'))

const AuthRoute = (): ReactElement => {
  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.isAuthenticated
  )

  return isAuthenticated ? <Navigate to={`/`} /> : <Outlet />
}

export default (
  <Route element={<AuthRoute />}>
    <Route
      path={config.loginPath}
      element={
        <Suspense>
          <Login />
        </Suspense>
      }
    />
  </Route>
) as ReactElement
