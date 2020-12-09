<template>
  <div>
    <div>comment: {{ comment }}</div>
  </div>
</template>

<script>
import { CommentJson } from "../utils/jsonmodel";

export default {
  props: {
    comment: {
      type: CommentJson,
      required: true,
    },
  },
};
</script>
