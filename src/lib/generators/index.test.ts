import { describe, expect, it, vi, afterEach } from "vitest";
import {
	baseGeneratorRequestSchema,
	createGeneratorResultSchema,
	generateAddresses,
	generateBinaryValues,
	generateCities,
	generateCompanies,
	generateCountries,
	generateDecimalValues,
	generateEmails,
	generateFirstNames,
	generateFullNames,
	generateHexValues,
	generateIps,
	generateIpv6s,
	generateJobTitles,
	generateMacs,
	generateOctalValues,
	generateParagraphs,
	generatePasswords,
	generatePersonas,
	generatePhones,
	generateSurnames,
	generateStates,
	generateUrls,
	generateUuids,
	generateUsernames,
	generateWebsites,
	generateZips,
	generatedTextSchema,
	localeSchema,
	normalizeSlug,
	normalizeUrlPath,
	personGeneratorRequestSchema,
	resolveLocale,
	webGeneratorRequestSchema,
} from "./index";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("generator contracts", () => {
	it("accepts valid person requests with count", () => {
		expect(
			personGeneratorRequestSchema.parse({ locale: "en", count: 2 }),
		).toEqual({ locale: "en", count: 2 });
	});

	it("rejects invalid count values", () => {
		expect(() => baseGeneratorRequestSchema.parse({ count: 0 })).toThrow();
	});

	it("rejects malformed locale data", () => {
		expect(() => localeSchema.parse(" ")).toThrow();
	});

	it("accepts web requests with normalized path inputs", () => {
		expect(
			webGeneratorRequestSchema.parse({
				locale: "en",
				count: 1,
				path: "  Team Launch / Q1  ",
			}),
		).toEqual({ locale: "en", count: 1, path: "Team Launch / Q1" });
	});

	it("rejects invalid public batch output", () => {
		const resultSchema = createGeneratorResultSchema(generatedTextSchema);

		expect(
			resultSchema.safeParse({
				id: "first-name",
				locale: "en",
				count: 1,
				values: [""],
			}).success,
		).toBe(false);
	});
});

describe("generator behavior", () => {
	it("falls back to English for unsupported locales", () => {
		expect(resolveLocale("es-MX")).toBe("en");
	});

	it("falls back to English when generating full names for unsupported locales", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);

		expect(generateFullNames({ locale: "es-MX", count: 1 })).toEqual({
			id: "full-name",
			locale: "en",
			count: 1,
			values: ["Ava Parker"],
		});
	});

	it("generates validated first names", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);

		expect(generateFirstNames({ locale: "en", count: 2 })).toEqual({
			id: "first-name",
			locale: "en",
			count: 2,
			values: ["Ava", "Ava"],
		});
	});

	it("generates validated surnames and full names", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);

		expect(generateSurnames({ count: 1 }).values).toEqual(["Parker"]);
		expect(generateFullNames({ count: 1 }).values).toEqual(["Ava Parker"]);
	});

	it("generates safe usernames and emails", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);

		expect(generateUsernames({ count: 1 }).values[0]).toBe("ava.parker.swift");
		expect(
			generateEmails({ count: 1, domain: "https://Example.com" }).values[0],
		).toBe("ava.parker.swift@example.com");
	});

	it("generates normalized urls", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);

		expect(
			generateUrls({
				count: 1,
				domain: "https://Example.dev/blog",
				slug: "Team Launch / Q1",
			}).values[0],
		).toBe("https://example.dev/team-launch/q1");
	});

	it("keeps default url generation available with custom values", () => {
		vi.spyOn(Math, "random").mockReturnValueOnce(0.75).mockReturnValue(0);

		expect(
			generateUrls({ count: 1, customValues: ["acme.com"] }).values[0],
		).toBe("https://example.com/launch");
	});

	it("prefers explicit url options over custom values", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);

		expect(
			generateUrls({
				count: 1,
				customValues: ["acme.com"],
				domain: "example.dev",
				slug: "Docs Home",
			}).values[0],
		).toBe("https://example.dev/docs-home");
	});

	it("normalizes slug helpers", () => {
		expect(normalizeSlug("  Café Launch / Q1  ")).toBe("cafe-launch-q1");
		expect(normalizeUrlPath("  Team Launch / Q1  ")).toBe("/team-launch/q1");
	});

	it("uses custom company values when provided", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);

		expect(
			generateCompanies({ count: 1, customValues: ["Acme"] }).values[0],
		).toBe("Acme");
		expect(
			generatePersonas({ count: 1, customCompanyValues: ["Acme"] }).values.at(0)
				?.company,
		).toBe("Acme");
	});

	it("generates the remaining CLI content types", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);

		expect(generateAddresses({ count: 1 }).values[0]).toBe("100 Maple Street");
		expect(generateBinaryValues({ count: 1 }).values[0]).toBe("00000000");
		expect(generateCities({ count: 1 }).values[0]).toBe("Austin");
		expect(generateCompanies({ count: 1 }).values[0]).toBe("Parker Labs");
		expect(generateCountries({ count: 1 }).values[0]).toBe("United States");
		expect(generateDecimalValues({ count: 1 }).values[0]).toBe("100000");
		expect(generateHexValues({ count: 1 }).values[0]).toBe("000000");
		expect(generateIps({ count: 1 }).values[0]).toBe("0.0.0.0");
		expect(generateIpv6s({ count: 1 }).values[0]).toBe(
			"0000:0000:0000:0000:0000:0000:0000:0000",
		);
		expect(generateJobTitles({ count: 1 }).values[0]).toBe("Senior Engineer");
		expect(generateMacs({ count: 1 }).values[0]).toBe("00:00:00:00:00:00");
		expect(generateOctalValues({ count: 1 }).values[0]).toBe("0");
		expect(generateParagraphs({ count: 1, paragraphSize: 2 }).values[0]).toBe(
			"The team keeps QA reviews during early prototyping. Moreover, the team keeps QA reviews during early prototyping.",
		);
		expect(generatePasswords({ count: 1 }).values[0]).toBe("AAAAAAAAAAAAAAAA");
		expect(generatePersonas({ count: 1 }).values[0]).toEqual(
			expect.objectContaining({
				name: "Ava Parker",
				email: "ava.parker.swift@example.com",
				username: "ava.parker.swift",
			}),
		);
		expect(generatePhones({ count: 1 }).values[0]).toBe("(200) 100-1000");
		expect(generateStates({ count: 1 }).values[0]).toBe("California");
		expect(generateUuids({ count: 1 }).values[0]).toMatch(/^[0-9a-f-]{36}$/i);
		expect(generateWebsites({ count: 1 }).values[0]).toBe(
			"https://example.com",
		);
		expect(generateZips({ count: 1 }).values[0]).toBe("10000");
	});
});
