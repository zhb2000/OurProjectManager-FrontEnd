<template>
  <div>
    <div><input name="projectName" v-bind="projectName" /></div>
    <div><input name="projectDescription" v-bind="projectDescription" /></div>
    <div><button @click="createBtnClick">创建项目</button></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      projectName: "",
      projectDescription: "",
    };
  },
  methods: {
    async createBtnClick() {
      let result;
      try {
        result = await axios.post("/api/projects", {
          name: this.projectName,
          description: this.projectDescription,
        });
      } catch (error) {
        alert(error);
        console.log(error.response);
        return;
      }
      const project = result.response.data;
      console.log(project);
      //TODO jump to project home
    },
  },
};
</script>
