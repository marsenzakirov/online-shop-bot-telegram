const texts = {
  menu: {
    text: "Добро пожаловать в наш магазин, выберите категорию",
    reply_markup: [
      {
        title: "Просмотреть товары",
        callback: "checkItems",
      },
    ],
  },
  adminMenu: {
    name: " ",
    text: `Здравствуйте ${this.name}, вы администратор, выберите пожалуйста категорию`,
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
        title: "Добавить нового администратора",
        callback: "AddAdmin",
      },
      {
        title: "Просмотреть от лица покупателя",
        callback: "buyerView",
      },
    ],
    notAdmin: "Извините, но вы не являетесь администратором",
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
