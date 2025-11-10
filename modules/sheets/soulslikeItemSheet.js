const api = foundry.applications.api;
const sheets = foundry.applications.sheets;

export default class soulslikeItemSheet extends api.HandlebarsApplicationMixin(sheets.ItemSheet) {

    sheetContext = {};

    static DEFAULT_OPTIONS = {

        tag: "form",
        classes: ["soulslike", "sheet", "itemSheet"],
        actions: {

        },
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        position: {
            width: 650
        }
    }

    static PARTS = {

        weapon: { template: "systems/soulslike/templates/sheets/item/weapon.hbs" },
    }

    /** @override */
    _configureRenderOptions(options) {

        super._configureRenderOptions(options);

        const part = this.item.type.toLowerCase();
        options.parts = [part];
    }

    /** @override */
    async _prepareContext(options) {

        // Creates basic datamodel, which is used to fill the HTML together with Handlebars with data.

        const baseData = await super._prepareContext();

        const context = {

            // Set General Values
            owner: baseData.document.isOwner,
            editable: baseData.editable,
            item: baseData.document,
            system: baseData.document.system,
            config: CONFIG.SOULSLIKE,
            isGM: baseData.user.isGM,
            effects: baseData.document.effects
        }

        this.sheetContext = context;

        return context;
    }

    /** @override */
    _onRender(context, options) {

        // const tabs = new foundry.applications.ux.Tabs({navSelector: ".tabs", contentSelector: ".content", initial: "tab1"});
        // tabs.bind(this.element);
    }
}