import { z } from "zod";

export const GENERATOR_IDS = {
	ADDRESS: "address",
	BINARY: "binary",
	CITY: "city",
	COMPANY: "company",
	COUNTRY: "country",
	DECIMAL: "decimal",
	FIRST_NAME: "first-name",
	HEX: "hex",
	IP: "ip",
	IPV6: "ipv6",
	JOB_TITLE: "job-title",
	MAC: "mac",
	OCTAL: "octal",
	PARAGRAPH: "paragraph",
	PASSWORD: "password",
	PERSONA: "persona",
	PHONE: "phone",
	STATE: "state",
	UUID: "uuid",
	WEBSITE: "website",
	ZIP: "zip",
	SURNAME: "surname",
	FULL_NAME: "full-name",
	USERNAME: "username",
	EMAIL: "email",
	URL: "url",
	SENTENCE: "sentence",
} as const;

export const SUPPORTED_LOCALES = ["en"] as const;

export const DEFAULT_LOCALE = SUPPORTED_LOCALES[0];

export const generatorIdSchema = z.enum([
	GENERATOR_IDS.ADDRESS,
	GENERATOR_IDS.BINARY,
	GENERATOR_IDS.CITY,
	GENERATOR_IDS.COMPANY,
	GENERATOR_IDS.COUNTRY,
	GENERATOR_IDS.DECIMAL,
	GENERATOR_IDS.FIRST_NAME,
	GENERATOR_IDS.HEX,
	GENERATOR_IDS.IP,
	GENERATOR_IDS.IPV6,
	GENERATOR_IDS.JOB_TITLE,
	GENERATOR_IDS.MAC,
	GENERATOR_IDS.OCTAL,
	GENERATOR_IDS.PARAGRAPH,
	GENERATOR_IDS.PASSWORD,
	GENERATOR_IDS.PERSONA,
	GENERATOR_IDS.SENTENCE,
	GENERATOR_IDS.PHONE,
	GENERATOR_IDS.STATE,
	GENERATOR_IDS.SURNAME,
	GENERATOR_IDS.FULL_NAME,
	GENERATOR_IDS.USERNAME,
	GENERATOR_IDS.EMAIL,
	GENERATOR_IDS.URL,
	GENERATOR_IDS.UUID,
	GENERATOR_IDS.WEBSITE,
	GENERATOR_IDS.ZIP,
]);

export const localeSchema = z.string().trim().min(2);

export const countSchema = z.number().int().min(1).default(1);

export const baseGeneratorRequestSchema = z
	.object({
		locale: localeSchema.default(DEFAULT_LOCALE),
		count: countSchema,
	})
	.strict();

export const personGeneratorRequestSchema = baseGeneratorRequestSchema;

export const generatedTextSchema = z.string().trim().min(1);

export const webGeneratorRequestSchema = baseGeneratorRequestSchema
	.extend({
		customValues: z.array(generatedTextSchema).optional(),
		domain: z.string().trim().min(1).optional(),
		path: z.string().trim().min(1).optional(),
		slug: z.string().trim().min(1).optional(),
	})
	.strict();

export const usernameSchema = z
	.string()
	.trim()
	.min(1)
	.regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/);

export const emailSchema = z
	.string()
	.trim()
	.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

export const urlSchema = z
	.string()
	.trim()
	.refine((value) => {
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	}, "Invalid URL");

export function createGeneratorResultSchema<TItem extends z.ZodTypeAny>(
	itemSchema: TItem,
) {
	return z
		.object({
			id: generatorIdSchema,
			locale: localeSchema,
			count: countSchema,
			values: z.array(itemSchema).min(1),
		})
		.strict();
}

export const sentenceGeneratorRequestSchema = baseGeneratorRequestSchema;
export type Count = z.infer<typeof countSchema>;
export type WebGeneratorRequest = z.infer<typeof webGeneratorRequestSchema>;
