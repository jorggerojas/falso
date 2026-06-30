import { afterEach, describe, expect, it, vi } from "vitest";

import {
	CATALOG_ENTRIES,
	buildHomepageCoreSurface,
	buildHomepageViewModel,
} from "./catalog";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("bootstrap homepage catalog contract", () => {
	it("builds the homepage view model from complete core data", () => {
		const viewModel = buildHomepageViewModel({
			primaryAction: {
				title: "Generate content",
				href: "#generate",
				label: "Open generator",
			},
			secondaryAction: {
				title: "Explore catalog",
				href: "#catalog",
				label: "Browse catalog",
			},
			preview: {
				title: "Live preview",
				sample: "Sample output from generator-core.",
				statusLabel: "Connected",
			},
		});

		expect(viewModel).toEqual({
			headline: "Generate content first, then browse the catalog.",
			summary:
				"Falso opens on a tool surface with direct generation entry points and lightweight catalog discovery.",
			generator: {
				primaryAction: {
					title: "Generate content",
					href: "#generate",
					label: "Open generator",
				},
				secondaryAction: {
					title: "Explore catalog",
					href: "#catalog",
					label: "Browse catalog",
				},
				preview: {
					title: "Live preview",
					sample: "Sample output from generator-core.",
					statusLabel: "Connected",
				},
			},
			entries: CATALOG_ENTRIES,
		});
	});

	it("falls back to safe generator data when core data is partial", () => {
		const viewModel = buildHomepageViewModel({
			primaryAction: {
				href: "#custom-start",
			},
			preview: {
				sample: "",
			},
		});

		expect(viewModel.generator).toEqual({
			primaryAction: {
				title: "Fast generation",
				href: "#custom-start",
				label: "Start generating",
			},
			secondaryAction: {
				title: "Catalog discovery",
				href: "#catalog",
				label: "Browse catalog",
			},
			preview: {
				title: "Generator preview",
				sample:
					"Generator-core sample output appears here when the homepage receives data.",
				statusLabel: "Ready for generator-core data",
			},
		});
	});

	it("keeps the seeded catalog entries and fallback generator states when core data is missing", () => {
		const viewModel = buildHomepageViewModel();

		expect(viewModel.entries).toEqual(CATALOG_ENTRIES);
		expect(viewModel.generator).toEqual({
			primaryAction: {
				title: "Fast generation",
				href: "#generate",
				label: "Start generating",
			},
			secondaryAction: {
				title: "Catalog discovery",
				href: "#catalog",
				label: "Browse catalog",
			},
			preview: {
				title: "Generator preview",
				sample:
					"Generator-core sample output appears here when the homepage receives data.",
				statusLabel: "Ready for generator-core data",
			},
		});
	});

	it("uses generator-core output when building the homepage surface", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);

		const viewModel = buildHomepageViewModel(buildHomepageCoreSurface());

		expect(viewModel.generator.preview).toEqual({
			title: "full-name preview",
			sample: "Ava Parker · Ava Parker · Ava Parker",
			statusLabel: "EN · 3 generated names",
		});
		expect(viewModel.generator.primaryAction.title).toBe("full-name generator");
	});
});
