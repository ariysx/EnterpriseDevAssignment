import express, {
  Express,
  Request,
  Response,
} from "express"
import dotenv from "dotenv"
import {
  createCatalogue,
  deleteCatalogue,
  exportCatalogues,
  filterCatalogue,
  getAvailableFilters,
  getCatalogue,
  getCatalogues,
  searchCatalogue,
  updateCatalogue,
} from "./services/catalogue"
import cors from "cors"

dotenv.config()

/**
 * Express server
 */
const app: Express = express()
const port = process.env.PORT || 3001

/**
 * Middleware
 */
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * Routes
 */
app.get("/", (req: Request, res: Response) => {
  res.send("catalogue API is running!")
})

/**
 * Catalogue routes
 */
app.get(
  "/catalogue",
  (req: Request, res: Response) => {
    getCatalogues({ req }).then((data) => {
      res.send(data)
    })
  }
)

/**
 * Catalogue search route
 */
app.get(
  "/catalogue/search",
  (req: Request, res: Response) => {
    searchCatalogue({ req }).then((data) => {
      res.send(data)
    })
  }
)

/**
 * Catalogue filter route
 */
app.get(
  "/catalogue/filter",
  (req: Request, res: Response) => {
    filterCatalogue({ req, res }).then((data) => {
      res.send(data)
    })
  }
)

/**
 * Catalogue available filters route
 */
app.get(
  "/catalogue/available-filters",
  (req: Request, res: Response) => {
    getAvailableFilters().then((data) => {
      res.send(data)
    })
  }
)

/**
 * Catalogue CREATE routes
 */
app.post(
  "/catalogue",
  (req: Request, res: Response) => {
    createCatalogue({ req, res }).then((data) => {
      res.send(data)
    })
  }
)

/**
 * Catalogue get route
 */
app.get(
  "/catalogue/:id",
  (req: Request, res: Response) => {
    getCatalogue({ req }).then((data) => {
      res.send(data)
    })
  }
)

/**
 * Catalogue update route
 */
app.put(
  "/catalogue/:uuid",
  (req: Request, res: Response) => {
    updateCatalogue({ req, res }).then((data) => {
      res.send(data)
    })
  }
)

/**
 * Catalogue delete route
 */
app.delete(
  "/catalogue/:id",
  (req: Request, res: Response) => {
    deleteCatalogue({ req }).then((data) => {
      res.send(data)
    })
  }
)

/**
 * Catalogue bulk export route
 */
app.post(
  "/catalogue/bulk/export",
  (req: Request, res: Response) => {
    exportCatalogues({ req, res })
  }
)

/**
 * Start server
 */
app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port}`
  )
})
