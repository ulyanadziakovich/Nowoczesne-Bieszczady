<script setup lang="ts">


// Same key/collection as DreamMapSky.vue — Nuxt dedupes this to one fetch,
// so the SSR fallback below can show the real CMS photo too, not a blank one.
const page = await usePageTexts('dream-map-settings')
usePageTheme(page)
const heroSettings = page.data
await usePageTitle(() => page.t('pageTitle'))
const fundingLogo1 = computed(() => page.image('fundingLogo1'))
const fundingLogo2 = computed(() => page.image('fundingLogo2'))
const fallbackBackgroundImage = computed(
  () =>
    `linear-gradient(180deg, rgba(4, 7, 14, 0.72) 0%, rgba(4, 7, 14, 0.15) 30%, rgba(4, 7, 14, 0.2) 58%, rgba(4, 7, 14, 0.8) 100%), ` +
    `linear-gradient(200deg, rgba(201, 103, 46, 0.22) 0%, transparent 42%), ` +
    `url('${resolveCmsUrl(heroSettings.value?.heroImage?.src)}')`,
)
const aboutImageUrl = computed(() => resolveCmsUrl(heroSettings.value?.aboutImage?.src))
</script>

<template>
  <div>
    <ClientOnly>
      <DreamMapSky />
      <template #fallback>
        <div class="sky-fallback" :style="{ backgroundImage: fallbackBackgroundImage }" />
      </template>
    </ClientOnly>

    <FeatureStory
      :kicker="page.t('aboutKicker')"
      :title="page.t('aboutTitle')"
      :html="page.html('aboutText')"
      :image="aboutImageUrl"
      :alt="page.imageAlt('aboutImage', page.t('aboutTitle'))"
    >
      <div class="funding">
        <p class="funding-note">{{ page.t('fundingNote') }}</p>
        <div class="funding-logos">
          <img
            v-if="fundingLogo1"
            class="funding-logo funding-logo-niw"
            :src="fundingLogo1"
            :alt="page.imageAlt('fundingLogo1', '')"
            width="476"
            height="56"
            loading="lazy"
            decoding="async"
          />
          <img
            v-if="fundingLogo2"
            class="funding-logo funding-logo-procarpathia"
            :src="fundingLogo2"
            :alt="page.imageAlt('fundingLogo2', '')"
            width="900"
            height="306"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </FeatureStory>

    <DreamMapBoard />
    <RelatedNews place="ustrzyki-2036" />
  </div>
</template>

<style scoped>
.funding {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e6e2d8;
}

.sky-fallback {
  height: 100vh;
  height: 100dvh;
  min-height: 480px;
  max-height: 900px;
  background-color: #060a14;
  background-position: center bottom;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode: normal, soft-light, normal;
}

.about {
  max-width: 760px;
  margin: 0 auto;
}

.about-text p {
  color: #4a4a44;
  font-size: 1rem;
  line-height: 1.75;
  margin: 0 0 1.25rem;
}

.about-image-wrap {
  display: none;
  max-width: 900px;
  margin: 0 auto 3rem;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(26, 36, 32, 0.16);
}

.about-image {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 900px) {
  .about-image-wrap {
    display: block;
    margin-bottom: 2rem;
  }
}

.funding-note {
  font-size: 0.85rem !important;
  color: #8a978f !important;
  padding-top: 1rem;
  border-top: 1px solid #e3ded1;
}

.funding-logos {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 1.25rem;
}

.funding-logo {
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

.funding-logo-niw {
  height: 42px;
}

.funding-logo-procarpathia {
  height: 40px;
}

@media (max-width: 600px) {
  .funding-logos {
    gap: 1.25rem;
  }

  .funding-logo-niw {
    height: 34px;
  }

  .funding-logo-procarpathia {
    height: 32px;
  }
}

</style>
