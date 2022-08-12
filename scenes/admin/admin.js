const { Telegraf, Scenes, Markup, session, Composer } = require("telegraf");
const { adminMenu, buyerView } = require("../../texts/texts");

const adminAction = new Composer();

adminAction.action("addItem", async (ctx) => {
  console.log("addItem");

  ctx.scene.enter("addItemWizard");
});

adminAction.action("DeleteItem", async (ctx) => {});

adminAction.action("addAdmin", async (ctx) => {
  ctx.scene.enter("addAdminWizard");
});

adminAction.action("backAdmin", async (ctx) => {
  const { users } = require("../../db/mongo");
  const user = await users.findOne({ id: ctx.from.id });
  adminMenu.name = ctx.from.first_name;
  if (user.isAdmin) {
    await ctx.reply(
      adminMenu.text,
      Markup.inlineKeyboard(
        adminMenu.reply_markup.map((item) => {
          return [Markup.button.callback(item.title, item.callback)];
        })
      )
    );
  } else {
    await ctx.reply(adminMenu.notAdmin);
  }
});

adminAction.action("buyerView", async (ctx) => {
  const menu = require("../../index");
  await menu(ctx, (isAdmin = true));
});

const adminScene = new Scenes.WizardScene(
  "adminWizard",
  async (ctx) => {
    const { users } = require("../../db/mongo");
    const user = await users.findOne({ id: ctx.from.id });
    adminMenu.name = ctx.from.first_name;
    if (user.isAdmin) {
      await ctx.reply(
        adminMenu.text,
        Markup.inlineKeyboard(
          adminMenu.reply_markup.map((item) => {
            return [Markup.button.callback(item.title, item.callback)];
          })
        )
      );
      ctx.wizard.next();
    } else {
      await ctx.reply(adminMenu.notAdmin);
      return ctx.scene.leave();
    }
  },
  adminAction
);

module.exports = adminScene;
