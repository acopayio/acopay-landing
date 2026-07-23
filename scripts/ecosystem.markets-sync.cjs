module.exports = {
  apps: [
    {
      name: "acopay-markets",
      script: "scripts/vps-markets-sync.mjs",
      cwd: "/root/acopay-markets",
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
