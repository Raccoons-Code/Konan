module.exports = {
  apps: [{
    exec_mode: "cluster",
    instance_var: "PM2_INSTANCE_ID",
    instances: "max",
    name: "konan",
    restart_delay: 1000,
    script: "./out/index.js",
  }],
};
