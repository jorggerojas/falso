import {
	GENERATOR_IDS,
	createGeneratorResultSchema,
	emailSchema,
	webGeneratorRequestSchema,
	type WebGeneratorRequest,
	usernameSchema,
	urlSchema,
} from "./contracts";
import {
	createUrlFromParts,
	joinUsernameParts,
	generateSeries,
	pickFromList,
	resolveDataset,
	resolveLocale,
	normalizeDomain,
} from "./helpers";

const usernameResultSchema = createGeneratorResultSchema(usernameSchema);
const emailResultSchema = createGeneratorResultSchema(emailSchema);
const urlResultSchema = createGeneratorResultSchema(urlSchema);

function buildUsername(request: WebGeneratorRequest): string {
	const dataset = resolveDataset(request.locale);
	const firstName = pickFromList(dataset.firstNames);
	const surname = pickFromList(dataset.surnames);
	const word = pickFromList(dataset.usernameWords);

	return joinUsernameParts([firstName, surname, word]);
}

function buildEmail(request: WebGeneratorRequest): string {
	const dataset = resolveDataset(request.locale);
	const localPart = buildUsername(request);
	const domain = normalizeDomain(
		request.domain ?? pickFromList(dataset.domains),
	);

	return `${localPart}@${domain}`;
}

function buildUrl(request: WebGeneratorRequest): string {
	const customValues = request.customValues ?? [];
	const shouldUseCustomValue =
		customValues.length > 0 &&
		!request.domain &&
		!request.path &&
		!request.slug &&
		Math.random() < 0.5;

	if (shouldUseCustomValue) {
		return normalizeCustomUrl(pickFromList(customValues));
	}

	const dataset = resolveDataset(request.locale);
	const domain = request.domain ?? pickFromList(dataset.domains);
	const source = request.path ?? request.slug ?? pickFromList(dataset.paths);

	return createUrlFromParts(domain, source);
}

function normalizeCustomUrl(value: string): string {
	const candidate = value.match(/^https?:\/\//) ? value : `https://${value}`;

	return new URL(candidate).toString();
}

export function generateUsernames(input: unknown = {}) {
	const request = webGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return usernameResultSchema.parse({
		id: GENERATOR_IDS.USERNAME,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildUsername(request)),
	});
}

export function generateEmails(input: unknown = {}) {
	const request = webGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return emailResultSchema.parse({
		id: GENERATOR_IDS.EMAIL,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildEmail(request)),
	});
}

export function generateUrls(input: unknown = {}) {
	const request = webGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return urlResultSchema.parse({
		id: GENERATOR_IDS.URL,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildUrl(request)),
	});
}
