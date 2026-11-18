<script setup lang="ts">
import { ref, computed } from "vue";

const productName = "Кофе";
const price = 800;

const quantity = ref(1);

const total = computed(() => {
  return price * quantity.value;
});

function addProduct() {
  quantity.value++;
}

function removeProduct() {
  if (quantity.value > 0) {
    quantity.value--;
  }
}
</script>

<template>
  <main>
    <h1>Greekassa</h1>

    <h2>{{ productName }}</h2>
    <p>Цена: {{ price }} ₸</p>

    <button @click="removeProduct">−</button>
    <span>{{ quantity }}</span>
    <button @click="addProduct">+</button>

    <h3>Итого: {{ total }} ₸</h3>
  </main>
</template>
