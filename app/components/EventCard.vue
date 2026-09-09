<script setup lang="ts">
defineProps<{
  image: string
  title: string
  date: string
  time: string
  place: string
  freeEntry?: boolean
  moreHref?: string
  ticketsHref?: string
}>()
</script>

<template>
  <article class="card">
    <div class="image-wrap">
      <img :src="image" :alt="title" class="image" />
      <span v-if="freeEntry" class="badge">Wstęp wolny</span>
    </div>

    <div class="body">
      <h3>{{ title }}</h3>

      <ul class="meta">
        <li>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" />
          </svg>
          {{ date }}
        </li>
        <li>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
          </svg>
          {{ time }}
        </li>
        <li>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.3" />
          </svg>
          {{ place }}
        </li>
      </ul>

      <div class="actions">
        <a :href="moreHref || '#'" class="btn btn-outline">Więcej</a>
        <a v-if="!freeEntry" :href="ticketsHref || '#'" class="btn btn-solid">Bilety</a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: #fff;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.image-wrap {
  position: relative;
  height: 210px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--alpine);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 0.4rem 0.75rem;
}

.body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
}

.meta {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #5a6a62;
  font-size: 0.85rem;
}

.meta li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.btn {
  display: inline-block;
  text-align: center;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
}

.btn-outline {
  flex: 1;
  border: 1.5px solid var(--ink);
  color: var(--ink);
}

.btn-outline:hover {
  background: var(--ink);
  color: #fff;
}

.btn-solid {
  flex: 1;
  background: var(--amber);
  color: #fff;
}

.btn-solid:hover {
  background: #d1571f;
}
</style>
