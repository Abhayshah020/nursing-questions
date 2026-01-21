module.exports = {
  apps: [
    {
      name: "nursing-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000", // Port you want to run
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
