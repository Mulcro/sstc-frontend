import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from 'vite-plugin-svgr';
import envCompatible from "vite-plugin-env-compatible";
import tailwindcss from "tailwindcss";

export default defineConfig({
    envPrefix: 'REACT_APP_',
    build: {
        outDir: 'build'
    },
    plugins: [
        react(),
        svgrPlugin({
            svgrOptions:{
                icon:true
            }
        }),
        envCompatible()
    ],
    css:{
        postcss:{
            plugins:[tailwindcss()]
        }
    },
    server: {
        host: '0.0.0.0',
        port: process.env.PORT || 3000,
    }
});

