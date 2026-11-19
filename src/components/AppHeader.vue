<template>
  <header class="app-header">
    <span class="app-header__logo">greenkassa</span>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 20px;
  background: var(--color-surface);
}

.app-header__logo {
  color: var(--color-text);
  font-size: 18px;
  line-height: 26px;
  font-weight: 700;
}
</style>
