const { Telegraf, Scenes, session } = require("telegraf");

const addAdminScene = new Scenes.WizardScene(
  "addAdminWizzard",
  async (ctx) => {
    ctx.reply(
      "Введите id пользователя, которого вы хотите добавить в администраторы введите для выхода /leave"
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { users } = require("../../db/mongo");
    if (ctx.update.message.text == "/leave") {
      return ctx.scene.enter("adminWizzard");
    }
    if (!isNaN(parseInt(ctx.update.message.text))) {
      const id = parseInt(ctx.update.message.text);
      const user = await users.findOne({ id: id });
      if (user) {
        await users.updateOne({ id: id }, { $set: { isAdmin: true } });
        await ctx.reply(`Пользователь ${user.name} добавлен в администраторы`);
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
);

module.exports = addAdminScene;
