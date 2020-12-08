<template>
  <div>
    <h1>CreateProject</h1>
    <div>项目名称：<input name="projectName" v-model="projectName" /></div>
    <div>
      项目描述：<input name="projectDescription" v-model="projectDescription" />
    </div>
    <div><button @click="createBtnClick">创建项目</button></div>
  </div>
</template>

<script>
import { StringUtils } from "../utils/StringUtils";
import { createProjectAsync } from "../utils/ApiUtils";

export default {
  data() {
    return {
      projectName: "",
      projectDescription: "",
    };
  },
  methods: {
    async createBtnClick() {
      if (StringUtils.isEmpty(this.projectName)) {
        alert("项目名不能为空");
        return;
      }
      let projectId;
      try {
        const project = await createProjectAsync(
          this.projectName,
          this.projectDescription
        );
        projectId = project.id;
      } catch (error) {
        alert(error);
        return;
      }
      this.$router.push("/projects/" + projectId);
    },
  },
};
</script>
