export function vueTemplate(str) {
  return `<template>
      ${str}
  </template>`;
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`;
}

export function cssStyle(cssStr) {
  return `<style lang="scss" scoped>
    ${cssStr}
  </style>`;
}

