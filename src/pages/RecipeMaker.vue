<script setup>
import { v4 as uuidV4 } from 'uuid'
import { ref, reactive, inject } from 'vue'
import { storage, db } from '../firebase/firebase.js'
import { ref as firebaseRef, uploadBytes } from 'firebase/storage'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'

import CloudImage from '../components/CloudImage.vue'
const newRecipe = reactive({
  name: '',
  category: 'Без категории',
  picUrl: '',
  cals: null,
  proteins: null,
  carbs: null,
  fats: null,
  desc: '',
  allergenics: [],
  ingredients: []
})

const { user } = inject('userInfo')
const ingredient = ref('')
const quantity = ref(0)
const unit = ref('гр.')
const userCat = ref('')

const selectedFile = ref('')
const myfile = ref(null)
const addIngredient = () => {
  newRecipe.ingredients.push({
    ingredient: ingredient.value,
    quantity: quantity.value,
    unit: unit.value
  })
  ingredient.value = ''
  quantity.value = 0
  unit.value = 'гр.'
}

const removeIngredient = () => {
  newRecipe.ingredients.pop()
}

const uploadPic = () => {
  selectedFile.value = ''
  newRecipe.picUrl = uuidV4() + '.png'
  const storageRef = firebaseRef(storage, newRecipe.picUrl)
  uploadBytes(storageRef, myfile.value.files[0]).then((snapshot) => console.dir(snapshot))
}

const uploadRecipe = async () => {
  newRecipe.category === 'Свой вариант' && (newRecipe.category = userCat.value)

  await updateDoc(doc(db, 'users', user.value.uid), {
    ownRecipes: arrayUnion(newRecipe)
  })

  newRecipe.name = ''
  newRecipe.category = 'Без категории'
  newRecipe.picUrl = ''
  newRecipe.cals = null
  newRecipe.proteins = null
  newRecipe.carbs = null
  newRecipe.fats = null
  newRecipe.desc = ''
  newRecipe.allergenics = []
  newRecipe.ingredients = []
  ingredient.value = ''
  quantity.value = 0
  unit.value = 'гр.'
  userCat.value = ''
}
</script>

<template>
  <div class="w-full sm:w-3/4 mx-auto flex flex-col gap-4">
    <h1 class="text-3xl font-bold mb-4">Добавить рецепт</h1>
    <input
      class="p-4 rounded-xl bg-slate-50 transition hover:bg-slate-100 border-2 outline-none"
      v-model="newRecipe.name"
      type="text"
      placeholder="Название"
    />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <select
        class="p-4 rounded-xl bg-slate-50 transition hover:bg-slate-100 border-2 outline-none"
        v-model="newRecipe.category"
      >
        <option value="Без категории">🚫 Без категории</option>
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
        <option value="Свой вариант">✨ Свой вариант</option>
      </select>

      <input
        v-if="newRecipe.category === 'Свой вариант'"
        v-model="userCat"
        class="p-4 rounded-xl bg-slate-50 transition hover:bg-slate-100 border-2 outline-none"
        type="text"
        placeholder="Название категории"
      />
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <input
        v-model.number="newRecipe.cals"
        @input="
          () => {
            if (newRecipe.cals < 0) {
              newRecipe.cals = 0
            }
            if (newRecipe.cals > 900) {
              newRecipe.cals = 900
            }
          }
        "
        class="p-4 rounded-xl bg-slate-50 transition hover:bg-slate-100 border-2"
        type="number"
        placeholder="🔥 Ккал на 100г"
      />
      <input
        v-model.number="newRecipe.proteins"
        @input="
          () => {
            if (newRecipe.proteins < 0) {
              newRecipe.proteins = 0
            }
            if (newRecipe.proteins > 100) {
              newRecipe.proteins = 100
            }
          }
        "
        class="p-4 rounded-xl bg-slate-50 transition hover:bg-slate-100 border-2"
        type="number"
        placeholder="🥩 Белки на 100г"
      />
      <input
        v-model.number="newRecipe.carbs"
        @input="
          () => {
            if (newRecipe.carbs < 0) {
              newRecipe.carbs = 0
            }
            if (newRecipe.carbs > 100) {
              newRecipe.carbs = 100
            }
          }
        "
        class="p-4 rounded-xl bg-slate-50 transition hover:bg-slate-100 border-2"
        type="number"
        placeholder="🍞 Углеводы на 100г"
      />
      <input
        v-model.number="newRecipe.fats"
        @input="
          () => {
            if (newRecipe.fats < 0) {
              newRecipe.fats = 0
            }
            if (newRecipe.fats > 100) {
              newRecipe.fats = 100
            }
          }
        "
        class="p-4 rounded-xl bg-slate-50 transition hover:bg-slate-100 border-2"
        type="number"
        placeholder="🥑 Жиры на 100г"
      />
    </div>

    <textarea
      v-model="newRecipe.desc"
      class="p-4 rounded-xl bg-slate-50 transition hover:bg-slate-100 border-2"
      placeholder="Описание"
    ></textarea>
    <div class="flex flex-col">
      <span class="text-lg font-bold"> Аллергены: </span>
      <div class="flex items-center gap-2">
        <input
          class="w-4 h-4"
          type="checkbox"
          id="glutenCheckBox"
          value="Глютен"
          v-model="newRecipe.allergenics"
        />
        <label class="text-lg" for="glutenCheckBox">🍞 Глютен </label>
      </div>
      <div class="flex items-center gap-2">
        <input
          class="w-4 h-4"
          type="checkbox"
          id="milkCheckBox"
          value="Молочный белок"
          v-model="newRecipe.allergenics"
        />
        <label class="text-lg" for="milkCheckBox">🥛 Молочный белок </label>
      </div>
      <div class="flex items-center gap-2">
        <input
          class="w-4 h-4"
          type="checkbox"
          id="sugarCheckBox"
          value="Сахар"
          v-model="newRecipe.allergenics"
        />
        <label class="text-lg" for="sugarCheckBox">🍭 Сахар </label>
      </div>
      <div class="flex items-center gap-2">
        <input
          class="w-4 h-4"
          type="checkbox"
          id="eggCheckbox"
          value="Яичный белок"
          v-model="newRecipe.allergenics"
        />
        <label class="text-lg" for="eggCheckbox">🥚 Яичный белок</label>
      </div>
      <div class="flex items-center gap-2">
        <input
          class="w-4 h-4"
          type="checkbox"
          id="soyCheckbox"
          value="Соевый белок"
          v-model="newRecipe.allergenics"
        />
        <label class="text-lg" for="soyCheckbox">🌱 Соевый белок</label>
      </div>
      <div class="flex items-center gap-2">
        <input
          class="w-4 h-4"
          type="checkbox"
          id="nutCheckbox"
          value="Орехи"
          v-model="newRecipe.allergenics"
        />
        <label class="text-lg" for="nutCheckbox">🥜 Орехи</label>
      </div>
      <div class="flex items-center gap-2">
        <input
          class="w-4 h-4"
          type="checkbox"
          id="seaCheckbox"
          value="Рыба и морепродукты"
          v-model="newRecipe.allergenics"
        />
        <label class="text-lg" for="seaCheckbox">🐟 Рыба и морепродукты</label>
      </div>
    </div>
    <div class="flex flex-col gap-4 rounded-lg">
      <span class="text-lg font-bold"> Ингредиенты: </span>

      <div v-for="(item, index) in newRecipe.ingredients" :key="index" class="flex flex-col">
        <div class="grid grid-cols-8 gap-2 w-full lg:w-3/4">
          <input
            class="p-2 col-span-5 border-2 bg-slate-50 hover:bg-slate-100 rounded-lg"
            type="text"
            placeholder="Ингредиент"
            v-model="item.ingredient"
          />

          <input
            class="p-2 text-center border-2 bg-slate-50 transiiton hover:bg-slate-100 outline-none rounded-lg"
            v-if="item.unit !== 'по вкусу'"
            type="number"
            v-model.number="item.quantity"
            @input="
              () => {
                if (item.quantity < 0) {
                  item.quantity = 0
                }
                if (item.quantity > 5000) {
                  item.quantity = 5000
                }
              }
            "
          />
          <select
            :class="item.unit === 'по вкусу' ? 'col-span-3' : 'col-span-2'"
            class="p-2 border-2 bg-slate-50 rounded-lg transiiton hover:bg-slate-100 outline-none text-center"
            v-model="item.unit"
          >
            <option value="гр.">гр.</option>
            <option value="мл.">мл.</option>
            <option value="шт.">шт.</option>
            <option value="л.">л.</option>
            <option value="ст.л.">ст.л.</option>
            <option value="ч.л.">ч.л.</option>
            <option value="по вкусу">По вкусу</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-8 gap-2 w-full lg:w-3/4">
        <input
          class="p-2 col-span-5 border-2 bg-slate-50 transiiton hover:bg-slate-100 outline-none rounded-lg"
          type="text"
          placeholder="Ингредиент"
          v-model="ingredient"
        />
        <input
          class="p-2 text-center border-2 bg-slate-50 transiiton hover:bg-slate-100 outline-none rounded-lg"
          v-if="unit !== 'по вкусу'"
          type="number"
          placeholder=""
          v-model="quantity"
          @input="
            () => {
              if (quantity < 0) {
                quantity = 0
              }
              if (quantity > 5000) {
                quantity = 5000
              }
            }
          "
        />
        <select
          :class="unit === 'по вкусу' ? 'col-span-3' : 'col-span-2'"
          class="p-2 border-2 bg-slate-50 rounded-lg transiiton hover:bg-slate-100 outline-none text-center"
          v-model="unit"
        >
          <option value="гр.">гр.</option>
          <option value="мл.">мл.</option>
          <option value="шт.">шт.</option>
          <option value="л.">л.</option>
          <option value="ст.л.">ст.л.</option>
          <option value="ч.л.">ч.л.</option>
          <option value="по вкусу">По вкусу</option>
        </select>
      </div>
      <div class="flex gap-4">
        <button
          @click="addIngredient"
          class="w-10 h-10 p-2 bg-green-400 border-2 border-green-500 hover:bg-green-300 hover:border-green-400 transition hover:shadow-lg hover:shadow-green-300 text-white text-center rounded-full"
        >
          <img src="/plus3.svg" alt="Добавить ингридиент" />
        </button>
        <button
          @click="removeIngredient"
          class="w-10 h-10 p-2 rounded-full bg-red-400 border-2 border-red-500 transition hover:bg-red-300 hover:border-red-400 hover:shadow-lg hover:shadow-red-300 text-white text-center"
        >
          <img src="/plus3.svg" class="origin-center rotate-45" alt="Добавить ингридиент" />
        </button>
      </div>
    </div>
    <div>
      <span class="text-lg font-bold"> Добавить картинку: </span>
      <div class="mt-2 flex flex-col gap-4">
        <input
          :value="selectedFile"
          @input="(event) => (selectedFile = event.target.value)"
          type="file"
          ref="myfile"
        />

        <button
          class="w-fit rounded-3xl p-4 bg-amber-400 border-2 border-amber-500 hover:bg-amber-300 hover:border-amber-400 hover:shadow-amber-400 hover:shadow-lg transition disabled:bg-gray-400 disabled:border-gray-500 disabled:shadow-gray-300"
          :disabled="!selectedFile"
          @click="uploadPic"
        >
          Загрузить изображение
        </button>
        <div class="w-64 rounded-3xl overflow-hidden mb-8">
          <CloudImage :path="newRecipe.picUrl" />
        </div>
        <button
          :disabled="!newRecipe.name"
          @click="uploadRecipe"
          class="mx-auto w-fit rounded-full p-6 text-xl bg-green-400 border-2 border-green-500 hover:bg-green-300 hover:border-green-400 hover:shadow-green-400 hover:shadow-lg hover:-translate-y-2 transition disabled:bg-gray-400 disabled:border-gray-500 disabled:shadow-gray-300"
        >
          Добавить рецепт
        </button>
        {{ selectedFile }}
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='file']::file-selector-button {
  margin-right: 20px;
  border: 2px solid #f59e0b;
  background: #fbbf24;
  padding: 1rem;
  border-radius: 1.5rem;
  color: #000;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

input[type='file']::file-selector-button:hover {
  background: #fcd34d;
  border: 2px solid #fbbf24;
}
</style>
