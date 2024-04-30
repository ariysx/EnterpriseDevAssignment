import { Request, Response } from "express"
import db from "../db/db"
import CatalogueModel from "../models/catalogue"
import { ObjectId } from "mongodb"

/**
 * Default page number
 * @constant
 * @type {number}
 * @default
 * @private
 */
const DEFAULT_PAGE = 1

/**
 * Default limit for pagination
 * @constant
 * @type {number}
 * @default
 * @private
 */
const DEFAULT_LIMIT = 48

/**
 * Check if SKU exists
 * @param sku
 * @returns {boolean}
 */
const doesSkuExists = async (sku: number) => {
  const result = await db
    .collection("catalogues")
    .findOne({ sku })
    .then((data) => {
      return data
    })

  return result ? true : false
}

/**
 * Throw SKU exists error
 * @param res - Response object
 */
const throwSkuExistsError = (res: Response) => {
  res.status(400).send({
    error: "SKU already exists",
  })
}

/**
 * Get catalogue item by ID
 * @param req - Request object
 * @returns {Object} Catalogue item
 */

const getCatalogue = async ({
  req,
}: {
  req: Request
}) => {
  // "/catalogue/:id",
  // get catalogue item by id
  const { id } = req.params
  const catalogueItem = await db
    .collection("catalogues")
    .findOne({ sku: parseInt(id) })
    .then((data) => {
      return data
    })

  return catalogueItem
}

const searchCatalogue = async ({
  req,
}: {
  req: Request
}) => {
  const {
    search,
    page,
    limit,
    category,
    type,
    manufacturer,
    minPrice,
    maxPrice,
  } = req.query

  const parsedPage =
    parseInt(page as string) || DEFAULT_PAGE
  const parsedLimit =
    parseInt(limit as string) || DEFAULT_LIMIT

  const offset = (parsedPage - 1) * parsedLimit

  // Initialize filter as an empty object
  let filter: any = {}

  // Constructing the filter for the MongoDB query
  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search as string,
          $options: "i",
        },
      },
      {
        model: {
          $regex: search as string,
          $options: "i",
        },
      },
      {
        sku: {
          $regex: search as string,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search as string,
          $options: "i",
        },
      },
    ]
  }

  if (typeof category === "string") {
    const categories = category.split(",")
    // Filter by category names
    filter.category = {
      $elemMatch: { name: { $in: categories } },
    }
  }

  if (typeof type === "string") {
    const types = type.split(",")
    filter.type = { $in: types }
  }

  if (typeof manufacturer === "string") {
    const manufacturers = manufacturer.split(",")
    filter.manufacturer = { $in: manufacturers }
  }

  if (minPrice) {
    filter.price = {
      ...(filter.price || {}),
      $gte: parseInt(minPrice as string),
    }
  }

  if (maxPrice) {
    filter.price = {
      ...(filter.price || {}),
      $lte: parseInt(maxPrice as string),
    }
  }

  // Fetching catalogue items with applied filters
  const catalogueItems = await db
    .collection("catalogues")
    .find(filter, { projection: { _id: 0 } })
    .skip(offset)
    .limit(parsedLimit)
    .toArray()

  // Counting total items for pagination
  const totalItems = await db
    .collection("catalogues")
    .countDocuments(filter)

  const maxPage = Math.ceil(
    totalItems / parsedLimit
  )

  return {
    catalogueItems,
    maxPage,
  }
}

/**
 * Get catalogue items
 * @param req - Request object
 * @returns {Object} Catalogue items
 */

const getCatalogues = async ({
  req,
}: {
  req: Request
}) => {
  // with pagination
  const { page, limit } = req.query
  // parse page and limit
  const parsedPage =
    parseInt(page as string) || DEFAULT_PAGE
  const parsedLimit =
    parseInt(limit as string) || DEFAULT_LIMIT
  // calculate offset
  const offset = (parsedPage - 1) * parsedLimit
  // get catalogue items
  const catalogueItems = await db
    .collection("catalogues")
    .find(
      {},
      {
        projection: { _id: 0 },
      }
    )
    .skip(offset)
    .limit(parsedLimit)
    .toArray()

  const totalItems = await db
    .collection("catalogues")
    .countDocuments()

  const maxPage = Math.ceil(
    totalItems / parsedLimit
  )

  return {
    catalogueItems,
    maxPage,
  }
}

/**
 * Create catalogue item
 * @param req - Request object
 * @param res - Response object
 * @returns {Object} Created catalogue item
 */

const createCatalogue = async ({
  req,
  res,
}: {
  req: Request
  res: Response
}) => {
  const { body } = req
  const newCatalogueItem = new CatalogueModel(
    body
  )
  const validationError =
    newCatalogueItem.validateSync()

  if (validationError) {
    res.status(400).send({
      error: validationError.message,
    })
    return
  }

  // check if sku exists
  if (await doesSkuExists(body.sku)) {
    throwSkuExistsError(res)
    return
  }

  // create catalogue item
  const result = await db
    .collection("catalogues")
    .insertOne(body as typeof CatalogueModel)

  if (!result.insertedId) {
    res.status(500).send({
      error: "Failed to create catalogue item",
    })
    return
  }

  // get created catalogue item
  const createdCatalogueItem = await db
    .collection("catalogues")
    .findOne(
      { _id: result.insertedId },
      {
        projection: { _id: 0 },
      }
    )
    .then((data) => {
      return data
    })

  return createdCatalogueItem
}

/**
 * Update catalogue item
 * @param req - Request object
 * @param res - Response object
 * @returns {Object} Updated catalogue item
 */

const updateCatalogue = async ({
  req,
  res,
}: {
  req: Request
  res: Response
}) => {
  try {
    const { uuid } = req.params
    const { body } = req

    // Convert the uuid parameter into an ObjectId
    const catalogueItemId = new ObjectId(uuid)

    const newCatalogueItem = new CatalogueModel(
      body
    )
    const validationError =
      newCatalogueItem.validateSync()

    if (validationError) {
      res.status(400).send({
        error: validationError.message,
      })
      return
    }

    const originalCatalogueItem = await db
      .collection("catalogues")
      .findOne({ _id: catalogueItemId })

    if (!originalCatalogueItem) {
      return {
        error: "Catalogue item not found",
      }
    }

    if (originalCatalogueItem.sku !== body.sku) {
      // check if sku exists
      if (await doesSkuExists(body.sku)) {
        throwSkuExistsError(res)
        return
      }
    }

    // Exclude the `_id` field from the update operation
    delete body._id

    // update catalogue item
    const result = await db
      .collection("catalogues")
      .updateOne(
        {
          _id: catalogueItemId,
        },
        { $set: body }
      )

    return result
  } catch (error) {
    console.error(
      "Error updating catalogue item:",
      error
    )
    throw error
  }
}

/**
 * Delete catalogue item
 * @param req - Request object
 * @returns {Object} Result of the delete operation
 */

const deleteCatalogue = async ({
  req,
}: {
  req: Request
}) => {
  // "/catalogue/:id",
  // delete catalogue item
  const { id } = req.params
  const result = await db
    .collection("catalogues")
    .deleteOne({ sku: parseInt(id) })
    .then((data) => {
      return data
    })

  return result
}

/**
 * Get available filters for catalogue
 * @returns {Object} Available filters
 */

const getAvailableFilters = async () => {
  const categories = await db
    .collection("catalogues")
    .distinct("category")
  const types = await db
    .collection("catalogues")
    .distinct("type")
  const manufacturers = await db
    .collection("catalogues")
    .distinct("manufacturer")

  // remove null values
  const categoriesFiltered = categories.filter(
    (category) =>
      category.name !== null ||
      category.name !== ""
  )
  const typesFiltered = types.filter(
    (type) => type !== null || type !== ""
  )
  const manufacturersFiltered =
    manufacturers.filter(
      (manufacturer) =>
        manufacturer !== null ||
        manufacturer !== ""
    )

  return {
    categories: categoriesFiltered,
    types: typesFiltered,
    manufacturers: manufacturersFiltered,
  }
}

/**
 * Filter catalogue items
 * @param req - Request object
 * @param res - Response object
 * @returns {Object} Filtered catalogue items
 */

const filterCatalogue = async ({
  req,
  res,
}: {
  req: Request
  res: Response
}) => {
  const {
    q,
    page,
    limit,
    category,
    type,
    manufacturer,
  } = req.query
  const parsedPage = parseInt(page as string) || 1
  const parsedLimit =
    parseInt(limit as string) || 48
  const offset = (parsedPage - 1) * parsedLimit

  const query: any = {}

  if (category !== undefined) {
    const categories = Array.isArray(category)
      ? category
      : [category]
    query["category"] = { $in: categories }
  }

  if (type !== undefined) {
    const types = Array.isArray(type)
      ? type
      : [type]
    query["type"] = { $in: types }
  }

  if (manufacturer !== undefined) {
    const manufacturers = Array.isArray(
      manufacturer
    )
      ? manufacturer
      : [manufacturer]
    query["manufacturer"] = { $in: manufacturers }
  }

  // Check if any conditions are present to add $and operator
  const finalQuery =
    Object.keys(query).length > 0
      ? { $and: [query] }
      : query

  const catalogueItems = await db
    .collection("catalogues")
    .find(finalQuery, { projection: { _id: 0 } })
    .skip(offset)
    .limit(parsedLimit)
    .toArray()

  const totalItems = await db
    .collection("catalogues")
    .countDocuments(finalQuery)

  const maxPage = Math.ceil(
    totalItems / parsedLimit
  )

  return {
    catalogueItems,
    maxPage,
  }
}

/**
 * Export catalogue items
 * @param req - Request object
 * @param res - Response object
 */

const exportCatalogues = async ({
  req,
  res,
}: {
  req: Request
  res: Response
}) => {
  const { body } = req
  const { skus } = body

  const catalogueItems = await db
    .collection("catalogues")
    .find(
      {
        sku: { $in: skus },
      },
      { projection: { _id: 0 } }
    )
    .toArray()

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=catalogues.json"
  )
  res.setHeader(
    "Content-Type",
    "application/json"
  )
  res.send(catalogueItems)
}

export {
  getCatalogue,
  getCatalogues,
  searchCatalogue,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
  exportCatalogues,
  getAvailableFilters,
  filterCatalogue,
}
