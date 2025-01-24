import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { api } from './components/ShopAPI';
import { EventEmitter } from './components/base/events';
import { Page } from './components/page';
import { Card } from './components/card';
import { CardPreview } from './components/CardPreview';
import { Modal } from './components/Modal';
import { Basket } from './components/basket';
import { CardBasket } from './components/CardBasket';
import { SettingsOrder } from './components/SettingsOrder';
import { InfoUser } from './components/userContactInfo';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { ProductModel } from './components/ProductModel';
import { OrderModel } from './components/OrderModel';
import { PaymentOption } from "./types/index";

// Создаем экземпляры для работы с событиями, данными и компонентами
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

// Шаблоны для рендеринга карточек товаров и корзины
const cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
const cardTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;

// Получаем товары с API и сохраняем их в модели
api.getProducts()
  .then((data) => {
    productModel.setProductsList(data.items);
  })
  .catch((err) => console.log(err));

// При установке списка товаров рендерим их на странице
events.on('product_items:set_items', () => {
  const itemsHTMLArray = productModel.getProductsList().map(item => new Card(cloneTemplate(cardTemplate), events).render(item));
  page.render({
    displayedProductList: itemsHTMLArray,
  });
});

// При изменении состава товаров в корзине ререндерим корзину с товарами
events.on('order_items:change_order', () => {
  const counter = orderModel.getProductCount();
  page.render({
    cartItemCount: counter,
  });
  renderBasket(); // Рендер корзины при изменении состава
});

// Обработка клика на карточку товара, открытие модалки с подробностями
events.on('card:click', ({ id }: { id: string }) => {
  modal.open();
  const objProduct = productModel.getProduct(id);
  const cardHTML = cardPreview.render(objProduct);
  modal.render({
    modalContent: cardHTML,
  });

  const arrBasket = orderModel.getProductIds();
  if (arrBasket.includes(id)) {
    cardPreview.buttonText('Из корзины');
  } else {
    cardPreview.buttonText('В корзину');
  }
});

// Обработка клика на кнопку "В корзину" или "Из корзины"
events.on('inBasket:click', ({ id }: { id: string }) => {
  const arrBasket = orderModel.getProductIds();
  if (arrBasket.includes(id)) {
    orderModel.removeProduct(id);
    cardPreview.buttonText('В корзину');
  } else {
    orderModel.addProduct(id);
    cardPreview.buttonText('Из корзины');
  }
});

// Функция для рендеринга корзины
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

  const totalBasket = productModel.getTotalBasket(itemsOrder);
  const isValid = totalBasket > 0;
  const basketHTML = basket.render({
    itemsInCart: itemsHTMLArray,
    total: totalBasket,
    valid: isValid,
  });

  modal.render({
    modalContent: basketHTML,
  });
}

// Открытие корзины при клике на иконку корзины
events.on('basketIcon:click', () => {
  renderBasket();
  modal.open();
});

// Удаление товара из корзины
events.on('deleteProduct:click', ({ id }: { id: string }) => {
  orderModel.removeProduct(id);
  renderBasket(); // Рендерим корзину после удаления товара
});

// Функция для рендеринга страницы настроек заказа
function renderSettingsOrder() {  
  const payment = orderModel.getPaymentMethod();  
  const address = orderModel.getDeliveryAddress();  

  // Валидация через модель
  const { isValid, error } = orderModel.validateOrder();
 
  const orderHTML = orderSettings.render({  
    address: address,  
    payment: payment,  
    error: error,  
    valid: isValid,  
  });  
 
  modal.render({  
    modalContent: orderHTML,  
  });  
}  

// Обработка клика на кнопку для перехода к настройкам заказа
events.on('placeOrder:click', () => {
  renderSettingsOrder();
});

// Обработка изменения способа оплаты
events.on('payment:click', ({ paymentOrder }: { paymentOrder: PaymentOption }) => {
  orderModel.editOrder({ payment: paymentOrder });
  renderSettingsOrder();
});

// Обработка изменения адреса доставки
events.on('inputAddress:change', ({ value }: { value: string }) => {
  orderModel.editOrder({ address: value });
  // Нет необходимости вызывать renderSettingsOrder() здесь
});

// Функция для рендеринга страницы информации о пользователе
function renderUserInfo() {  
  const email = orderModel.getUserEmail();  
  const phone = orderModel.getUserPhone();  

  // Валидация через модель
  const { isValid, error } = orderModel.validateUserInfo();

  const userInfoHTML = userInfo.render({  
    email: email,  
    phone: phone,  
    error: error,  
    valid: isValid,  
  });  

  modal.render({  
    modalContent: userInfoHTML,  
  });  
}  

// Переход к вводу информации о пользователе
events.on('settingsNext:click', () => {
  renderUserInfo();
});

events.on('inputEmail:change', ({ value }: { value: string }) => {
  orderModel.editOrder({ email: value });
  renderUserInfo(); // Обновляем отображение
});

events.on('inputPhone:change', ({ value }: { value: string }) => {
  orderModel.editOrder({ phone: value });
  renderUserInfo(); // Обновляем отображение
});

// Обработка клика для подтверждения информации пользователя и оформления заказа
events.on('userInfoNext:click', () => {
  const itemsOrder = orderModel.getProductIds();
  const itemsOrderNotNull = productModel.getProductsArrNotNull(itemsOrder);
  const totalBasket = productModel.getTotalBasket(itemsOrderNotNull);
  orderModel.editOrder({ items: itemsOrderNotNull });

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
        modalContent: succesHTML,
      });

      // Очистка данных заказа после успешной отправки
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

// Обновляем счётчик корзины при закрытии модалки
events.on('modal:closed', () => {
  const counter = orderModel.getProductCount();
  page.render({ cartItemCount: counter });
});

// Обработка успешного завершения заказа
events.on('success:click', () => {
  modal.close(true); // Указываем, что нужно обновить счётчик
});