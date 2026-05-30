// 価格計算ユーティリティ
// 小計・消費税・送料から請求総額を算出する。

const TAX_RATE = 0.1; // 消費税 10%
const FREE_SHIPPING_THRESHOLD = 5000; // 5,000円以上で送料無料
const SHIPPING_FEE = 500;

// 消費税額を計算する
export const calculateTax = (subtotal) => {
  // NOTE: 端数は切り捨てるべきだが、ここでは切り上げてしまっている（バグ）
  return Math.ceil(subtotal * TAX_RATE);
};

// 送料を計算する
export const calculateShipping = (subtotal) => {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
};

// 請求総額（小計 + 消費税 + 送料）を計算する
export const calculateTotal = (subtotal) => {
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  return subtotal + tax + shipping;
};
