<template>
  <v-app>
    <div class="d-flex justify-center">
      <h1 id="addProduct">Add Product</h1>
          <div class="d-flex justify-center">
             <h2 v-if="!isHiddenText">Product was added</h2>
          </div>
    </div>
    <div class="d-flex justify-center">
      <v-col cols="6" style="margin: 0px auto;">
        <v-text-field v-model="name" label="Add name"></v-text-field>
        <v-text-field v-model="ean" label="Add EAN"></v-text-field>
        <v-text-field v-model="quantity" label="Add quantity"></v-text-field>
      </v-col>
    </div>
    <div class="d-flex justify-center">
      <v-btn @click="addProduct(); isHiddenText = false;" color="primary">Add Product</v-btn>
      <v-btn @click="created(); isHiddenVue = false;" color="primary">Display usable products</v-btn>
    </div>

    <div v-if="!isHiddenVue" class="d-flex justify-center">
  <h1>Usable products</h1>
</div>
<div v-for="product in usableProducts" :key="product._id">
  <v-card class="mx-auto" color="white" dark max-width="800">
    <v-card-text class="font-weight-bold title blue--text">
    {{ product.name }} 
      <v-list-item id="product-list-item" class="grow">
        <v-btn @click="editProduct(product._id)" class="mx-2" small
        color="green"> Edit </v-btn>
       <v-btn @click="deleteProduct(product._id)" class="mx-2" small 
       color="red"> Delete </v-btn>
      </v-list-item>
    </v-card-text>
  </v-card>
</div>

  </v-app>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    isHiddenText: true, 
    isHiddenVue: true,
    usableProducts: [],
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
  addProduct() {
      axios.post("http://localhost:3000/product/add", {
        name: this.name,
        ean: this.ean,
        quantity: this.quantity
     }).then(response => {
       this.message = response.data;
     });
  }
},
};
</script>
