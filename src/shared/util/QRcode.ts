export function QRcodeGenerate(money, orderId) {
  const bankId = process.env.BANK_ID;
  const accountNo = process.env.ACCOUNT_NO;
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.jpg?amount=${money}&addInfo=?${`Thanh toán hóa đơn ${orderId}`}&accountName=${'HOANG ANH HUNG'}`;
}
