<template>
  <v-app>
    <div class="d-flex justify-center">
      <h1 id="addProduct">Add Product</h1>
    </div>
    <div class="d-flex justify-center">
      <v-col cols="6" style="margin: 0px auto;">
        <v-text-field v-model="name" label="Add name"></v-text-field>
        <v-text-field v-model="ean" label="Add EAN"></v-text-field>
        <v-text-field v-model="quantity" label="Add quantity"></v-text-field>
      </v-col>
    </div>
    <div class="d-flex justify-center">
      <v-btn @click="addProduct()" color="primary">Add Product</v-btn>
    </div>
  </v-app>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    name: "",
    ean: "",
    quantity: "",
  }),
  methods: {
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
