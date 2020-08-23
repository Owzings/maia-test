const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
let productModel = require('./server/product')
const ProductData = { name: 'Brocolis', ean: '1234145234', quantity: 20};

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');

    const mockUser = {_id: 'some-user-id', name: 'John'};
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({_id: 'some-user-id'});
    expect(insertedUser).toEqual(mockUser);
  });


  it('create product without required field should failed', async () => {
    const productWithoutRequiredField = new productModel({ name: 'TekLoon' });
    let err;
    try {
        const savedProductWithoutRequiredField = await productWithoutRequiredField.save();
        error = savedProductWithoutRequiredField;
    } catch (error) {
        err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(err.errors.ean).toBeDefined();
});

it('insert product successfully, but the field does not defined in schema should be undefined', async () => {
    const productWithInvalidField = new productModel({ name: 'Brocolis', ean: '98361837', quantity: 10 });
    let err; 
    try {
        const savedProductWithInvalidField = await productWithInvalidField.save();
        error = savedProductWithInvalidField;
    } catch (error) {
        err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(savedProductWithInvalidField.name).resolves.toBeDefined();
    expect(savedProductWithInvalidField.nickkname).resolves.toBeUndefined();
});

//   it('create & save user successfully', async () => {
//     const ProductData = { name: 'Brocolis', ean: '1234145234', quantity: 20};
//     const validProduct = new productModel(ProductData);
//     const savedProduct = await validProduct.save();
//     // await productModel.insertOne(ProductData);
//     // const savedProduct = await productModel.findOne({_id: 'some-user-id'})
//     // Object Id should be defined when successfully saved to MongoDB.
//     expect(savedProduct._id).toBeDefined();
//     // expect(savedProduct.name).toBe(ProductData.name);
//     // expect(savedProduct.name).toEqual(ProductData.name);
//     // expect(savedProduct.ean).toBe(ProductData.ean);
//     // expect(savedProduct.quantity).toBe(ProductData.quantity);
// });

});