<!-- 评论条目框架 -->
<template>
  <div class="comment-outer">
    <router-link :to="userUrl">
      <el-avatar size="medium">{{ nameFirstChar }}</el-avatar>
    </router-link>
    <div class="comment-card">
      <div class="card-upper">
        <router-link :to="userUrl" class="user-url">{{ username }}</router-link>
        <div class="create-at">{{ createAt }}</div>
        <div style="flex-grow: 1" />
        <slot name="button"><!--edit or delete button--></slot>
      </div>
      <div class="card-lower">
        <markdown-preview :initialValue="body" ref="markdownContent" />
      </div>
    </div>
  </div>
</template>

<script>
import { MarkdownPreview } from "vue-meditor";
import { UserJson } from "../../utils/JsonModel";
import * as StrUtils from "../../utils/StringUtils";

export default {
  props: {
    user: { type: UserJson, required: true },
    createAt: { type: String, required: true },
    body: { type: String, required: true },
  },
  computed: {
    username() {
      return this.user.username;
    },
    userUrl() {
      return `/users/${encodeURIComponent(this.username)}`;
    },
    nameFirstChar() {
      return StrUtils.firstCharOfName(this.username);
    },
  },
  mounted() {
    //HACK 修改 Markdown 内容的 padding
    /** @type {HTMLDivElement} */
    const outerDiv = this.$refs.markdownContent.$refs.preview;
    console.assert(outerDiv instanceof HTMLDivElement);
    /** @type {HTMLDivElement} */
    const firstChild = outerDiv.firstElementChild;
    console.assert(firstChild != null);
    console.assert(firstChild instanceof HTMLDivElement);
    //原 padding 在 CSS 中被设为 important，只能这么改
    firstChild.setAttribute("style", "padding: 0px !important");
  },
  components: { MarkdownPreview },
};
</script>

<style scoped>
.comment-outer {
  display: flex;
  margin-bottom: 20px;
}
.comment-card {
  flex-grow: 1;
  margin-left: 15px;
  border-radius: 6px;
  border: solid 1px #dcdfe6;
  overflow: hidden;
}

.card-upper {
  background: #f6f8fa;
  border-bottom: solid 1px #dcdfe6;
  padding: 0 15px;
  height: 40px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.card-lower {
  /* 注：Markdown 中的段落带有 8px 的 margin-bottom */
  padding: 15px 15px 7px 15px;
  /* padding: 8px 10px 0px 10px; */
}

.user-url {
  color: #303133;
  font-weight: bold;
  font-size: 14px;
  text-decoration: none;
  margin-right: 10px;
}

.user-url:hover {
  color: #0366d6;
  text-decoration: underline;
}

.create-at {
  font-size: 14px;
  color: #606266;
}
</style>
