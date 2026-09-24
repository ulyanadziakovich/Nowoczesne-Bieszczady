<script setup lang="ts">
useHead({ title: 'Nowoczesne Bieszczady' })

const { data: home } = await useCmsSingle<HomeContent>('home')
</script>

<template>
  <div>
    <HeroSection
      v-if="home"
      :image="resolveCmsUrl(home.heroImage?.src)"
      :kicker="home.heroKicker"
      :title="home.heroTitle"
      :subtitle="home.heroSubtitle"
      :cta="home.heroCta"
      :cta-href="home.heroCtaHref"
    />
    <FeatureTiles />
    <ScrollHint />
    <AboutSection
      v-if="home"
      :kicker="home.aboutKicker"
      :title="home.aboutTitle"
      :paragraph1="home.aboutParagraph1"
      :paragraph2="home.aboutParagraph2"
      :tagline="home.aboutTagline"
      :image="resolveCmsUrl(home.aboutImage?.src)"
    />
    <FeaturedEvents />
  </div>
</template>
