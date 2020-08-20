const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
let productModel = require('./product')


app.listen(3000, () => {
 console.log("Server started on port 3000")
})

app.use(bodyParser.urlencoded({ extended: false }));
 
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/todoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('open', () => {
    console.log('Connected to mongoDB');
});
db.on('error', (error) => {
    console.log(error)
})

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Maia." });
  });



//route to add a product
app.post('/product/add', (req, res) => {
    let newProduct = new productModel;
    newProduct.name = req.body.name;
    newProduct.ean = req.body.ean;
    newProduct.quantity = req.body.quantity;
    newProduct.save((err) => {
      if(err){
        res.send("Error while adding product");
      }else{
        res.send("product added");
      }
  })
})

//route to get the products that are being used
app.get("/productUsable", function(req, res) {
    const quantity = req.params.quantity;
    productModel.find().where('quantity').gt(0)
    .then(data => {
        if (!data)
          res.status(404).send({ message: "No products are used" });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error 500"});
      });
    });





//route to retrieve a product by its name
app.get("/productFind/:name", function(req, res) {
    productModel.find({ name: req.params.name })
        .then(data => {
            if (!data)
              res.status(404).send({ message: "No products by that name were found" });
            else res.send(data);
          })
          .catch(err => {
            res
              .status(500)
              .send({ message: "Error 500"});
          });
        });


//route that retrieves all the products that exist
app.get("/product/all", function(req, res) {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  
    productModel.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving the products."
        });
      });

});

//route to delete a product by its id
app.delete('/deleteProduct/:id', (req, res) => {
    let query = { _id: req.params.id }
    productModel.deleteOne(query, (err) => {
      if(err){
        res.send("Error while deleting product")
      }else{
        res.send("product deleted")
      }
    })
  });


app.delete('/deleteAllProducts', (req, res) => {  
    productModel.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Products were deleted`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all products."
        });
      });
  });