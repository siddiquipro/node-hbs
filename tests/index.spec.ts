import { describe, expect, it } from "vitest";

import { NodeHbs } from "../src";

describe("node hbs tests", () => {
	it("should throw an error if viewsPath is not provided", async () => {
		await expect(async () => new NodeHbs({} as any)).rejects.toThrowError();
	});
});
