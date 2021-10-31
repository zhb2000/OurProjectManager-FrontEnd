// 创建任务页面
<template>
  <div>
    <el-page-header @back="goBack" content="创建任务" />
    <div class="create-task-grid">
      <div class="input-area">
        <input
          class="create-task-input title"
          v-model="title"
          placeholder="任务标题"
        />
        <textarea
          class="create-task-input create-task-textarea"
          v-model="body"
          placeholder="任务描述"
        />
        <el-button class="create-btn" type="primary" @click="createBtnClick">
          创建任务
        </el-button>
      </div>
      <div class="executor-area">
        <div class="executor-title">分配执行人</div>
        <div class="executor-input-area">
          <input
            class="create-task-input executor-input"
            v-model="executorInput"
            placeholder="输入执行人用户名"
          />
          <el-button size="mini" class="add-btn" @click="addExecutorBtnClick">
            添加
          </el-button>
        </div>
        <executor-item
          v-for="user in executors"
          :key="user.username"
          :user="user"
          @remove-executor="removeBtnClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../utils/ApiUtils";
// eslint-disable-next-line no-unused-vars
import { UserJson } from "../utils/jsonmodel";
import { StringUtils } from "../utils/StringUtils";
import {
  responseErrorTest as errTest,
  BusinessErrorType as BusErrType,
} from "../utils/ResponseErrorUtils";
import TaskExecutorItem from "../components/TaskExecutorItem.vue";

export default {
  data() {
    return {
      task: null,
      title: "",
      body: "",
      /** @type {UserJson[]} */
      executors: [],
      executorInput: "",
    };
  },
  computed: {
    /** @returns {string} */
    projectId() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    async createBtnClick() {
      if (StringUtils.isEmpty(this.title)) {
        this.$message({ message: "任务标题不能为空", type: "error" });
        return;
      }
      try {
        const task = await api.createTaskAsync(
          this.projectId,
          this.title,
          this.body,
          this.executors
        );
        this.$router.push("/projects/" + this.projectId + "/tasks/" + task.id);
      } catch (error) {
        this.$message({ message: "创建任务失败", type: "error" });
        console.log("Create task failed: " + error);
        console.log(error.response);
        return;
      }
    },
    async addExecutorBtnClick() {
      if (StringUtils.isEmpty(this.executorInput)) {
        return;
      }
      for (let user of this.executors) {
        if (user.username === this.executorInput) {
          this.$message("用户 " + this.executorInput + " 已经是执行人了");
          return;
        }
      }
      try {
        const user = await api.getUserByNameAsync(this.executorInput);
        this.executors.push(user);
        this.executorInput = "";
      } catch (error) {
        if (errTest(error, BusErrType.USER_NOT_FOUND)) {
          this.$message({
            message: "用户 " + this.executorInput + " 不存在",
            type: "error",
          });
        } else {
          this.$message({ message: "获取用户失败", type: "error" });
          console.log("Get user failed: " + error);
        }
        return;
      }
    },
    /** @param {UserJson} user */
    removeBtnClick(user) {
      for (let i = 0; i < this.executors.length; i++) {
        if (this.executors[i].username === user.username) {
          this.executors.splice(i, 1);
          break;
        }
      }
    },
    goBack() {
      this.$router.back();
    },
  },
  components: {
    "executor-item": TaskExecutorItem,
  },
};
</script>

<style scoped>
.create-task-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  margin-top: 20px;
}

.create-task-input {
  display: block;
  margin-bottom: 15px;
  background: #fafbfc;
  border-color: #dcdfe6;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 8px 12px;
  font-size: 16px;
}

.create-task-input:hover {
  border-color: #409eff;
}

.create-task-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px #409eff;
}

.create-task-textarea {
  font-family: sans-serif;
  width: 100%;
  min-height: 250px;
  resize: vertical;
}

.title {
  width: 100%;
}

.executor-input {
  margin-right: 10px;
  margin-bottom: 0;
  flex-grow: 1;
}

.executor-area {
  margin-left: 20px;
}

.input-area {
  display: flex;
  flex-direction: column;
}

.create-btn {
  display: block;
  align-self: flex-end;
}

.executor-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.executor-input-area {
  display: flex;
  margin-bottom: 10px;
}

.add-btn {
  padding: 10px;
  border-radius: 6px;
}
</style>
