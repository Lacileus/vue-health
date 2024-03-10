<script setup>
import { storage } from '../firebase/firebase.js'
import { ref as firebaseRef, getDownloadURL } from 'firebase/storage'
import { ref, onMounted, watch } from 'vue'

const url = ref('recipeImages/placeholder.png')

const props = defineProps({
  path: String
})

onMounted(() => {
  if (props.path) {
    try {
      getDownloadURL(firebaseRef(storage, props.path)).then(
        (downloadUrl) => (url.value = downloadUrl)
      )
    } catch (e) {
      console.log(e)
    }
  }
})

watch(
  () => props.path,
  () => {
    setTimeout(() => {
      getDownloadURL(firebaseRef(storage, props.path)).then(
        (downloadUrl) => (url.value = downloadUrl)
      )
    }, 5000)
  }
)
</script>

<template>
  <img :src="url" class="aspect-square object-cover" alt="Картинка блюда" />
</template>
