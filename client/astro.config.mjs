// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    domains: ["res.cloudinary.com", "docs.astro.build"],
  },

  output: "server",
  adapter: netlify(),
  integrations: [mdx(), react()],
});