module.exports = {
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      let argvEnv = process.env.BACKEND_URL;
      args[0]['process.env'].BACKEND_URL = JSON.stringify(argvEnv);
      return args;
    });
  }
};
