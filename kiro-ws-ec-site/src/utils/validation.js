export const validateShippingInfo = (info) => {
  const errors = {};
  
  if (!info.name || info.name.trim().length === 0) {
    errors.name = '名前を入力してください';
  }
  
  if (!info.postalCode || !/^\d{3}-?\d{4}$/.test(info.postalCode)) {
    errors.postalCode = '正しい郵便番号を入力してください（例: 123-4567）';
  }
  
  if (!info.address || info.address.trim().length === 0) {
    errors.address = '住所を入力してください';
  }
  
  if (!info.phone || !/^0\d{9,10}$/.test(info.phone.replace(/-/g, ''))) {
    errors.phone = '正しい電話番号を入力してください';
  }
  
  return errors;
};

export const validatePaymentInfo = (info) => {
  const errors = {};
  
  if (!info.cardNumber || !/^\d{16}$/.test(info.cardNumber.replace(/\s/g, ''))) {
    errors.cardNumber = '正しいカード番号を入力してください';
  }
  
  if (!info.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(info.expiryDate)) {
    errors.expiryDate = '有効期限を入力してください（MM/YY）';
  }
  
  if (!info.cvv || !/^\d{3,4}$/.test(info.cvv)) {
    errors.cvv = 'CVVを入力してください';
  }
  
  if (!info.cardHolder || info.cardHolder.trim().length === 0) {
    errors.cardHolder = 'カード名義を入力してください';
  }
  
  return errors;
};
