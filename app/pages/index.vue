<script setup lang="ts">
const home = await usePageTexts('home')
usePageTheme(home)
const common = await usePageTexts('site-settings')
useHead({ title: () => common.t('siteName') })
</script>

<template>
  <div>
    <HeroSection
      :image="home.image('heroImage')"
      :kicker="home.t('heroKicker')"
      :title="home.t('heroTitle')"
      :subtitle="home.t('heroSubtitle')"
      :cta="home.t('heroCta')"
      :cta-href="home.t('heroCtaHref')"
    />
    <FeatureTiles />
    <ScrollHint />
    <AboutSection
      :kicker="home.t('aboutKicker')"
      :title="home.t('aboutTitle')"
      :paragraph1="home.t('aboutParagraph1')"
      :paragraph2="home.t('aboutParagraph2')"
      :tagline="home.t('aboutTagline')"
      :image="home.image('aboutImage')"
    />
    <FeaturedEvents />
  </div>
</template>
