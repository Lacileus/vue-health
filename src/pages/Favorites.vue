<script setup>
import { db } from '../firebase/firebase.js'
import {
  collection,
  query,
  doc,
  getDoc,
  getDocs,
  documentId,
  updateDoc,
  where,
  arrayRemove
} from 'firebase/firestore'
import { ref, onMounted, inject } from 'vue'
import CardList from '@/components/CardList.vue'
const favs = ref([])

const { user } = inject('userInfo')

onMounted(async () => {
  const userRef = doc(db, 'users', user.value.uid)
  const userSnap = await getDoc(userRef)
  if (userSnap.data().favorites.length) {
    const q = query(collection(db, 'recipes'), where(documentId(), 'in', userSnap.data().favorites))
    const favoritesSnapshot = await getDocs(q)
    const fbRecipes = []
    favoritesSnapshot.forEach((doc) => {
      const recipe = doc.data()
      recipe.id = doc.id
      recipe.isFavorite = true
      fbRecipes.push(recipe)
    })
    favs.value = fbRecipes
  } else {
    favs.value = []
  }
})

const fetchFavorites = async (id) => {
  await updateDoc(doc(db, 'users', user.value.uid), {
    favorites: arrayRemove(id)
  })

  const userRef = doc(db, 'users', user.value.uid)
  const userSnap = await getDoc(userRef)
  if (userSnap.data().favorites.length) {
    const q = query(collection(db, 'recipes'), where(documentId(), 'in', userSnap.data().favorites))
    const favoritesSnapshot = await getDocs(q)
    const fbRecipes = []
    favoritesSnapshot.forEach((doc) => {
      const recipe = doc.data()
      recipe.id = doc.id
      recipe.isFavorite = true
      fbRecipes.push(recipe)
    })
    favs.value = fbRecipes
  } else {
    favs.value = []
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">Закладки</h1>
    <CardList @heart-clicked="fetchFavorites" :load="false" :items="favs" />
  </div>
</template>
