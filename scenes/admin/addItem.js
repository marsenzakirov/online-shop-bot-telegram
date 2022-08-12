const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");
const axios = require("axios");
const fs = require("fs");
const needle = require("needle");
const { upload } = require("../../db/yandex");

const backAdmin = new Composer();
const addPhoto = new Composer();
const addTitle = new Composer();
const addDescription = new Composer();
const addPrice = new Composer();
const confirmItem = new Composer();
const changeItem = new Composer();
const changePrice = new Composer();
const changeTitle = new Composer();
const changeDescription = new Composer();

const item = {};
addPhoto.on("text", async (ctx) => {
  ctx.reply("Вы отправили текст, отправьте фото");
});
addPhoto.on("photo", async (ctx) => {
  fileId = ctx.message.photo[1].file_id;
  ctx.telegram.getFileLink(fileId).then((url) => {
    needle.get(url.href, async function (error, response) {
      if (!error && response.statusCode == 200) {
        item.photo = await upload("items", response.body);
        ctx.reply("Введите название товара");
        return ctx.wizard.next();
      } else {
        console.log(error);
      }
    });
  });
});
addTitle.on("text", async (ctx) => {
  item.title = ctx.message.text;
  ctx.reply("Введите описание товара");
  return ctx.wizard.next();
});
addDescription.on("text", async (ctx) => {
  item.description = ctx.message.text;
  ctx.reply("Введите цену товара");
  return ctx.wizard.next();
});
addPrice.on("text", async (ctx) => {
  if (!isNaN(parseInt(ctx.update.message.text))) {
    item.price = parseInt(ctx.update.message.text);
    ctx.scene.enter("confirmItem");
  } else {
    ctx.reply("Введите число");
  }
});

backAdmin.action("backAdmin", async (ctx) => {
  ctx.scene.enter("adminWizard");
});

confirmItem.action("confirmItem", async (ctx) => {
  const { items } = require("../../db/mongo");
  await items.insertOne(item);
  await ctx.reply("Товар добавлен");
  ctx.scene.enter("adminWizard");
});

confirmItem.action("backConfirm", async (ctx) => {
  ctx.scene.enter("confirmItem");
});

confirmItem.action("changeItem", async (ctx) => {
  ctx.reply(
    "что вы хотите изменить?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Название", "changeTitle")],
      [Markup.button.callback("Описание", "changeDescription")],
      [Markup.button.callback("Цена", "changePrice")],
      [Markup.button.callback("Назад", "backConfirm")],
    ])
  );
  ctx.scene.enter("changeItem");
});

changeItem.on("callback_query", async (ctx) => {
  if (ctx.update.callback_query.data == "changeTitle") {
    ctx.reply("Введите новое название");
    ctx.scene.enter("changeTitle");
  }
  if (ctx.update.callback_query.data == "changeDescription") {
    ctx.reply("Введите новое описание");
    ctx.wizard.next("changeDescription");
  }
  if (ctx.update.callback_query.data == "changePrice") {
    ctx.reply("Введите новую цену");
    ctx.scene.enter("changePrice");
  }
  if (ctx.update.callback_query.data == "cancelItem") {
    ctx.scene.enter("adminWizard");
  }
});

const addItemScene = new Scenes.WizardScene(
  "addItemWizard",
  async (ctx) => {
    ctx.reply("Отправьте фото");
    return ctx.wizard.next();
  },
  addPhoto,
  addTitle,
  addDescription,
  addPrice
);
const confirmItemScene = new Scenes.WizardScene(
  "confirmItem",
  async (ctx) => {
    ctx.reply(
      `Проверьте данные и подтвердите добавление товара \n Название: ${item.title} \n Описание: ${item.description} \n Цена: ${item.price}`,
      Markup.inlineKeyboard([
        [Markup.button.callback("Добавить", "confirmItem")],
        [Markup.button.callback("Изменить", "changeItem")],
        [Markup.button.callback("отмена", "cancelItem")],
      ])
    );
    ctx.wizard.next();
  },
  confirmItem
);
const changeItemScene = new Scenes.WizardScene("changeItem", changeItem);

const changePriceScene = new Scenes.WizardScene("changePrice", changePrice);

changePrice.on("text", async (ctx) => {
  if (!isNaN(parseInt(ctx.update.message.text))) {
    item.price = parseInt(ctx.update.message.text);
    ctx.scene.enter("confirmItem");
  } else {
    ctx.reply("Введите число");
  }
});

const changeTitleScene = new Scenes.WizardScene("changeTitle", changeTitle);

changeTitle.on("text", async (ctx) => {
  item.title = ctx.message.text;
  ctx.reply("Введите новое название");
  ctx.scene.enter("confirmItem");
});

const changeDescriptionScene = new Scenes.WizardScene(
  "changeDescription",
  changeDescription
);

changeDescription.on("text", async (ctx) => {
  item.description = ctx.message.text;
  ctx.reply("Введите новое описание");
  ctx.scene.enter("confirmItem");
}),
  (module.exports = {
    addItemScene,
    changePriceScene,
    changeTitleScene,
    changeDescriptionScene,
    confirmItemScene,
    changeItemScene,
  });
