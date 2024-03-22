<script setup>
import Card from './Card.vue'

const props = defineProps({
  items: Array,
  load: Boolean
})

const emit = defineEmits(['heart-clicked'])

const handleCardHeartClick = (id, isFavorite) => {
  emit('heart-clicked', id, isFavorite)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" v-auto-animate>
    <Card
      v-for="item in items"
      @card-heart-clicked="handleCardHeartClick"
      :id="item.id"
      :key="item.id"
      :name="item.name"
      :cals="item.cals"
      :category="item.category"
      :proteins="item.proteins"
      :carbs="item.carbs"
      :fats="item.fats"
      :load="props.load"
      :image-url="item.picUrl"
      :is-favorite="item.isFavorite"
      :ingredients="item.ingredients"
      :desc="item.desc"
      :allergenics="item.allergenics"
    />
  </div>
</template>
