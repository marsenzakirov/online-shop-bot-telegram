const { Telegraf, Scenes, Markup, session } = require("telegraf");
const { MongoClient } = require("mongodb");

const client = new MongoClient(
  "mongodb+srv://marsen:marsen12@cluster0.zqiez6t.mongodb.net/?retryWrites=true&w=majority"
);

try {
  client.connect();
  const items = client.db("shop").collection("items");
} catch (error) {
  console.log(error);
}

const chooseCategoryItem = require("./scenes/chooseCategoryItem");

const BotToken = "5370802240:AAGda6RIKWDhkiMXMcSFnw4E2B9jdVH1DT4";

const bot = new Telegraf(BotToken);

const stage = new Scenes.Stage([chooseCategoryItem]);
bot.use(session());
bot.use(stage.middleware());

async function menu(ctx, isFirst = false) {
  props = {
    text: "Добро пожаловать в наш магазин, выберите категорию",
    reply_markup: [
      {
        title: "Просмотреть товары",
        callback: "checkItems",
      },
    ],
  };
  if (isFirst) {
    await ctx.reply(
      props.text,
      Markup.inlineKeyboard([
        [Markup.button.callback("Просмотреть товары", "checkItems")],
      ])
    );
  } else {
    await ctx.editMessageText(props.text);
    await ctx.editMessageReplyMarkup({
      inline_keyboard: [
        props.reply_markup.map((item) => {
          return { text: item.title, callback_data: item.callback };
        }),
      ],
    });
  }
}

bot.start(async (ctx) => {
  console.log(ctx.from);
  menu(ctx, (isFirst = true));
});

bot.action("menu", async (ctx) => {
  await menu(ctx);
});

bot.action("checkItems", async (ctx) => {
  await ctx.editMessageText("Выберите категорию");
  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [{ text: "Платье", callback_data: "checkDress" }],
      [{ text: "Штаны", callback_data: "pants" }],
      [{ text: "Назад", callback_data: "menu" }],
    ],
  });
});

bot.hears("/chooseCategoryItem", async (ctx) => {
  try {
    ctx.scene.enter("chooseCategoryItem");
  } catch (error) {
    console.log(error);
  }
});

bot.hears("/owner", async (ctx) => {
  try {
  } catch (error) {
    console.log(error);
  }
});
bot.launch();
