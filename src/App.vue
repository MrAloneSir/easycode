<template>
  <router-view />
</template>

<script>
import { evalJS, filter, evalExpression } from './utils/tpl';

export default {
  provide: {
    evalJS,
    filter,
    evalExpression
  }
};
</script>
