<script setup>
import { ref } from 'vue'

defineProps({
  totalPrice: Number
})

const currentlyActive = ref('')
</script>

<template>
  <header class="flex flex-col border-b-2 border-slate-100 px-10 pt-8 pb-4">
    <ul class="flex flex-col lg:flex-row justify-around items-center gap-4">
      <router-link to="/">
        <li
          @click="() => (currentlyActive = 'recipes')"
          class="flex items-center cursor-pointer gap-3 text-gray-500"
        >
          <img src="/book.svg" alt="book" />
          <span
            :class="{ 'border-b-2 border-b-amber-400': currentlyActive === 'recipes' }"
            class="hover:text-amber-400 transition"
            >Рецепты</span
          >
        </li>
      </router-link>
      <router-link to="/favorites">
        <li
          @click="() => (currentlyActive = 'favorites')"
          class="flex items-center cursor-pointer gap-3 text-gray-500"
        >
          <img src="/heart.svg" alt="heart" />
          <span
            :class="{ 'border-b-2 border-b-amber-400': currentlyActive === 'favorites' }"
            class="hover:text-amber-400 transition"
            >Закладки</span
          >
        </li>
      </router-link>
      <router-link to="/user_recipes">
        <li
          @click="() => (currentlyActive = 'user_recipes')"
          class="flex items-center cursor-pointer gap-3 text-gray-500"
        >
          <img src="/food.svg" alt="plus" />
          <span
            :class="{ 'border-b-2 border-b-amber-400': currentlyActive === 'user_recipes' }"
            class="truncate hover:text-amber-400 transition"
            >Мои рецепты</span
          >
        </li>
      </router-link>
      <router-link to="/new_recipe">
        <li
          @click="() => (currentlyActive = 'new_recipe')"
          class="flex items-center cursor-pointer gap-3 text-gray-500"
        >
          <img src="/plus2.svg" alt="plus" />
          <span
            :class="{ 'border-b-2 border-b-amber-400': currentlyActive === 'new_recipe' }"
            class="hover:text-amber-400 transition"
            >Добавить</span
          >
        </li>
      </router-link>

      <router-link to="/ration">
        <li
          @click="() => (currentlyActive = 'ration')"
          class="flex items-center cursor-pointer gap-3 text-gray-500"
        >
          <img src="/ration.svg" width="25" height="25" alt="ration" />
          <span
            :class="{ 'border-b-2 border-b-amber-400': currentlyActive === 'ration' }"
            class="hover:text-amber-400 transition"
            >Рацион</span
          >
        </li>
      </router-link>
      <router-link to="/charts">
        <li
          @click="() => (currentlyActive = 'charts')"
          class="flex items-center cursor-pointer gap-3 text-gray-500"
        >
          <img src="/graph.svg" width="32" height="32" alt="ration" />
          <span
            :class="{ 'border-b-2 border-b-amber-400': currentlyActive === 'charts' }"
            class="hover:text-amber-400 transition"
            >Статистика</span
          >
        </li>
      </router-link>
      <router-link to="/profile">
        <li
          @click="() => (currentlyActive = 'profile')"
          class="flex items-center cursor-pointer gap-3 text-gray-500"
        >
          <img src="/profile.svg" alt="profile" />
          <span
            :class="{ 'border-b-2 border-b-amber-400': currentlyActive === 'profile' }"
            class="hover:text-amber-400 transition"
            >Профиль</span
          >
        </li>
      </router-link>
    </ul>
  </header>
</template>
