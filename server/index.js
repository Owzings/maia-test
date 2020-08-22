const express = require('express');
const app = express();
var cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
let productModel = require('./product')


app.use(cors())

app.listen(3000, () => {
 console.log("Server started on port 3000")
})

app.use(bodyParser.urlencoded({ extended: false }));
 
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/todoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
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

// app.post("/updateProduct/:id", function(req, res ) {
//     productModel.findByIdAndUpdate(req.params.id, {
//           $set: req.body
//         }, (error, data) => {
//           if (error) {
//             return next(error);
//           } else {
//             res.send(data.quantity);
//             console.log(data.quantity);
//           }
//         });
//       });

app.post("/updateProduct/:id", function(req, res ) {
        productModel.findOneAndUpdate({ _id: req.params.id }, {
              quantity: req.body.quantity
            }, (error, data) => {
              if (error) {
                return next(error);
              } else {
                res.send(data);
                console.log(data.quantity);
              }
            });
          });
     
app.get("/productFindById/:id", function(req, res) {
        productModel.findById({ _id: req.params.id })
            .then(data => {
                if (!data) {
                  res.status(404).send({ message: "No products by that id were found" });

                } else  {
                    res.send(data);
                    // res.json(data);
                }
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