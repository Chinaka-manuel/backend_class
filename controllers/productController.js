import fs from "fs"

// read the data in the custom database and store in a variable
let products = fs.readFileSync("./products.json", "utf-8")

// console.log(products)
// convert the data to a javscript Object
let productsArray = JSON.parse(products)

// console.log(productsArray)



// get all products
export const getAllProducts = (req,res)=>{

    // console.log(req)
    try{
        res.status(200).json({
            status: "success",
            message: "All products recieved",
            data: productsArray

        })

    }catch(error){
        res.status(500).json({
            status: "failed",
            message: `could not get products Error: ${error}`
        })

    }
}


// Add products
export const addProducts = (req,res)=>{
    // generate a seperate id for the product that is to be pushed to the custom database 
    let id = String(productsArray.length + 1);



    // create a new object that will be posted to the customized database 
    let newProduct = Object.assign({id}, req.body);  //this is used to merge two object together

    // push the new objected created to the array of object
    productsArray.push(newProduct)

    // write the updated array of object into the custom database 
    fs.writeFile("./products.json", JSON.stringify(productsArray), (err)=>{
        try{
                res.status(201).json({
                status: "success",
                message: "Produt added successfully",
                data: newProduct
            })
        }catch(err){
                res.status(400).json({
                status: "failed",
                message: `Failed to add product, Error; ${err}`
            })
        }
    })


}


// get products by ID

 export const getProductById = (req,res)=>{
    // create a variable that holds the products which have thesame id with the id in the request parameter
    console.log(req.params.id)
    let productToFind = productsArray.find(el=> el.id === req.params.id)

    // check if product exist in the custom database 
    try{
    if(!productToFind){
        return res.status(404).json({
            status: "Failed",
            message: `product with the id of ${req.params.id} not found`
        })
    }
// return a success response if product exist
    res.status(200).json({
        status: "success",
        message: `Product with the id: ${req.params.id} found`,
        data: productToFind
    })
}catch(error){
     res.status(500).json({
        status: "failed",
        message: `Internal Server Error: ${error}`
     })

}


}

// update products using the patch http method
export const updateProduct = (req, res) => {
  try {
    // find the product to update by the id
    // findindex always returns -1 if the condition is not met
    const productIndex = productsArray.findIndex((p) => p.id === req.params.id);
    // check if product with index exit exist in the custom database and return an error if it does not exist
    if (productIndex === -1) {
      return res.status(404).json({
        status: "Failed",
        message: "Product not found"
      });
    }

// add what is to be updated from the gotten index to the request body
    Object.assign(productsArray[productIndex], req.body);
    fs.writeFile("./products.json", JSON.stringify(productsArray), (err) => {
      if (err) {
        return res.status(500).json({
          status: "Failed",
          message: "Error occurred while updating product"
        });
      }
      res.status(201).json({
        status: "success",
        message: "Product updated successfully",
        data: productsArray[productIndex]
      });
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: `internal server error occurred ${error}`
    });
  }
}


// delete a product by ID
export const deleteProduct = (req, res) => {
  try {
    const productIndex = productsArray.findIndex((p) => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({
        status: "Failed",
        message: "Product not found"
      });
    }
    productsArray.splice(productIndex, 1);
    fs.writeFile("./products.json", JSON.stringify(productsArray), (err) => {
      if (err) {
        return res.status(500).json({
          status: "Failed",
          message: "Error occurred while deleting product"
        });
      }
      res.status(200).json({
        status: "success",
        message: "Product deleted successfully"
      });
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: `internal server error occurred ${error}`
    });
  }
}