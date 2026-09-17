---
name: 'FlatCat'
---

# FlatCat

<script setup>
const base = import.meta.env.BASE_URL
const files = [
  { name: 'Aclerdidae', path: 'public/flatcat/aclerdidae.html' },
]
</script>

<ul>
  <li v-for="file in files" :key="file.path">
    <a :href="`${base}${file.path}`" target="_blank">{{ aclerdidae.html }}</a>
  </li>
</ul>
