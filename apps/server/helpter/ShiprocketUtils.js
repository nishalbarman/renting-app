const cache = require("memory-cache");

class ShiprocketUtils {
  static async shipRocketLogin() {
    try {
      let shipRocketAuthToken = cache.get("shipRocketAuthToken");

      if (!shipRocketAuthToken) {
        const response = await fetch(
          `https://apiv2.shiprocket.in/v1/external/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: process.env.SHIPROCKET_EMAIL,
              password: process.env.SHIPROCKET_PASSWORD,
            }),
          }
        );
        const data = await response.json();

        cache.put("shipRocketAuthToken", data.token, 864000000); // 864000000 means 10 days
        return data.token;
      }

      return shipRocketAuthToken;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async createShiprocketOrder(
    orderGroupID,
    channelId,
    user,
    address,
    orderDetails
  ) {
    const date = new Date();

    const shiprocketOrder = {
      order_id: orderGroupID,
      order_date: date.toLocaleDateString(),
      pickup_location: "Primary",
      channel_id: channelId,

      billing_customer_name: user.name,
      billing_address: `${address.prefix}, ${address.streetName}, ${address.city}, ${address.state}, ${address.postalCode}`,
      billing_city: address.city,
      billing_pincode: address.postalCode,
      billing_state: address.state,
      billing_country: address.country,
      billing_email: user.email,
      billing_phone: user.mobileNo,
      shipping_is_billing: true,
      order_items: orderDetails.order.map((order_item) => ({
        name: order_item.title,
        sku: order_item.product,
        units: order_item.quantity,
        selling_price: order_item.price,
      })),
      payment_method: "Prepaid",
      sub_total: orderDetails.totalPrice,
      length: 10,
      breadth: 15,
      height: 20,
      weight: 2.5,
    };

    const shipRocketAuthToken = await this.shipRocketLogin();

    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/orders/create/adhoc`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${shipRocketAuthToken}`,
        },
        body: JSON.stringify(shiprocketOrder),
      }
    );
  }
}

module.exports = ShiprocketUtils;
