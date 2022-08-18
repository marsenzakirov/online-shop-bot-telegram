const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");

const send = new Composer();
const sendItemOnChannelScene = new Scenes.WizardScene(
  "sendItemOnChannelWizard",
  async (ctx) => {
    chat_id = "-1001610261064";
    item = ctx.session.item;
    itemSize = Object.entries(item.size);
    ctx.replyWithPhoto(
      `https://storage.yandexcloud.net/sadavod/${item.photo}`,
      {
        chat_id: chat_id,
        caption: `${item.title} рублей \n${item.description} \nЦена: ${item.price} \nВыберите ниже размер, чтобы начать покупку`,
        reply_markup: {
          inline_keyboard: [
            itemSize.map((pair) => {
              const [size, count] = pair;
              return {
                text: size,
                url: `https://t.me/OnlineShopSadavodBot?start=buy-${item._id}-${size}`,
              };
            }),
          ],
        },
      }
    );
    ctx.scene.enter("adminWizard");
  }
);

module.exports = sendItemOnChannelScene;
