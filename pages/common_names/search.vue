<template>
  <section class="bg-base-foreground h-full">
    <VSpinner v-if="isLoading" />
    <div class="mx-auto container py-12">
      <div class="flex flex-col justify-center px-4">
        <!-- No results message -->
        <div v-if="!isLoading && list.length === 0" class="text-center">
          <p class="text-lg">No scales found to be associated with the common name "{{ route.query.common_name }}"</p>
        </div>
        
        <!-- Results list -->
        <div v-else-if="!isLoading">
          <h2 class="text-xl mb-4">{{ list.length }} common name(s) found</h2>
          <ul class="list-disc pl-4">
            <li
              v-for="item in list"
              :key="item.id"
              class="my-2"
            >
              <strong>{{ item.name }}</strong> -
    
              
              <!-- make otu id a hyperlink -->
              <RouterLink
                :to="`/otus/${item.otu_id}`"
                v-html="item.otu_id"
              />

              
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { makeAPIRequest } from '@/utils'

const route = useRoute()
const isLoading = ref(false)
const list = ref([])

onMounted(() => {
  const params = {
    name: route.query.common_name,  // The search term from URL
  }
  loadCommonNames(params)
})

async function loadCommonNames(params) {
  isLoading.value = true
  
  try {
    // Call TaxonWorks API for common names with extend command to pull associated otu information
    // This will create URL like: /common_names?name=putnam&extend[]=otu
    const response = await makeAPIRequest.get('/common_names', { 
      params: {
        name: params.name,
        extend: ['otu']
      }
    })
    
    // Store the results
    list.value = response.data
    
    // Sort alphabetically by name
    if (list.value.length) {
      list.value.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )
    }
    
  } catch (error) {
    console.error('Error loading common names:', error)
    list.value = []
  } finally {
    isLoading.value = false
  }
}
</script>
