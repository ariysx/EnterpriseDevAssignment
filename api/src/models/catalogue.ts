import mongoose from "mongoose"

/**
 * Catalogue schema
 * defines the structure of the catalogue
 * @param {Object} CatalogueSchema - Catalogue schema
 * @param {Object} CatalogueModel - Catalogue model
 *
 * @param {Number} sku - Stock Keeping Unit
 * @param {String} name - Name of the product
 * @param {String} type - Type of the product
 * @param {Number} price - Price of the product
 * @param {String} upc - Universal Product Code
 * @param {Array} category - Category of the product
 * @param {Number} shipping - Shipping cost
 * @param {String} description - Description of the product
 * @param {String} manufacturer - Manufacturer of the product
 * @param {String} model - Model of the product
 * @param {String} url - URL of the product
 * @param {String} image - Image of the product
 * @returns {Object} Catalogue schema
 * @exports CatalogueModel
 * @requires mongoose
 */

const CatalogueSchema = new mongoose.Schema({
  sku: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  upc: {
    type: String,
    required: true,
  },
  category: {
    type: [
      {
        id: String,
        name: String,
      },
    ],
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
})

const CatalogueModel = mongoose.model(
  "Catalogue",
  CatalogueSchema
)

export default CatalogueModel
