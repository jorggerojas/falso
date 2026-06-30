import { DEFAULT_LOCALE, type Count } from "./contracts";
import {
	GENERATOR_DATASETS,
	type GeneratorDataset,
	type GeneratorLocale,
} from "./datasets";

export function normalizeLocale(value: string): string {
	return value.trim().toLowerCase().replaceAll("_", "-");
}

function isGeneratorLocale(value: string): value is GeneratorLocale {
	return Object.hasOwn(GENERATOR_DATASETS, value);
}

export function resolveLocale(value: string | undefined): GeneratorLocale {
	const normalized = normalizeLocale(value ?? DEFAULT_LOCALE);

	return isGeneratorLocale(normalized) ? normalized : DEFAULT_LOCALE;
}

export function resolveDataset(value: string | undefined): GeneratorDataset {
	return GENERATOR_DATASETS[resolveLocale(value)];
}

export function pickFromList<T>(items: readonly T[]): T {
	if (items.length === 0) {
		throw new Error("Cannot pick a value from an empty list.");
	}

	const index = Math.floor(Math.random() * items.length);

	return (items[index] as T) ?? (items[0] as T);
}

export function generateSeries<T>(count: Count, factory: () => T): T[] {
	return Array.from({ length: count }, factory);
}

export function normalizeSlug(value: string): string {
	return value
		.normalize("NFKD")
		.toLowerCase()
		.replaceAll(/[^\w\s-]/g, "")
		.replaceAll(/\s+/g, "-")
		.replaceAll(/-+/g, "-")
		.replaceAll(/^-+|-+$/g, "");
}

export function normalizeUsernamePart(value: string): string {
	return normalizeSlug(value).replaceAll(/-/g, "").replaceAll(/_/g, "");
}

export function joinUsernameParts(parts: readonly string[], separator = ".") {
	return parts.map(normalizeUsernamePart).filter(Boolean).join(separator);
}

export function normalizeDomain(value: string): string {
	const trimmed = value.trim().toLowerCase();
	const withoutScheme = trimmed.replace(/^https?:\/\//, "");
	const [host] = withoutScheme.split("/");

	return (host ?? withoutScheme).replaceAll(/\.+$/g, "");
}

export function normalizeUrlPath(value: string): string {
	const segments = value
		.split("/")
		.map((segment) => normalizeSlug(segment))
		.filter(Boolean);

	return segments.length > 0 ? `/${segments.join("/")}` : "/";
}

export function createUrlFromParts(domain: string, path: string): string {
	return `https://${normalizeDomain(domain)}${normalizeUrlPath(path)}`;
}
