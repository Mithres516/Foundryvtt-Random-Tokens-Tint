import { settingData, sGet, sSet } from "./utils.js";

const MODULE_NAME = "randomcolorizetokens";

class BaseSettings extends FormApplication {
	constructor(object, options = {}) {
		super(object, options);
		/** Set path property */
	}
	/**
	 * Default Options for this FormApplication
	 */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["form", "randomcolorizetokens"],
			width: 640,
			height: 600,
			closeOnSubmit: true,
		});
	}

	prepSelection(key) {
		const path = `${key}`;
		const data = settingData(path);
		const { name, hint } = data;
		const selected = sGet(path);
		const select = Object.entries(data.choices).map(([key, value]) => ({ key, value }));
		return { select, name, hint, selected };
	}

	prepSetting(key) {
		const path = `${key}`;
		const { name, hint } = settingData(path);
		return {
			value: sGet(path),
			name,
			hint,
		};
	}

	async resetToDefault(key) {
		const defaultValue = game.settings.settings.get(`randomcolorizetokens.${key}`).default;
		await game.settings.set("randomcolorizetokens", key, defaultValue);
	}

	/**
	 * Executes on form submission
	 * @param {Event} event - the form submission event
	 * @param {Object} formData - the form data
	 */
	async _updateObject(event, formData) {
		await Promise.all(
			Object.entries(formData).map(async ([key, value]) => {
				await sSet(`${key}`, value);
			})
		);
	}
}

export class ColorRandomizerSettings extends BaseSettings {
	constructor(object, options = {}) {
		super(object, options);
		this.colors = deepClone(sGet("colors")).map((c, i) => {
			return {
				color: c,
				indexLabel: i + 1,
			}
		});
		Hooks.once("renderColorRandomizerSettings", this.initHooks.bind(this));
		Hooks.once("closeColorRandomizerSettings", () => { });
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			id: "randomcolorizetokens-colors",
			title: `Random Colorize Tokens Colors}`,
			template: "./modules/randomcolorizetokens/templates/colorSettings.hbs",
			height: "auto",
		});
	}

	getData(options) {
		return {
			colors: this.colors,
		};
	}

	async activateListeners(html) {
		super.activateListeners(html);

		for (let i = 0; i < this.colors.length; i++) {
			html.find("button[name=deleterow-" + i + "]").on("click", async (event) => {
				this.colors.splice(i, 1);
				for (let col in this.colors) {
					this.colors[col].indexLabel = col+1;
				}
				this.render(true);
			});
		}
		html.find("button[name=add]").on("click", async (event) => {
			this.colors.push({
				color: null,
				indexLabel: (this.colors.length+1)
			});
			this.render(true);
		});
		html.find("button[name=reset]").on("click", async (event) => {
			const keys = [
				"colors",
			];
			await Promise.all(keys.map(this.resetToDefault));
			this.colors = deepClone(sGet("colors")).map((c, i) => {
				return {
					color: c,
					indexLabel: i + 1,
				}
			});
			this.render(true);
		});

	}

	initHooks() {
	}
}