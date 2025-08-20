import { routeDefinitions } from '@/config/routes'
import { RouteGuard } from '@/components/RouteGuard'

/**
 * App Routes Configuration
 * Follows OCP by using configuration instead of hardcoded routes
 * Easy to extend by adding new route definitions
 */
const AppRoutes = routeDefinitions.map(route => ({
  path: route.path,
  element: (
    <RouteGuard route={route}>
      {route.element}
    </RouteGuard>
  ),
  index: route.index || false,
  // Include original route data for reference
  ...route
}))

export default AppRoutes
