<template>
  <section class="h-full bg-base-foreground">
    <VSpinner v-if="isLoading" />
    <div class="container mx-auto py-12">
      <template v-if="pagination">
        <h1 class="text-xl mb-4">{{ pagination.total }} OTUs found</h1>
        <VPagination
          :total="pagination.total"
          :per="pagination.per"
          v-model="pagination.page"
          @update:modelValue="
            (page) => loadOtus({ page, dwc_occurrence_query: dwcParams })
          "
        />
      </template>
      <ul class="list-disc pl-4">
        <li
          v-for="item in list"
          :key="item.id"
          class="my-2"
        >
          <RouterLink
            :to="`/otus/${item.id}`"
            v-html="item.object_tag"
          />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { makeAPIRequest } from '@/utils'
import { makePagination } from '#/pages/utils'

const route = useRoute()
const list = ref([])
const isLoading = ref(false)
const pagination = ref()
const { page, per, ...dwcParams } = route.query

onMounted(() => {
  loadOtus({
    page: page || 1,
    dwc_occurrence_query: dwcParams
  })
})

async function loadOtus(params) {
  isLoading.value = true

  makeAPIRequest
    .get('/otus', { params })
    .then((response) => {
      list.value = response.data
      pagination.value = makePagination(response.headers)
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>
