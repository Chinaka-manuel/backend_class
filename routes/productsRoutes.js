import express from "express"
import { getAllProducts, addProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";
// import customMiddleware from "../utils/customMiddleware.js";



// initialize  Router using express.Router method
const Router = express.Router();


//from the router create the different routes
Router.route('/products')
.get(getAllProducts)
.post(addProducts)


Router.route("/products/:id")
.get(getProductById)
.patch(updateProduct)
.delete(deleteProduct)


export default Router;

