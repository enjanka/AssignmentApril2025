const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const mjml = require("mjml");

function loadOrderData(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function transformData(data) {
  const customer = data.relatedParty.find(p => p.role === "customer");
  const address = customer.orderAadress;

  const products = data.productOrderItem.map(item => {
    const characteristics = item.productOffering.productCharacteristic || [];
    const getChar = name => characteristics.find(c => c.name === name)?.value || "";

    const subProducts = (item.productOrderItem || []).filter(sub => {
      return sub.price?.taxIncludedAmount?.value !== null &&
             sub.price?.taxIncludedAmount?.value !== undefined;
    }).map(sub => ({
      name: sub.productOffering.description || sub.productOffering.name,
      price: `${sub.price.taxIncludedAmount.value} EUR`
    }));

    return {
      name: item.productOffering.description,
      storage: getChar("storage"),
      color: getChar("color"),
      price: `${item.itemPrice.price.taxIncludedAmount.value} EUR`,
      subProducts
    };
  });

  const discount = data.orderTotalPrice.priceAlteration?.[0]?.price?.taxIncludedAmount?.value || 0;
  const priceWithTax = data.orderTotalPrice.price.taxIncludedAmount.value;

  return {
    customerName: customer.name,
    shippingAddress: `${address.streetName} ${address.streetNumber}, Apt ${address.apartmentNumber}, ${address.city}, ${address.country} ${address.postalCode}`,
    products,
    totalPrice: `${priceWithTax} EUR`,
    priceWithoutDiscount: `${priceWithTax + discount} EUR`,
    contact: data.relatedParty.find(p => p.role === "provider")?.phoneNumber || "",
    facebook: "https://facebook.com/device-shop",
    twitter: "https://twitter.com/device-shop",
    instagram: "https://instagram.com/device-shop",
    privacyPolicy: "https://device-shop.com/privacy",
    termsOfService: "https://device-shop.com/terms"
  };
}

function generateEmail() {
  const dataPath = path.join(__dirname, "src", "json", "orderBasket.json");
  const templatePath = path.join(__dirname, "src", "mjml", "index.mjml");

  const orderData = loadOrderData(dataPath);
  const templateData = transformData(orderData);

  const mjmlTemplate = fs.readFileSync(templatePath, "utf8");
  const compiled = Handlebars.compile(mjmlTemplate);
  const filledMjml = compiled(templateData);

  const htmlOutput = mjml(filledMjml);
  fs.writeFileSync(path.join(__dirname, "output.html"), htmlOutput.html);
}

generateEmail();
