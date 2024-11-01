import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { join } from "node:path";

import { NodeHbs } from "../../src/index.js";

const app = new Hono();

const hbs = new NodeHbs({ viewsPath: join(import.meta.dirname, "..", "views") });

app.get("/", (c) => {
	const data = {
		title: "Find your style online",
		description: "This is a section of some simple filler text, also known as placeholder text. It shares characteristics of real text.",
	};

	return c.html(hbs.render("home", data));
});

const port = 3000;

// eslint-disable-next-line no-console
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
