module.exports = {
  apps: [
    {
      name: "acopay-markets",
      script: "scripts/vps-markets-sync.mjs",
      cwd: "/home/acopay/acopay-markets",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
