import './scss/styles.scss'; 
import { cloneTemplate, ensureElement } from './utils/utils'; 
import { api } from './components/ShopAPI'; 
import { EventEmitter } from './components/base/events'; 
import { Page } from './components/page';
import { Card, CardPreview} from './components/card';
import { Modal } from './components/modalView';
import { Basket, CardBasket } from './components/basket';
import { SettingsOrder } from './components/orderSettings';
import { InfoUser } from './components/userContactInfo';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { ProductModel } from './components/ProductModel';
import { OrderModel } from './components/OrderModel';
import { PaymentOption } from "./types/index"; 

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

const cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement; 
const cardTemplate = ensureElement('#card-catalog') as HTMLTemplateElement; 

api.getProducts() 
  .then((data) => { 
    productModel.setProductsList(data.items); 
  }) 
  .catch((err) => console.log(err)); 

events.on('product_items:set_items', () => { 
  const itemsHTMLArray = productModel.getProductsList().map(item => new Card(cloneTemplate(cardTemplate), events).render(item)); 
  page.render({ 
    displayedProductList: itemsHTMLArray, 
  }); 
}); 

events.on('order_items:change_order', () => { 
  const counter = orderModel.getProductCount(); 
  page.render({ 
    cartItemCount: counter, 
  }); 
}); 

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

events.on('basketIcon:click', () => { 
  renderBasket(); 
  modal.open(); 
}); 

events.on('deleteProduct:click', ({ id }: { id: string }) => { 
  orderModel.removeProduct(id); 
}); 

function renderSettingsOrder() { 
  const payment = orderModel.getPaymentMethod(); 
  const address = orderModel.getDeliveryAddress(); 
  let error = ''; 
  let isValid = false; 

  if (payment === '') { 
    error = 'Выберите способ оплаты'; 
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
    modalContent: orderHTML, 
  }); 
} 

events.on('placeOrder:click', () => { 
  renderSettingsOrder(); 
}); 

events.on('payment:click', ({ paymentOrder }: { paymentOrder: PaymentOption }) => { 
  orderModel.editOrder({ payment: paymentOrder }); 
  renderSettingsOrder(); 
}); 

events.on('inputAddress:change', ({ value }: { value: string }) => { 
  orderModel.editOrder({ address: value }); 
  renderSettingsOrder(); 
}); 

function renderUserInfo() { 
  const email = orderModel.getUserEmail(); 
  const phone = orderModel.getUserPhone(); 
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
    modalContent: userInfoHTML, 
  }); 
} 

events.on('settingsNext:click', () => { 
  renderUserInfo(); 
}); 

events.on('inputEmail:change', ({ value }: { value: string }) => { 
  orderModel.editOrder({ email: value }); 
  renderUserInfo(); 
}); 

events.on('inputPhone:change', ({ value }: { value: string }) => { 
  orderModel.editOrder({ phone: value }); 
  renderUserInfo(); 
}); 

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

events.on('success:click', () => { 
  modal.close(); 
  const counter = orderModel.getProductCount(); 
  page.render({ 
    cartItemCount: counter, 
  }); 
}); 
