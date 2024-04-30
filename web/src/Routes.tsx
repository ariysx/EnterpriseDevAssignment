import { createBrowserRouter } from "react-router-dom"
import { HomePage } from "./pages/HomePage/HomePage"
import { ErrorPage } from "./pages/ErrorPage/ErrorPage"
import { NavLayout } from "./layouts/NavLayout/NavLayout"
import { CatalogueItemPage } from "./pages/CatalogueItemPage/CatalogueItemPage"
import { AboutPage } from "./pages/AboutPage/AboutPage"

/**
 * Router configuration
 * This configuration is used to define the routes of the application
 */
export const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <NavLayout>
        <ErrorPage />
      </NavLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <NavLayout>
        <HomePage />
      </NavLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/about",
    element: (
      <NavLayout>
        <AboutPage />
      </NavLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "catalogue/",
    children: [
      {
        path: ":id",
        element: (
          <NavLayout>
            <CatalogueItemPage mode="view" />
          </NavLayout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: ":id/edit",
        element: (
          <NavLayout>
            <CatalogueItemPage mode="edit" />
          </NavLayout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "create",
        element: (
          <NavLayout>
            <CatalogueItemPage mode="create" />
          </NavLayout>
        ),
        errorElement: <ErrorPage />,
      },
    ],
  },
])
