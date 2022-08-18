const { Telegraf, Scenes, Markup, session, Composer } = require("telegraf");

const { itemsMenu } = require("../../../texts/texts");
const itemsMenuAction = new Composer();


itemsMenuAction.action("addItem", async (ctx) => {
    ctx.scene.enter("addItemWizard");
})

const itemsMenuScene = new Scenes.WizardScene(
  "itemsMenuWizard",
  async (ctx) => {
    await ctx.reply(
      itemsMenu.text,
      Markup.inlineKeyboard([
        itemsMenu.reply_markup.map((item) => {
          return Markup.button.callback(item.title, item.callback);
        }),
      ])
    );
    ctx.wizard.next();
  },
  itemsMenuAction
);

module.exports = itemsMenuScene;
