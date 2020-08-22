<template>
  <v-app>
    <div class="d-flex justify-center">
      <h1 id="addProduct">Add Product</h1>
          <div class="d-flex justify-center">
          <v-col cols="1" style="margin: 0px auto;">
             <h2 v-if="!isHiddenText">Product was added</h2>
            </v-col>
          </div>
    </div>
    <div class="d-flex justify-center">
      <v-col cols="6" style="margin: 0px auto;">
        <v-text-field v-model="name" label="Add name"></v-text-field>
        <v-text-field v-model="ean" label="Add EAN" type="number"></v-text-field>
        <v-text-field v-model="quantity" label="Add quantity"></v-text-field>
      </v-col>
    </div>
    <div class="d-flex justify-center">
      <v-btn @click="addProduct(); isHiddenText = false;" color="primary" style="margin: 20px;">Add Product</v-btn>
      <v-btn @click="created(); isHiddenVue = false;" color="primary" style="margin: 20px;">Display usable products</v-btn>
      <v-btn @click="isHiddenVue = !isHiddenVue;" color="primary" style="margin: 20px;">Hide usable products</v-btn>
    </div>


<div v-if="!isHiddenVue">
    <div class="d-flex justify-center">
  <h1>Usable products</h1>
</div>
<div v-for="product in usableProducts" :key="product._id">
  <v-card class="mx-auto" color="white" dark max-width="800">
    <v-card-text class="font-weight-bold title blue--text">
    {{ product.name }} ///////
    Quantity : {{ product.quantity }}
      <v-list-item id="product-list-item" class="grow">
        <v-text-field v-bind:value="product.quantity" label="Edit quantity" style="background-color: black;"></v-text-field>
        <v-btn @click="updateProduct(product._id);" class="mx-2" small
        color="green"> Update quantity </v-btn>
       <v-btn @click="deleteProduct(product._id); isDeleted = true" class="mx-2" small 
       color="red"> Delete Product</v-btn>
      </v-list-item>
    </v-card-text>
  </v-card>
</div>
</div>


    <div class="d-flex justify-center">
    <v-col cols="6" style="margin: 0px auto;">
    <h1>Search a product</h1>
    <v-text-field v-model="search" label="Search by name"></v-text-field>
    </v-col>
  </div>



          <div v-if="!isHiddenForm">
        <v-col cols="6" style="margin: 0px auto;">
        <v-text-field v-model="quantity" label="Edit quantity" style="background-color: black;"></v-text-field>
               <v-btn @click="deleteProduct(product._id)" class="mx-2" small 
       color="blue"> {{ product.quantity }} </v-btn>
        </v-col>
        </div>


  </v-app>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
  search: "",
    isHiddenText: true, 
    isHiddenForm : true,
    isHiddenVue: true,
    isDeleted: false,
    usableProducts: [],
    filteredList: [],
    name: "",
    ean: "",
    quantity: "",
  }),
  methods: {
  created() {
    axios.get("http://localhost:3000/productUsable")
    .then(response => (this.usableProducts = response.data))
    .catch(error => console.log(error));
    },

  deleteProduct(ProductID) {
  axios
  .delete("http://localhost:3000/deleteProduct/" + ProductID).then(response => {
   console.log(response.data);
   alert('Product was deleted');
   window.location.reload();
  });
},

updateProduct(ProductID) {
  axios.post("http://localhost:3000/updateProduct/" + ProductID).then(response => {
   console.log(response.data.quantity);
   alert('Product was updated');
  });
},

editProduct(ProductID) {
  axios.get("http://localhost:3000/productFindById/" + ProductID).then(response => {
   console.log(response.data);
  });

},

  addProduct() {
      axios.post("http://localhost:3000/product/add", {
        name: this.name,
        ean: this.ean,
        quantity: this.quantity
     }).then(response => {
       this.message = response.data;
       alert('Product ' + this.name + ' was added ');
      window.location.reload();

     });
  }
},
};
</script>
