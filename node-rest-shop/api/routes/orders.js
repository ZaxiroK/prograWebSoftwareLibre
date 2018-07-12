const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

//constructores
const Order = require('../models/order');
const Product = require('../models/product');
//

router.get('/', (req, res, next) => {
      Order.find()
      //selecciona lo que se le especifica
       .select('product quantity _id')
       .populate('product')//selecciona todo el objeto de fkey
       //.populate('product','name')//selecciona solo el nombre de ese fkey
       .exec()
       .then(docs => {
          res.status(200).json({
             //devolvera a detalla la informacion con mas info
            count: docs.length,
            orders: docs.map(doc => {
              return {
                _id: doc._id,
                product: doc.product,
                quantity: doc.quantity,
                request: {
                  type: 'GET',
                  url: 'http://localhost:3000/orders/' + doc._id
                }
              };
            })
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
         });
     });


     router.post("/", (req, res, next) => {
         //verifica que el id del producto exita
         //falta algo para que valide mas el id
         //ya que si no existe manda error
         console.log(req.body.productId);
          Product.findById(req.body.productId)
            .then(product => {
              if (!product) {
                return res.status(404).json({
                  message: "Product not found"
                });
              }
                //guarda la orden
              const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
              });
              return order.save();
            })
            //devulver la informacion con los datos de la orden guardada
            .then(result => {
              console.log(result);
              res.status(201).json({
                message: "Order stored",
                createdOrder: {
                  _id: result._id,
                  product: result.product,
                  quantity: result.quantity
                },
                request: {
                  type: "GET",
                  url: "http://localhost:3000/orders/" + result._id
                }
              });
            })
            //controla los errores posibles
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
             });
         });
    
      
         router.get("/:orderId", (req, res, next) => {
              Order.findById(req.params.orderId)
                .populate('product')//selecciona todo el objeto de fkey
              //.populate('product','name')//selecciona solo el nombre de ese fkey
                .exec()
                .then(order => {
                  console.log(order);
                  if (!order) {

                    return res.status(404).json({
                      message: "Order not found"
                    });
                  }
                  res.status(200).json({
                    order: order,
                    request: {
                      type: "GET",
                      url: "http://localhost:3000/orders"
                    }
                  });
                })
                .catch(err => {
                  res.status(500).json({
                    error: err
                  });
                 });
             });

             router.delete("/:orderId", (req, res, next) => {
                  Order.remove({ _id: req.params.orderId })
                    .exec()
                    .then(result => {
                      res.status(200).json({
                        message: "Order deleted",
                        request: {
                          type: "POST",
                          url: "http://localhost:3000/orders",
                          body: { productId: "ID", quantity: "Number" }
                        }
                      });
                    })
                    .catch(err => {
                      res.status(500).json({
                        error: err
                      });
                     });
                 });


module.exports = router;