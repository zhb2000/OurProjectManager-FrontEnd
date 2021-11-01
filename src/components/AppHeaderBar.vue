<template>
  <div class="header-bar">
    <button class="menu-btn" @click="menuBtnClick" />
    <router-link :to="userHomeUrl" class="header-logo-link">
      <span class="header-logo">Our Project Manager</span>
    </router-link>
    <input class="search-input" placeholder="搜索或跳转" />
    <div style="flex-grow: 1" />
    <router-link to="/dev">
      <i class="el-icon-monitor header-icon" />
    </router-link>
    <router-link :to="userNotificationUrl">
      <i class="el-icon-bell header-icon" />
    </router-link>
    <router-link :to="userProjectUrl">
      <i class="el-icon-plus header-icon" />
    </router-link>
    <el-dropdown trigger="click" @command="dropDownSelect">
      <el-avatar
        size="small"
        icon="el-icon-user-solid"
        style="cursor: pointer"
      />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">主页</el-dropdown-item>
        <el-dropdown-item command="projects">项目</el-dropdown-item>
        <el-dropdown-item command="notifications">消息</el-dropdown-item>
        <el-dropdown-item command="setting">设置</el-dropdown-item>
        <el-dropdown-item command="logout">登出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import * as api from "../utils/ApiUtils";

export default {
  data() {
    return {
      currentUsername: null,
    };
  },
  computed: {
    userHomeUrl() {
      return "/users/" + this.currentUsername;
    },
    userNotificationUrl() {
      return "/users/" + this.currentUsername + "/notifications";
    },
    userProjectUrl() {
      return "/users/" + this.currentUsername + "/projects";
    },
    userSettingUrl() {
      return "/users/" + this.currentUsername + "/setting";
    },
  },
  watch: {
    $route() {
      this.pageChangedAsync();
    },
  },
  created() {
    this.pageChangedAsync();
  },
  methods: {
    async pageChangedAsync() {
      this.currentUsername = await api.getCurrentUsernameAsync();
    },
    async dropDownSelect(cmd) {
      if (cmd === "home") {
        this.$router.push(this.userHomeUrl);
      } else if (cmd === "projects") {
        this.$router.push(this.userProjectUrl);
      } else if (cmd === "notifications") {
        this.$router.push(this.userNotificationUrl);
      } else if (cmd === "setting") {
        this.$router.push(this.userSettingUrl);
      } else if (cmd == "logout") {
        await api.logoutAsync();
        this.$router.push("/login");
      }
    },
    menuBtnClick() {
      this.$emit("menu-click");
    },
  },
};
</script>

<style scoped>
.header-bar {
  background: #409eff;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 30px;
}

.menu-btn {
  background: url("~@/assets/menu_white_24dp.svg");
  background-size: cover;
  background-position: center;
  width: 30px;
  height: 30px;
  min-width: 30px;
  border: 0px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 20px;
  display: none;
}

.menu-btn:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.header-logo-link {
  text-decoration: none;
  margin-right: 20px;
}

.header-logo {
  color: white;
  font-size: 25px;
  font-weight: bold;
}

.search-input {
  width: 300px;
  background: transparent;
  border-radius: 6px;
  border: solid 1px rgba(255, 255, 255, 0.671);
  padding: 6px 12px;
  font-size: 14px;
  transition: 0.3s;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.search-input:focus {
  outline: none;
  background: #fafbfc;
  width: 400px;
}

.search-input:focus::placeholder {
  color: #606266;
}

.header-icon {
  color: white;
  margin-right: 20px;
}

.header-icon:hover {
  color: #e9e9eb;
}

@media screen and (max-width: 800px) {
  .menu-btn {
    display: inline-block;
  }

  .header-logo-link {
    display: none;
  }
}

@media screen and (max-width: 600px) {
  .header-bar {
    padding: 0 10px;
  }

  .search-input {
    display: none;
  }
}
</style>