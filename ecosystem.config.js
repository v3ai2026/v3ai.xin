module.exports = {
    apps: [
        {
            name: "buildingai",
            script: "dist/main.js",
            cwd: "packages/api",
            instances: "1",
            exec_mode: "cluster",
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
            },
            env_production: {
                NODE_ENV: "production",
            },
            env_development: {
                NODE_ENV: "development",
            },
            error_file: "../../logs/pm2/api-error.log",
            out_file: "../../logs/pm2/api-out.log",
            log_file: "../../logs/pm2/api-combined.log",
            time: true,
            merge_logs: true,
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
        },
    ],
};
