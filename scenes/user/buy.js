const { ObjectId } = require("mongodb");
const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");
const buy = new Composer();
const { items, users, orders } = require("../../db/mongo");

const secondStep = new Composer();

secondStep.action("buy", async (ctx) => {
  console.log(ctx.update.callback_query.from.id);
  const userId = ctx.update.callback_query.from.id;
  const itemId = ctx.session.itemId;
  const size = ctx.session.itemSize;
  const orderId = await orders.insertOne({
    user: userId,
    item: itemId,
    size: size,
    status: "Ожидает оплаты",
  });
  ctx.session.orderId = orderId.insertedId;
  await ctx.reply(
    `Ваш заказ принят. Ваш номер заказа: ${orderId.insertedId}`,
    Markup.inlineKeyboard([
      [Markup.button.callback("Оплатить", "pay")],
      [Markup.button.callback("Отменить", "cancel")],
    ])
  );
});

secondStep.action("pay", async (ctx) => {
  const userId = ctx.update.callback_query.from.id;
  const itemId = ctx.session.itemId;
  const item = await items.findOne({ _id: id });

  await ctx.replyWithInvoice(
    getInvoice(userId, item.title, item.description, item.price, item.photo)
  );
});

secondStep.action("cancel", async (ctx) => {
  await ctx.reply("Ваш заказ отменен, чтобы войти меню введите /start");
  ctx.scene.leave();
});
secondStep.action("contact", async (ctx) => {
  await ctx.reply(
    "Нажмите на кнопку, чтобы связаться с администратором",
    Markup.inlineKeyboard([
      [Markup.button.url("Связаться", "https://t.me/NZakir")],
    ])
  );
});

const buyScene = new Scenes.WizardScene(
  "buyWizard",
  async (ctx) => {
    id = new ObjectId(ctx.session.itemId);
    const item = await items.findOne({ _id: id });
    const admins = await users.find({ isAdmin: true }).toArray();
    // for (let admin of admins) {
    //   await ctx.telegram.sendMessage(
    //     admin.id,
    //     `Пользователь ${ctx.from.first_name} хочет купить товар: ${item.title} с размером ${ctx.session.itemSize} на сумму ${item.price} рублей`
    //   );
    // }
    await ctx.reply(
      `Вы хотите купить товар: ${item.title} с размером ${ctx.session.itemSize} на сумму ${item.price} рублей?`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Да", callback_data: "buy" }],
            [{ text: "Нет", callback_data: "cancel" }],
            [{ text: "Связаться с продавцом", callback_data: "contact" }],
          ],
        },
      }
    );

    return ctx.wizard.next();
  },
  secondStep
);

const getInvoice = (id, title, description, price, photo) => {
  const invoice = {
    chat_id: id, // Уникальный идентификатор целевого чата или имя пользователя целевого канала
    provider_token: process.env.PROVIDER_TOKEN, // токен выданный через бот @SberbankPaymentBot
    start_parameter: "get_access", //Уникальный параметр глубинных ссылок. Если оставить поле пустым, переадресованные копии отправленного сообщения будут иметь кнопку «Оплатить», позволяющую нескольким пользователям производить оплату непосредственно из пересылаемого сообщения, используя один и тот же счет. Если не пусто, перенаправленные копии отправленного сообщения будут иметь кнопку URL с глубокой ссылкой на бота (вместо кнопки оплаты) со значением, используемым в качестве начального параметра.
    title: `Счет на оплату товара: ${title}`, // Название продукта, 1-32 символа
    description: `Описание: ${description}`, // Описание продукта, 1-255 знаков
    currency: "RUB", // Трехбуквенный код валюты ISO 4217
    prices: [{ label: "Invoice Title", amount: 100 * price }], // Разбивка цен, сериализованный список компонентов в формате JSON 100 копеек * 100 = 100 рублей

    payload: {
      // Полезные данные счета-фактуры, определенные ботом, 1–128 байт. Это не будет отображаться пользователю, используйте его для своих внутренних процессов.
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN,
    },
  };

  return invoice;
};

module.exports = buyScene;
