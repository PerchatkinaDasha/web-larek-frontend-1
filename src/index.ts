import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { api } from './components/ShopAPI';
import { EventEmitter } from './components/base/events';
import { Page, Card, Modal, CardPreview, Basket, CardBasket, SettingsOrder, InfoUser, OrderSuccessPage } from './components/view';
import { ProductModel, OrderModel } from './components/models';
import { PaymentOption } from "./types/index";

// Создание экземпляров классов для управления состоянием приложения
const events = new EventEmitter();
const productModel = new ProductModel(events);
const orderModel = new OrderModel(events);
const page = new Page(ensureElement('.page'), events);
const modal = new Modal(ensureElement('#modal-container'), events);
const cardPreview = new CardPreview(cloneTemplate('#card-preview'), events);
const basket = new Basket(cloneTemplate('#basket'), events);
const orderSettings = new SettingsOrder(cloneTemplate('#order'), events);
const userInfo = new InfoUser(cloneTemplate('#contacts'), events);
const succesPage = new OrderSuccessPage(cloneTemplate('#success'), events);

// Шаблоны для карточек товара и корзины
const cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
const cardTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;

// Получение списка товаров с сервера
api
  .getProducts()
  .then((data) => {
    productModel.setProductsList(data.items); // Сохранение списка товаров в модели
  })
  .catch((err) => console.log(err)); // Обработка ошибок

// Отрисовка списка товаров на главной странице
events.on('product_items:set_items', () => {
  const itemsHTMLArray = productModel.getProductsList().map(item => new Card(cloneTemplate(cardTemplate), events).render(item));
  page.render({
    displayedProductList: itemsHTMLArray, // Обновляем отображаемые товары
  });
});

// Обновление счетчика товаров в корзине в шапке страницы
events.on('order_items:change_order', () => {
  const counter = orderModel.getProductCount();
  page.render({
    cartItemCount: counter, // Передаем количество товаров в корзине
  });
});

// Открытие модального окна с информацией о карточке товара
events.on('card:click', ({ id }: { id: string }) => {
  modal.open(); // Открываем модальное окно
  const objProduct = productModel.getProduct(id); // Получаем информацию о товаре
  const cardHTML = cardPreview.render(objProduct); // Генерируем HTML для карточки товара
  modal.render({
    modalContent: cardHTML, // Отображаем карточку товара в модальном окне
  });

  // Проверяем, есть ли товар в корзине
  const arrBasket = orderModel.getProductIds();
  if (arrBasket.includes(id)) {
    cardPreview.buttonText('Из корзины');
  } else {
    cardPreview.buttonText('В корзину');
  }
});

// Добавление/удаление товара из корзины через карточку товара
events.on('inBasket:click', ({ id }: { id: string }) => {
  const arrBasket = orderModel.getProductIds();
  if (arrBasket.includes(id)) {
    orderModel.removeProduct(id); // Удаляем товар из корзины
    cardPreview.buttonText('В корзину');
  } else {
    orderModel.addProduct(id); // Добавляем товар в корзину
    cardPreview.buttonText('Из корзины');
  }
});

// Функция отрисовки содержимого корзины
function renderBasket() {
  const itemsOrder = orderModel.getProductIds();
  const itemsHTMLArray = productModel.getProductsArr(itemsOrder).map((item, index) => {
    return new CardBasket(cloneTemplate(cardBasketTemplate), events).render({
      title: item.title,
      price: item.price,
      IndexITem: index + 1,
      id: item.id,
    });
  });

  const totalBasket = productModel.getTotalBasket(itemsOrder); // Общая сумма корзины
  const isValid = totalBasket > 0; // Проверка на пустую корзину
  const basketHTML = basket.render({
    itemsInCart: itemsHTMLArray,
    total: totalBasket,
    valid: isValid,
  });

  modal.render({
    modalContent: basketHTML, // Отображаем содержимое корзины в модальном окне
  });
}

// открыть модальное окно корзины
events.on('basketIcon:click', () => {
    modal.open();
    renderBasket();
  })

// Открытие корзины
events.on('basketIcon:click', () => {
  modal.open();
  renderBasket();
});

// Удаление товара из корзины
events.on('deleteProduct:click', ({ id }: { id: string }) => {
  orderModel.removeProduct(id); // Удаляем товар из корзины
  renderBasket(); // Перерисовываем содержимое корзины
});

// Функция отрисовки формы выбора оплаты и доставки
function renderSettingsOrder() {
  const payment = orderModel.getPaymentMethod(); // Текущий метод оплаты
  const address = orderModel.getDeliveryAddress(); // Текущий адрес доставки
  let error = '';
  let isValid = false;

  if (payment === '') {
    error = 'Выберите способ оплаты'; // Сообщение об ошибке
  } else if (address === '') {
    error = 'Введите адрес доставки заказа';
  } else {
    isValid = true;
  }

  const orderHTML = orderSettings.render({
    address: address,
    payment: payment,
    error: error,
    valid: isValid,
  });

  modal.render({
    modalContent: orderHTML, // Отображаем форму оплаты и доставки
  });
}

// Открытие формы выбора оплаты и доставки
events.on('placeOrder:click', () => {
  renderSettingsOrder();
});

// Выбор способа оплаты
events.on('payment:click', ({ paymentOrder }: { paymentOrder: PaymentOption }) => {
  orderModel.editOrder({ payment: paymentOrder }); // Сохраняем метод оплаты
  renderSettingsOrder();
});

// Ввод адреса доставки
events.on('inputAddress:change', ({ value }: { value: string }) => {
  orderModel.editOrder({ address: value }); // Сохраняем адрес доставки
  renderSettingsOrder();
});

// Функция отрисовки формы ввода данных пользователя
function renderUserInfo() {
  const email = orderModel.getUserEmail(); // Email пользователя
  const phone = orderModel.getUserPhone(); // Телефон пользователя
  let error = '';
  let isValid = false;

  if (email === '') {
    error = 'Введите email';
  } else if (phone === '') {
    error = 'Введите телефон';
  } else {
    isValid = true;
  }

  const userInfoHTML = userInfo.render({
    email: email,
    phone: phone,
    error: error,
    valid: isValid,
  });

  modal.render({
    modalContent: userInfoHTML, // Отображаем форму ввода данных пользователя
  });
}

// Открытие формы ввода данных пользователя
events.on('settingsNext:click', () => {
  renderUserInfo();
});

// Ввод почты 
events.on('inputEmail:change', ({ value }: { value: string }) => {
  orderModel.editOrder({ email: value }); // Сохраняем email
  renderUserInfo();
});

// Ввод телефона
events.on('inputPhone:change', ({ value }: { value: string }) => {
  orderModel.editOrder({ phone: value }); // Сохраняем телефон
  renderUserInfo();
});

// Открытие итоговой формы
events.on('userInfoNext:click', () => {
  const itemsOrder = orderModel.getProductIds();
  const itemsOrderNotNull = productModel.getProductsArrNotNull(itemsOrder); // Фильтруем пустые товары
  const totalBasket = productModel.getTotalBasket(itemsOrderNotNull);
  orderModel.editOrder({ items: itemsOrderNotNull }); // Сохраняем заказ

  const objOrder = orderModel.getOrder();
  api
    .placeOrder({
      payment: objOrder.payment,
      email: objOrder.email,
      phone: objOrder.phone,
      address: objOrder.address,
      total: totalBasket,
      items: objOrder.items,
    })
    .then((data) => {
      const succesHTML = succesPage.render({
        total: data.total,
      });

      modal.render({
        modalContent: succesHTML, // Отображаем страницу успеха заказа
      });

      // Сбрасываем данные заказа
      orderModel.editOrder({
        payment: '',
        email: '',
        phone: '',
        address: '',
        items: [],
      });
    })
    .catch((err) => console.log(err));
});

// Возврат к покупкам
events.on('success:click', () => {
  modal.close();
  const itemsHTMLArray = productModel.getProductsList().map(item => new Card(cloneTemplate(cardTemplate), events).render(item));
  const counter = orderModel.getProductCount();
  page.render({
    displayedProductList: itemsHTMLArray, // Отображаем список товаров
    cartItemCount: counter, // Обновляем счетчик корзины
  });
});