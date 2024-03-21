<script setup>
import { db } from '../firebase/firebase.js'
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayRemove,
  arrayUnion,
  collection,
  query,
  where
} from 'firebase/firestore'
import debounce from 'lodash.debounce'
import { reactive, inject, watch, ref, onMounted } from 'vue'
import CardList from '../components/CardList.vue'

const recipes = ref([])
const { user } = inject('userInfo')
const filters = reactive({
  searchQuery: '',
  category: ''
})

const onChangeCategorySelect = (event) => (filters.category = event.target.value)

const onChangeSearchInput = debounce(
  (event) =>
    (filters.searchQuery = event.target.value
      ? event.target.value[0].toUpperCase() + event.target.value.slice(1)
      : ''),
  500
)

const fetchItems = async () => {
  const q = query(
    ...[
      collection(db, 'recipes'),
      filters.searchQuery && where('name', '>=', filters.searchQuery),
      filters.searchQuery && where('name', '<=', filters.searchQuery + '\uf8ff'),
      filters.category && where('category', '==', filters.category)
    ].filter((item) => item)
  )

  const userRef = doc(db, 'users', user.value.uid)
  const userSnap = await getDoc(userRef)
  const recipesSnapshot = await getDocs(q)
  const fbRecipes = []
  recipesSnapshot.forEach((doc) => {
    const recipe = doc.data()
    recipe.id = doc.id
    recipe.isFavorite = userSnap.data().favorites.includes(doc.id)
    fbRecipes.push(recipe)
  })
  recipes.value = fbRecipes
}

const handleHeartClick = async (id, isFav) => {
  if (isFav) {
    await updateDoc(doc(db, 'users', user.value.uid), {
      favorites: arrayRemove(id)
    })
    recipes.value.find((recipe) => recipe.id === id).isFavorite = false
  } else {
    await updateDoc(doc(db, 'users', user.value.uid), {
      favorites: arrayUnion(id)
    })
    recipes.value.find((recipe) => recipe.id === id).isFavorite = true
  }
}

onMounted(async () => {
  const userRef = doc(db, 'users', user.value.uid)
  const userSnap = await getDoc(userRef)
  const q = query(collection(db, 'recipes'))
  const recipesSnapshot = await getDocs(q)
  const fbRecipes = []
  recipesSnapshot.forEach((doc) => {
    const recipe = doc.data()
    recipe.id = doc.id
    recipe.isFavorite = userSnap.data().favorites.includes(doc.id)
    fbRecipes.push(recipe)
  })
  recipes.value = fbRecipes
})

watch(filters, fetchItems)
</script>

<template>
  <div>
    <div class="flex flex-col lg:flex-row justify-between items-center mb-8">
      <h1 class="lg:w-1/3 text-3xl font-bold mb-4 lg:mb-0">Все рецепты</h1>
      <!-- {{ filters }}. -->
      <div class="flex flex-col w-full sm:flex-row-reverse gap-4">
        <select
          @change="onChangeCategorySelect"
          class="w-full sm:w-1/2 md:w-1/3 border rounded-md outline-none py-2 px-3"
        >
          <option value="">Все категории</option>
          <option value="Завтраки">🍎 Завтраки</option>
          <option value="Десерты">🧁 Десерты</option>
          <option value="Напитки">🥤 Напитки</option>
          <option value="Выпечка">🥧 Выпечка</option>
          <option value="Закуски">🍢 Закуски</option>
          <option value="Сэндвичи">🥪 Сэндвичи</option>
          <option value="Основные блюда">🧆 Основные блюда</option>
          <option value="Супы">🥣 Супы</option>
          <option value="Салаты">🥗 Салаты</option>
          <option value="Пицца">🍕 Пицца</option>
          <option value="Заготовки">🥫 Заготовки</option>
        </select>
        <div class="relative flex w-full sm:w-1/2 md:w-1/3">
          <img class="absolute left-4 top-3" src="/search.svg" alt="" />
          <input
            @input="onChangeSearchInput"
            class="w-full border outline-none focus:border-gray-400 rounded-md pl-12 py-2 pr-4"
            placeholder="Найти..."
            type="text"
          />
        </div>
      </div>
    </div>
    <CardList @heart-clicked="handleHeartClick" :load="false" :items="recipes" />
  </div>
</template>
