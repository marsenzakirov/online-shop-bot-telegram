const { Telegraf, Scenes, Markup, session } = require("telegraf");

const chooseCategoryItem = require("./scenes/chooseCategoryItem");
const adminScene = require("./scenes/admin/admin");
const addAdminScene = require("./scenes/admin/addAdmin");
const BotToken = "5370802240:AAGda6RIKWDhkiMXMcSFnw4E2B9jdVH1DT4";

const bot = new Telegraf(BotToken);
const { users } = require("./db/mongo");

const stage = new Scenes.Stage([chooseCategoryItem, adminScene, addAdminScene]);
bot.use(session());
bot.use(stage.middleware());

async function menu(ctx, isAdmin = false) {
  props = {
    text: "Добро пожаловать в наш магазин, выберите категорию",
    reply_markup: [
      {
        title: "Просмотреть товары",
        callback: "checkItems",
      },
    ],
  };
  if (isAdmin) {
    await ctx.reply(
      props.text,
      Markup.inlineKeyboard([
        props.reply_markup.map((item) => {
          return Markup.button.callback(item.title, item.callback);
        }),
        [Markup.button.callback("Вернуться в панель админа", "backAdmin")],
      ])
    );
  } else {
    await ctx.reply(
      props.text,
      Markup.inlineKeyboard([
        [Markup.button.callback("Просмотреть товары", "checkItems")],
      ])
    );
  }
}

bot.start(async (ctx) => {
  //check if user exists in db
  let user = await users.findOne({ id: ctx.from.id });
  if (!user) {
    await users.insertOne({
      id: ctx.from.id,
      name: ctx.from.first_name,
      cost: 0,
      cart: [],
      isAdmin: false,
    });
  }
  user = await users.findOne({ id: ctx.from.id });

  //check admin status
  if (user.isAdmin) {
    ctx.scene.enter("adminWizard");
  } else {
    menu(ctx);
  }
});
bot.on("message", async (ctx) => {
  if (ctx.message.text !== "/start") {
    await ctx.reply(
      "Добро пожаловать в наш магазин, Извинте, но я вас не понял для начала работы введите /start"
    );
  }
});
bot.action("menu", async (ctx) => {
  const user = await users.findOne({ id: ctx.from.id });
  if (user.isAdmin) {
    await menu(ctx, true);
  } else {
    await menu(ctx);
  }
});

bot.action("checkItems", async (ctx) => {
  await ctx.reply(
    "Выберите категорию",
    Markup.inlineKeyboard([
      [Markup.button.callback("Платье", "backAdmin")],
      [Markup.button.callback("Штаны", "pants")],
      [Markup.button.callback("Назад", "menu")],
    ])
  );
});

bot.hears("/chooseCategoryItem", async (ctx) => {
  try {
    ctx.scene.enter("chooseCategoryItem");
  } catch (error) {
    console.log(error);
  }
});
bot.launch();

module.exports = menu;
