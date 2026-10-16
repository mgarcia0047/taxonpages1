<template>
  <section class="h-full bg-base-foreground">
    <VSpinner v-if="isLoading" />
    <div class="container mx-auto py-12">
      <div class="flex flex-row gap-2 mb-6 max-w-[500px]">
        <input
          class="scalenet-input"
          type="text"
          placeholder="Narrow by taxon name (optional), e.g. Coccus"
          v-model="taxonInput"
          @keypress.enter="applyTaxonFilter"
        />
        <VButton primary @click="applyTaxonFilter">Filter</VButton>
      </div>

      <p v-if="notFound" class="text-lg mb-4">
        No taxon named "{{ route.query.taxon_name }}" was found.
      </p>

      <template v-if="pagination">
        <h1 class="text-xl mb-4">{{ pagination.total }} OTUs found</h1>
        <VPagination
          :total="pagination.total"
          :per="pagination.per"
          v-model="pagination.page"
          @update:modelValue="
            (newPage) => loadOtus({ ...route.query, page: newPage })
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
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { makeAPIRequest } from '@/utils'
import { makePagination } from '#/pages/utils'

const route = useRoute()
const router = useRouter()
const list = ref([])
const isLoading = ref(false)
const notFound = ref(false)
const pagination = ref()
const taxonInput = ref(route.query.taxon_name || '')

onMounted(() => {
  loadOtus(route.query)
})

onBeforeRouteUpdate((to) => {
  taxonInput.value = to.query.taxon_name || ''
  loadOtus(to.query)
})

function applyTaxonFilter() {
  router.push({
    path: '/distribution/search',
    query: {
      ...route.query,
      page: undefined,
      taxon_name: taxonInput.value.trim() || undefined
    }
  })
}

async function loadOtus(query) {
  const { page, per, taxon_name, ...dwcParams } = query
  isLoading.value = true
  notFound.value = false

  try {
    const params = {
      page: page || 1,
      dwc_occurrence_query: dwcParams
    }

    if (taxon_name) {
      const taxonResponse = await makeAPIRequest.get('/taxon_names', {
        params: { name: taxon_name, name_exact: true, validity: true }
      })

      if (taxonResponse.data.length === 0) {
        list.value = []
        pagination.value = undefined
        notFound.value = true
        return
      }

      params.taxon_name_id = taxonResponse.data.map((t) => t.id)
      params.descendants = true
    }

    const otuResponse = await makeAPIRequest.get('/otus', { params })
    list.value = otuResponse.data
    pagination.value = makePagination(otuResponse.headers)
  } catch (error) {
    console.error('Error loading OTUs:', error)
    list.value = []
  } finally {
    isLoading.value = false
  }
}
</script>


