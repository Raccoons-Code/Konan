module.exports = {
  apps: [{
    name: "konan",
    script: "./out/index.js",
    exec_mode: "cluster",
    instances: "max",
    instance_var: "PM2_INSTANCE_ID",
  }],
};
