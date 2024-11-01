import handlebars from "handlebars";
import fs from "node:fs";
import { basename, join } from "node:path";

import type { HbsData, HbsOptions } from "./types/index.js";

import debug from "./debug.js";

export class NodeHbs {
	private globalState: HbsData;
	private store: Map<string, any> = new Map();
	private opts: HbsOptions;

	private hasMainLayout: boolean = false;

	constructor(options: HbsOptions) {
		this.globalState = options.globalData || {};
		if (!options.viewsPath) {
			throw new Error("viewsPath is required");
		}

		this.opts = {
			cacheViews: options.cacheViews ?? true,
			viewsPath: options.viewsPath,
			partialsPath: options.partialsPath ?? join(options.viewsPath, "partials"),
			layoutsPath: options.layoutsPath ?? join(options.viewsPath, "layouts"),
			externalPartialPaths: options.externalPartialPaths ?? [],
		};

		this.hasMainLayout = fs.existsSync(join(this.opts.layoutsPath!, "main.hbs"));

		debug(`options %o`, { ...this.opts, hasMainLayout: this.hasMainLayout });

		this.setup();
	}

	private setup() {
		// register all the partials and set global data
		const partials = [
			this.opts.partialsPath,
			...this.opts.externalPartialPaths!,
		];

		partials.forEach((path) => {
			if (!path) {
				return;
			}
			this.registerPartial(path);
		});
	}

	private registerFile(filePath: string) {
		const file = basename(filePath);
		const fileName = basename(file, ".hbs");

		if (file === fileName) {
			debug("not a hbs file:: ", file);
			return;
		}

		const raw = fs.readFileSync(filePath, "utf-8");
		debug("registering partial:: %s", fileName);
		handlebars.registerPartial(fileName, this.compileRaw(raw));
	}

	public registerPartial(path: string): void {
		// check if path is a directory
		if (!fs.statSync(path).isDirectory()) {
			this.registerFile(path);
			return;
		}

		const files = fs.readdirSync(path);

		files.forEach((file) => {
			const nestedPath = join(path, file);
			this.registerPartial(nestedPath);
		});
	}

	public registerHelper(name: string, fn: (...args: any[]) => any): void {
		handlebars.registerHelper(name, fn);
	}

	private compileRaw(raw: string) {
		return handlebars.compile(raw);
	}

	private getTemplate(filename: string) {
		if (this.opts.cacheViews && this.store.has(filename)) {
			return this.store.get(filename);
		}

		const rawTemplate = this.getFile(filename);
		const compiled = this.compileRaw(rawTemplate);

		this.store.set(filename, compiled);
		return compiled;
	}

	private getFile(fileName: string) {
		return this.readPath(join(this.opts.viewsPath, `${fileName}.hbs`));
	}

	private readPath(path: string) {
		return fs.readFileSync(path, "utf-8");
	}

	private getLayout(filename: string) {
		const raw = this.readPath(join(this.opts.layoutsPath!, `${filename}.hbs`));
		return this.compileRaw(raw);
	}

	public render(name: string, data: HbsData = {}, layoutName: string | null = "main"): string {
		// render layout and page with handlebars data
		const payload = { ...this.globalState, ...data };

		// render page with handlebars data
		const template = this.getTemplate(name);
		const pageHtml = template(payload);

		if (!this.hasMainLayout || !layoutName) {
			return pageHtml;
		}

		// render with layout
		return this.getLayout(layoutName)({ ...payload, mainSlot: pageHtml });
	}
}
