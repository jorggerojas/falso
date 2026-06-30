export const CATALOG_ENTRY_STATUS = {
	AVAILABLE: "available",
	COMING_SOON: "coming-soon",
} as const;

export type CatalogEntryStatus =
	(typeof CATALOG_ENTRY_STATUS)[keyof typeof CATALOG_ENTRY_STATUS];

export interface CatalogEntry {
	slug: string;
	title: string;
	summary: string;
	href: string;
	status: CatalogEntryStatus;
}

export interface HomepageActionInput {
	title?: string;
	href?: string;
	label?: string;
}

export interface HomepagePreviewInput {
	title?: string;
	sample?: string;
	statusLabel?: string;
}

export interface HomepageCoreSurfaceInput {
	primaryAction?: HomepageActionInput | null;
	secondaryAction?: HomepageActionInput | null;
	preview?: HomepagePreviewInput | null;
}

export interface HomepageAction {
	title: string;
	href: string;
	label: string;
}

export interface HomepagePreview {
	title: string;
	sample: string;
	statusLabel: string;
}

export interface HomepageCoreSurface {
	primaryAction: HomepageAction;
	secondaryAction: HomepageAction;
	preview: HomepagePreview;
}

export interface HomepageViewModel {
	headline: string;
	summary: string;
	generator: HomepageCoreSurface;
	entries: readonly CatalogEntry[];
}
