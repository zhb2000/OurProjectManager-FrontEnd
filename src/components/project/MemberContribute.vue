<!-- 成员贡献卡片 -->
<template>
  <div class="contribute-card">
    <div class="card-header">
      <el-avatar :size="38" class="avatar">
        <span style="font-size: 20px">{{ nameFirstChar }}</span>
      </el-avatar>
      <router-link :to="userPath" class="username">
        {{ username }}
      </router-link>
      <div class="nickname">
        {{ nickname }}
      </div>
    </div>
    <div class="under-area">
      <div>
        <column-chart v-bind="countConfig" :data="countData" />
      </div>
    </div>
  </div>
</template>

<script>
import { ColumnChart } from "@opd/g2plot-vue";
import { randInt, randBoolean } from "../../utils/utils";
import { dateToDayStr } from "../../utils/DateUtils";
import * as StrUtils from "../../utils/StringUtils";
import { UserJson } from "../../utils/JsonModel";

export default {
  props: {
    user: { type: UserJson, required: true },
  },
  data() {
    const self = this;
    return {
      countData: self.dataDemo(0.5, 5 + 1),
      countConfig: {
        height: 170,
        xField: "date",
        yField: "count",
        xAxis: { label: { autoRotate: false } },
      },
    };
  },
  computed: {
    /** @returns {string} */
    username() {
      return this.user.username;
    },
    /** @returns {string} */
    nickname() {
      return this.user.nickname;
    },
    /** @returns {string} */
    userPath() {
      return `/users/${encodeURIComponent(this.username)}`;
    },
    /** @returns {string} */
    nameFirstChar() {
      return StrUtils.firstCharOfName(this.username);
    },
  },
  methods: {
    dataDemo(boolProb, maxNum) {
      const result = [];
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const now = new Date();
      while (new Date(date) <= new Date(now)) {
        if (randBoolean(boolProb)) {
          result.push({
            date: dateToDayStr(date),
            count: randInt(1, maxNum),
          });
        } else {
          result.push({
            date: dateToDayStr(date),
            count: 0,
          });
        }
        date.setDate(date.getDate() + 1);
      }
      return result;
    },
  },
  components: { ColumnChart },
};
</script>

<style scoped>
.contribute-card {
  border-style: solid;
  border-width: 1px;
  border-color: #dcdfe6;
  border-radius: 10px;
  display: grid;
  grid-template-rows: 60px 200px;
  overflow: hidden;
}

.card-header {
  height: 100%;
  display: flex;
  align-items: center;
}

.avatar {
  margin-left: 15px;
  margin-right: 15px;
}

.username {
  font-weight: bold;
  display: block;
  text-decoration: none;
  color: #0366d6;
  font-size: 20px;
  margin-right: 10px;
}

.username:hover {
  text-decoration: underline;
}

.username:active {
  color: #0366d6;
}

.nickname {
  color: #909399;
}

.under-area {
  background: #f6f8fa;
  padding: 15px 15px 15px 15px;
}
</style>