import {
	CATALOG_ENTRY_STATUS,
	type HomepageAction,
	type HomepageActionInput,
	type HomepageCoreSurfaceInput,
	type HomepagePreview,
	type HomepagePreviewInput,
	type HomepageViewModel,
	type CatalogEntry,
} from "@/lib/contracts/catalog";
import { generateFullNames } from "@/lib/generators";

export const CATALOG_ENTRIES = [
	{
		slug: "starter-templates",
		title: "Starter templates",
		summary: "English-only starting points for common generator setups.",
		href: "#starter-templates",
		status: CATALOG_ENTRY_STATUS.AVAILABLE,
	},
	{
		slug: "custom-generators",
		title: "Custom generators",
		summary: "Placeholder space for future generator definitions.",
		href: "#custom-generators",
		status: CATALOG_ENTRY_STATUS.COMING_SOON,
	},
] as const satisfies readonly CatalogEntry[];

const FALLBACK_HEADLINE = "Generate content first, then browse the catalog.";

const FALLBACK_SUMMARY =
	"Falso opens on a tool surface with direct generation entry points and lightweight catalog discovery.";

const FALLBACK_PRIMARY_ACTION = {
	title: "Fast generation",
	href: "#generate",
	label: "Start generating",
} as const satisfies HomepageAction;

const FALLBACK_SECONDARY_ACTION = {
	title: "Catalog discovery",
	href: "#catalog",
	label: "Browse catalog",
} as const satisfies HomepageAction;

const FALLBACK_PREVIEW = {
	title: "Generator preview",
	sample:
		"Generator-core sample output appears here when the homepage receives data.",
	statusLabel: "Ready for generator-core data",
} as const satisfies HomepagePreview;

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function normalizeAction(
	action: HomepageActionInput | null | undefined,
	fallback: HomepageAction,
): HomepageAction {
	const title = action?.title;
	const href = action?.href;
	const label = action?.label;

	return {
		title: isNonEmptyString(title) ? title : fallback.title,
		href: isNonEmptyString(href) ? href : fallback.href,
		label: isNonEmptyString(label) ? label : fallback.label,
	};
}

function normalizePreview(
	preview: HomepagePreviewInput | null | undefined,
): HomepagePreview {
	const title = preview?.title;
	const sample = preview?.sample;
	const statusLabel = preview?.statusLabel;

	return {
		title: isNonEmptyString(title) ? title : FALLBACK_PREVIEW.title,
		sample: isNonEmptyString(sample) ? sample : FALLBACK_PREVIEW.sample,
		statusLabel: isNonEmptyString(statusLabel)
			? statusLabel
			: FALLBACK_PREVIEW.statusLabel,
	};
}

export function buildHomepageCoreSurface(): HomepageCoreSurfaceInput {
	const fullNames = generateFullNames({ count: 3 });
	const previewSample = fullNames.values.join(" · ");

	return {
		primaryAction: {
			title: `${fullNames.id} generator`,
			href: "#generate",
			label: `Generate ${fullNames.count} names`,
		},
		secondaryAction: {
			title: "Catalog discovery",
			href: "#catalog",
			label: "Browse catalog",
		},
		preview: {
			title: `${fullNames.id} preview`,
			sample: previewSample || FALLBACK_PREVIEW.sample,
			statusLabel: `${fullNames.locale.toUpperCase()} · ${fullNames.count} generated names`,
		},
	};
}

export function buildHomepageViewModel(
	coreData?: HomepageCoreSurfaceInput | null,
): HomepageViewModel {
	return {
		headline: FALLBACK_HEADLINE,
		summary: FALLBACK_SUMMARY,
		generator: {
			primaryAction: normalizeAction(
				coreData?.primaryAction,
				FALLBACK_PRIMARY_ACTION,
			),
			secondaryAction: normalizeAction(
				coreData?.secondaryAction,
				FALLBACK_SECONDARY_ACTION,
			),
			preview: normalizePreview(coreData?.preview),
		},
		entries: CATALOG_ENTRIES,
	};
}
