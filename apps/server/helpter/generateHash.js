import jsSHA from "jssha";

const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT;

export default function generateHash(pay) {
  const hashString = `${PAYU_MERCHANT_KEY}|${pay.txnid}|${pay.amount}|${pay.productinfo}|${pay.firstname}|${pay.email}|${pay.udf1}||||||||||${PAYU_MERCHANT_SALT}`;

  const sha = new jsSHA("SHA-512", "TEXT");

  sha.update(hashString);

  //Getting hashed value from sha module
  const hash = sha.getHash("HEX");
  return hash;
}

// const hashString =
//   PAYU_MERCHANT_KEY +
//   "|" +
//   pay.txnid +
//   "|" +
//   pay.amount +
//   "|" +
//   pay.productinfo +
//   "|" +
//   pay.firstname +
//   "|" +
//   pay.email +
//   "|" +
//   "||||||||||" +
//   PAYU_MERCHANT_SALT;
