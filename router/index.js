import { createRouter, createWebHistory } from 'vue-router'
import Home from '../src/pages/Home.vue'
import Favorites from '../src/pages/Favorites.vue'
import RecipeMaker from '../src/pages/RecipeMaker.vue'
import UserRecipes from '../src/pages/UserRecipes.vue'
import Profile from '../src/pages/Profile.vue'
import Ration from '../src/pages/Ration.vue'
import Charts from '../src/pages/Charts.vue'
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/favorites', name: 'Favorites', component: Favorites },
  { path: '/new_recipe', name: 'New Recipe', component: RecipeMaker },
  { path: '/user_recipes', name: 'User Recipes', component: UserRecipes },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/ration', name: 'Ration', component: Ration },
  { path: '/charts', name: 'Charts', component: Charts }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
