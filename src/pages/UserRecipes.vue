<script setup>
import { db } from '../firebase/firebase.js'
import { doc, getDoc } from 'firebase/firestore'
import CardList from '@/components/CardList.vue'
import { ref, onMounted, inject } from 'vue'

const { user } = inject('userInfo')
const ownRecipes = ref([])

const fetchRecipes = async () => {
  const userRef = doc(db, 'users', user.value.uid)
  const userSnap = await getDoc(userRef)

  const fbRecipes = []
  userSnap.data().ownRecipes.forEach((doc) => {
    fbRecipes.push(doc)
  })
  ownRecipes.value = fbRecipes
}

onMounted(async () => {
  const userRef = doc(db, 'users', user.value.uid)
  const userSnap = await getDoc(userRef)

  const fbRecipes = []
  userSnap.data().ownRecipes.forEach((doc) => {
    fbRecipes.push(doc)
  })
  ownRecipes.value = fbRecipes
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">Мои рецепты</h1>
    <CardList :items="ownRecipes" :load="true" @recipe-deleted="fetchRecipes" />
  </div>
</template>
