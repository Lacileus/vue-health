<script setup>
import { db } from '../firebase/firebase.js'
import { doc, getDoc } from 'firebase/firestore'
import { ref, onMounted, inject } from 'vue'
import CloudImage from './CloudImage.vue'
defineProps({
  card: Object
})
const { user } = inject('userInfo')
const userAllergenics = ref([])

const emit = defineEmits(['doClose'])
const localeImageUrl = ref('recipeImages/')

onMounted(async () => {
  const userRef = doc(db, 'users', user.value.uid)
  const userSnap = await getDoc(userRef)
  userAllergenics.value = userSnap.data().allergenics
})
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full z-10 bg-black opacity-70"></div>
  <div
    @click.stop="() => emit('doClose')"
    class="fixed z-20 top-0 left-0 flex h-full w-full items-center justify-center sm:p-8"
  >
    <div
      @click.stop=""
      class="relative flex flex-col items-center gap-8 bg-white w-full md:w-3/4 h-full py-8 px-8 md:px-16 rounded-l-3xl overflow-y-scroll"
    >
      <button
        @click.stop="() => emit('doClose')"
        class="absolute top-8 right-4 w-10 h-10 p-2 rounded-full bg-red-400 border-2 border-red-500 transition hover:bg-red-300 hover:border-red-400 hover:shadow-lg hover:shadow-red-300 text-white text-center"
      >
        <img src="/plus3.svg" class="origin-center rotate-45" alt="Закрыть описание" />
      </button>
      <h2 class="text-3xl font-bold">{{ card.name }}</h2>
      <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="flex flex-col justify-center w-full md:w-1/2 h-full p-4">
          <h3 class="text-xl font-bold">Энергетическая ценность на 100 грамм</h3>
          <div class="flex flex-col gap-4 my-4">
            <div class="flex">
              <span class="truncate">Калорийность</span>
              <span class="grow border-b border-slate-200"></span>
              <span>{{ card.cals }}</span>
              <span> ккал</span>
            </div>
            <div class="flex">
              <span>Белки</span>
              <span class="grow border-b border-slate-200"></span>
              <span>{{ card.proteins }} </span>
              <span> гр.</span>
            </div>
            <div class="flex">
              <span> Жиры</span>
              <span class="grow border-b border-slate-200"></span>
              <span>{{ card.fats }}</span>
              <span> гр.</span>
            </div>
            <div class="flex">
              <span>Углеводы</span>
              <span class="grow border-b border-slate-200"></span>
              <span>{{ card.carbs }}</span>
              <span>гр.</span>
            </div>
          </div>
          <h3 v-if="card.allergenics.length" class="text-xl font-bold">Аллергены:</h3>
          <div class="flex flex-wrap">
            <span
              v-for="(item, index) in card.allergenics"
              :key="index"
              :class="userAllergenics.includes(item) ? 'bg-red-200' : 'bg-slate-100'"
              class="p-2 m-2 rounded-full"
              >{{ item }}</span
            >
          </div>
        </div>
        <div
          v-if="card.load"
          class="w-3/4 md:w-1/2 aspect-square object-cover rounded-3xl overflow-hidden"
        >
          <CloudImage :path="card.imageUrl" />
        </div>
        <img
          v-else
          :src="localeImageUrl + card.imageUrl"
          alt="Картинка блюда"
          class="w-3/4 md:w-1/2 aspect-square object-cover rounded-3xl"
        />
      </div>
      <h2 v-if="card.ingredients.length" class="text-xl font-bold">Ингредиенты:</h2>
      <div class="flex w-full" v-for="(item, index) in card.ingredients" :key="index">
        {{ item.ingredient }}<span class="grow border-b border-slate-200"></span>
        {{ item.unit === 'по вкусу' ? '' : item.quantity }}{{ item.unit }}
      </div>
      <h2 v-if="card.desc" class="text-xl font-bold">Описание:</h2>
      <span class="whitespace-pre-line">{{ card.desc }} </span>
    </div>
  </div>
</template>

<style>
div::-webkit-scrollbar {
  width: 0.5rem;
  background-color: #444;
}

div::-webkit-scrollbar-thumb {
  background-color: #fb923c;
}
</style>
