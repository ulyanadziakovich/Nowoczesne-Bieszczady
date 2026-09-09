<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <HeroSection />
    <FeatureTiles />
    <ScrollHint />
    <AboutSection />
    <FeaturedEvents />
    <AppFooter />
  </div>
</template>

<style>
:root {
  --ink: #1a2420;
  --alpine: #2f5d3a;
  --amber: #c9672e;
  --stone: #f3f1ea;
  --mist: #eff2ef;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Fraunces', Georgia, serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-body);
  background: var(--mist);
  color: var(--ink);
}
</style>
