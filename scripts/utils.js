const MODULE_NAME = "randomcolorizetokens";

/**
 * Shorthand for game.settings.register().
 * Default data: {scope: "world", config: true}
 * @function addSetting
 * @param {string} key
 * @param {object} data
 */
export function addSetting(key, data) {
	const commonData = {
		name: t(`${key}.name`),
		hint: t(`${key}.hint`),
		scope: "world",
		config: true,
	};
	game.settings.register(MODULE_NAME, key, Object.assign(commonData, data));
}

/**
 * Check whether the entry is an empty string or a falsey value
 * @param string
 * @returns {boolean}
 */
export function isEmpty(string) {
	return !string || string.length === 0 || /^\s*$/.test(string);
}

/**
 * Shorthand for game.settings.set
 * @param {string} key
 * @param value
 */
export async function sSet(key, value) {
	await game.settings.set(MODULE_NAME, key, value);
}

/**
 * Shorthand for game.settings.get
 * @param {string} key
 * @returns {any}
 */
export function sGet(key) {
	return game.settings.get(MODULE_NAME, key);
}

/**
 * Shorthand for game.settings.settings.get
 * @param {string} key
 * @returns {Object}
 */
export function settingData(key) {
	return game.settings.settings.get(`${MODULE_NAME}.${key}`);
}

export function disableCheckbox(checkbox, boolean) {
	checkbox.prop("disabled", !boolean);
}
