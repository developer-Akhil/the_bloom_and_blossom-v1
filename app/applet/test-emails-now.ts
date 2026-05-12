import { sendContactEmail, sendOrderConfirmationEmail } from "./server/services/emailService.js";
async function main() {
  try {
    await sendContactEmail("Test User", "test@example.com", "Test Subject", "Test Message");
    console.log("Contact sent");
  } catch(e) {
    console.error("Contact error", e);
  }
  try {
    await sendOrderConfirmationEmail("test@example.com", {
      orderId: "ORDER_123",
      cart: [{name: "Item 1", price: 100, quantity: 1}],
      shippingData: {
        name: "Test",
        phone: "123",
        address: "address",
        city: "city",
        state: "state",
        pincode: "123"
      },
      total: 100
    });
    console.log("Order confirmation sent");
  } catch(e) {
    console.error("Order error", e);
  }
}
main();
