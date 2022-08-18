const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");

const backAdmin = new Composer();

backAdmin.action("backAdmin", async (ctx) => {
  ctx.scene.enter("adminWizard");
});

const addAdminScene = new Scenes.WizardScene(
  "addAdminWizard",
  async (ctx) => {
    ctx.reply(
      "Введите id пользователя, которого вы хотите добавить в администраторы",
      Markup.inlineKeyboard([[Markup.button.callback("Назад", "backAdmin")]])
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.update.callback_query?.data === "backAdmin") {
      ctx.scene.enter("adminWizard");
    } else {
      const { users } = require("../../db/mongo");
      if (!isNaN(parseInt(ctx.update.message.text))) {
        const id = parseInt(ctx.update.message.text);
        const user = await users.findOne({ id: id });
        if (user) {
          await users.updateOne({ id: id }, { $set: { isAdmin: true } });
          await ctx.reply(
            `Пользователь ${user.name} добавлен в администраторы`
          );
          ctx.scene.leave();
        } else {
          await ctx.reply(
            `Пользователь с id: ${id} не найден, попробуйте еще раз`
          );
          await ctx.scene.reenter();
        }
      } else {
        ctx.reply("Введите число");
        return ctx.scene.reenter();
      }
    }
  }
);

module.exports = addAdminScene;
