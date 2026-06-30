import configConventional from "@commitlint/config-conventional";

const config = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			configConventional.rules["type-enum"][0],
			configConventional.rules["type-enum"][1],
			["content", ...configConventional.rules["type-enum"][2]],
		],
	},
};
export default config;
