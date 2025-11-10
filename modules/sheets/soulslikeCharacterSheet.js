const api = foundry.applications.api;
const sheets = foundry.applications.sheets;

export default class soulslikeCharacterSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {

    sheetContext = {};

    static DEFAULT_OPTIONS = {

        tag: "form",
        classes: ["soulslike", "sheet", "characterSheet"],
        actions: {
            "item-delete": async (event, target) => {
                const hand = target.closest("[data-hand]")?.dataset.hand;
                if ( hand ) await this.actor.update({[`system.hands.${hand}`]: ""});
            }
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

        header: { template: "systems/soulslike/templates/sheets/character/header.hbs" },
        main: { template: "systems/soulslike/templates/sheets/character/main.hbs"}
    }

    get title() {

        return this.actor.name;
    }

    /** @override */
    _configureRenderOptions(options) {

        super._configureRenderOptions(options);

        if (this.document.limited) options.parts = ["header"]
        else options.parts = ["header", "main"];
    }

    /** @override */
    async _prepareContext(options) {

        // Creates basic datamodel, which is used to fill the HTML together with Handlebars with data.

        const baseData = await super._prepareContext();

        // Get equipped items
        const hands = baseData.document.system.hands;
        hands.left = baseData.document.items.get(hands.left);
        hands.right = baseData.document.items.get(hands.right);

        const context = {

            // Set General Values
            owner: baseData.document.isOwner,
            editable: baseData.editable,
            actor: baseData.document,
            system: baseData.document.system,
            items: baseData.document.items,
            config: CONFIG.SOULSLIKE,
            isGM: baseData.user.isGM,
            effects: baseData.document.effects,
            hands: hands
        }

        this.sheetContext = context;

        return context;
    }

    /** @override */
    _onRender(context, options) {

        const tabs = new foundry.applications.ux.Tabs({navSelector: ".tabs", contentSelector: ".content", initial: "tab1"});
        tabs.bind(this.element);

        const tabs2 = new foundry.applications.ux.Tabs({navSelector: ".tabs2", contentSelector: ".content2", initial: "tab2-1"});
        tabs2.bind(this.element);
    }

    /**
     * Handle dropping of an item reference or item data onto the actor sheet.
     * @param {DragEvent} event
     * @param {object} data
     * @protected
     */
    async _onDropItem(event, data) {
        // Get the item that was dropped
        const item = await Item.fromDropData(data);
        if (!item) return;

        // Find the hand slot that was dropped on, if any
        const hand = event.target.closest("[data-hand]")?.dataset.hand;

        // We only want to handle equipping weapons into hand slots
        if (hand && item.type === "weapon") {
            console.log(`Equipping ${item.name} to ${hand} hand.`);

            // Prepare the update data to place the item in the hand slot
            const updateData = {
                [`system.hands.${hand}`]: item.toObject()
            };

            // Update the actor
            return this.actor.update(updateData);
        }
        // Fallback to default handling
        return super._onDropItem(event, data);
    }
}