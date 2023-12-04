import { ColorRandomizerSettings } from "./randomizerMenu.js";
import { injectConfig } from "../lib/injectConfig.js";
import { sGet, sSet } from "./utils.js";

const MODULE_NAME = "randomcolorizetokens";

function addMenuSetting(key, data) {
    const commonData = {
        name: key,
        hint: key,
        scope: "world",
        config: false,
    };
    game.settings.register(MODULE_NAME, key, Object.assign(commonData, data));
}

Hooks.on("init", () => {
    console.log("Random Tokens Tint - Initialize");

    addMenuSetting("colors", {
        type: Array,
        default: [
            "#b83232",
            "#b83232",
            "#383e3c",
            "#383e3c",
            "#383e3c",
            "#8E8E8E",
            "#8E8E8E",
            "#ffffff",
            "#ffffff",
            "#bd8100",
            "#32b88c",
            "#3c6bd7",
            "#bec73d",
            "#8816d4",
            "#dca9fe",
        ],
        onChange: () => {
            sSet("usableColors", []);
        }
    });

    addMenuSetting("usableColors", {
        type: Array,
        default: [
        ],
    });

    game.settings.register(MODULE_NAME, "active", {
        name: "Active",
        hint: "Activate or disable the whole module",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.register(MODULE_NAME, "loop", {
        name: "Avoid Repetition",
        hint: "Will avoid repeating the same color until all colors have been used in a row",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.registerMenu(MODULE_NAME, "colorsMenu", {
        name: "Random Tokens Tint - Colors",
        label: "Setup Colors",      // The text label used in the button
        hint: "Setup the colors to use with the module",
        icon: "fas fa-palette",               // A Font Awesome icon used in the submenu button
        type: ColorRandomizerSettings,   // A FormApplication subclass which should be created
        restricted: true                   // Restrict this submenu to gamemaster only?
    });

});

Hooks.on("preCreateToken", function (document, data, options) {
    const active = sGet("active");
    if (!active) { return; }
    if (!document.flags?.randomcolorizetokens.randomizeColor) { return; }

    const loop = sGet("loop");

    let colorGroup = loop ? sGet("usableColors") : deepClone(sGet("colors"));
    if (loop && colorGroup.length == 0) {
        colorGroup = deepClone(sGet("colors"));
    }
    const index = Math.floor(Math.random() * colorGroup.length);
    const color = colorGroup[index];
    if (loop) {
        colorGroup.splice(index, 1);
        sSet("usableColors", colorGroup);
    }
    document.updateSource({ texture: { tint: color } });
    return true; //false blocks the creation
});

const renderTokenConfigHandler = async (tokenConfig, html) => {
    const moduleId = MODULE_NAME;
    const tab = {
        name: moduleId,
        label: "Random Tokens Tint",
        icon: "fas fa-palette",
    };
    injectConfig.inject(tokenConfig, html, { moduleId, tab }, tokenConfig.object);
    const posTab = html.find(`.tab[data-tab="${moduleId}"]`);
    const tokenFlags = tokenConfig.options.sheetConfig
        ? tokenConfig.object.flags?.randomcolorizetokens
        : tokenConfig.token.flags?.randomcolorizetokens;
    const data = {
        randomizeColor: tokenFlags?.randomizeColor ? "checked" : "",
    };
    const insertHTML = await renderTemplate(`modules/${moduleId}/templates/token-config.html`, data);
    posTab.append(insertHTML);
}

const randomColorToSelection = (loop = true, onlyColorable = false) => {
    const tokens = canvas.tokens.controlled;

    for (let token of tokens) {
        if (onlyColorable && !token.document.flags?.randomcolorizetokens.randomizeColor) { continue; }
        let colorGroup = loop ? sGet("usableColors") : deepClone(sGet("colors"));
        if (loop && colorGroup.length == 0) {
            colorGroup = deepClone(sGet("colors"));
        }
        const index = Math.floor(Math.random() * colorGroup.length);
        const color = colorGroup[index];
        if (loop) {
            colorGroup.splice(index, 1);
            sSet("usableColors", colorGroup);
        }
        token.document.update({ texture: { tint: color, }, });
    }
}
const api = {};
api.funcs = {};
api.funcs.randomColorToSelection = randomColorToSelection;
self.randomTokensTint = api;

Hooks.on("renderTokenConfig", renderTokenConfigHandler);