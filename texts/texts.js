const texts = {
  menuT: {
    text: "Добро пожаловать в наш магазин, чтобы купить перейдите в наш телеграм канал \n https://t.me/+Jkwhb7ah5o5kZjQy",
  },
  adminMenu: {
    name: " ",
    text: `Здравствуйте ${this.name}, вы администратор, выберите пожалуйста категорию`,
    reply_markup: [
      {
        title: "Меню с товароми",
        callback: "itemsMenu",
      },
      {
        title: "Добавить категорию",
        callback: "addCategory",
      },
      {
        title: "Добавить нового администратора",
        callback: "addAdmin",
      },
      {
        title: "Просмотреть от лица покупателя",
        callback: "buyerView",
      },
    ],
    notAdmin: "Извините, но вы не являетесь администратором",
  },
  itemsMenu: {
    text: "Выберите дейтсвие",
    reply_markup: [
      {
        title: "Добавить товар",
        callback: "addItem",
      },
      {
        title: "Удалить товар",
        callback: "deleteItem",
      },
      {
        title: "Вернуться в меню",
        callback: "backAdmin",
      },
    ],
  },
  buyerView: {
    text: "Выберите категорию",
    reply_markup: [
      {
        title: "Просмотреть товары",
        callback: "checkItems",
      },
      {
        title: "Вернуться в панель админа",
        callback: "backAdmin",
      },
    ],
  },
};

module.exports = texts;
