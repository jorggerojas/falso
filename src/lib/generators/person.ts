import {
	GENERATOR_IDS,
	createGeneratorResultSchema,
	generatedTextSchema,
	personGeneratorRequestSchema,
} from "./contracts";
import {
	generateSeries,
	pickFromList,
	resolveDataset,
	resolveLocale,
} from "./helpers";

const personResultSchema = createGeneratorResultSchema(generatedTextSchema);

export function generateFirstNames(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);
	const dataset = resolveDataset(locale);

	return personResultSchema.parse({
		id: GENERATOR_IDS.FIRST_NAME,
		locale,
		count: request.count,
		values: generateSeries(request.count, () =>
			pickFromList(dataset.firstNames),
		),
	});
}

export function generateSurnames(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);
	const dataset = resolveDataset(locale);

	return personResultSchema.parse({
		id: GENERATOR_IDS.SURNAME,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => pickFromList(dataset.surnames)),
	});
}

export function generateFullNames(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);
	const dataset = resolveDataset(locale);

	return personResultSchema.parse({
		id: GENERATOR_IDS.FULL_NAME,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => {
			const firstName = pickFromList(dataset.firstNames);
			const surname = pickFromList(dataset.surnames);

			return `${firstName} ${surname}`;
		}),
	});
}
