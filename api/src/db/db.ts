import mongoose from "mongoose"
import dotenv from "dotenv"

/**
 * Connect to MongoDB
 * @returns {void}
 * @exports db
 * @requires mongoose
 * @requires dotenv
 */

dotenv.config()
// Define the MongoDB connection URI
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/assignment1"

// Connect to MongoDB
mongoose.connect(MONGODB_URI)

const db = mongoose.connection

db.on(
  "error",
  console.error.bind(console, "connection error:")
)
db.once("open", function () {
  console.log(
    "Connected to MongoDB at " + MONGODB_URI
  )
})

export default db
