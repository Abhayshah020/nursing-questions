module.exports = {
    apps: [
        {
            name: "nursing-frontend",
            script: "node_modules/next/dist/bin/next",
            cwd: "/var/www/nursing-questions",
            args: "start -p 4051", // Port you want to run
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};