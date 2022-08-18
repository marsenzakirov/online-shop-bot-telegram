const { Telegraf, Scenes, Markup, session } = require("telegraf");
require("dotenv").config();

const adminScene = require("./scenes/admin/admin");
const addAdminScene = require("./scenes/admin/addAdmin");
const BotToken = process.env.BOT_TOKEN;

const bot = new Telegraf(BotToken);
const { users, orders, items } = require("./db/mongo");
const {
  addItemScene,
  changePriceScene,
  changeTitleScene,
  changeDescriptionScene,
  confirmItemScene,
  changeItemScene,
} = require("./scenes/admin/itemsMenu/addItem");
const buyScene = require("./scenes/user/buy");
const sendItemOnChannelScene = require("./scenes/admin/itemsMenu/sendItemOnChannel");
const itemsMenuScene = require("./scenes/admin/itemsMenu/itemsMenu");

const stage = new Scenes.Stage([
  adminScene,
  addAdminScene,
  addItemScene,
  changePriceScene,
  changeTitleScene,
  changeDescriptionScene,
  confirmItemScene,
  changeItemScene,
  itemsMenuScene,
  sendItemOnChannelScene,
  buyScene,
]);
bot.use(session());
bot.use(stage.middleware());

async function menu(ctx, isAdmin = false) {
  props = {
    text: "Добро пожаловать в наш магазин, чтобы купить перейдите в наш телеграм канал \n https://t.me/+Jkwhb7ah5o5kZjQy",
  };
  if (isAdmin) {
    await ctx.reply(
      props.text,
      Markup.inlineKeyboard([
        [Markup.button.callback("Вернуться в панель админа", "backAdmin")],
      ])
    );
  } else {
    await ctx.reply(props.text);
  }
}

bot.start(async (ctx) => {
  console.log(ctx.update.message.chat.id);
  if (ctx.startPayload === "") {
    if (ctx.update.message?.sender_chat === undefined) {
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
    }
  } else {
    ctx.session.itemId = ctx.startPayload.split("-")[1];
    ctx.session.itemSize = ctx.startPayload.split("-")[2];
    ctx.scene.enter("buyWizard");
  }
});
bot.on("channel_post", (ctx) => {
  ctx.reply("Click the button below to send a confirmation", {
    ...Markup.inlineKeyboard([
      Markup.button.url(
        "зарегистрироваться",
        "https://t.me/OnlineShopSadavodBot?start=register"
      ),
    ]),
  });
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

bot.launch();

module.exports = menu;
