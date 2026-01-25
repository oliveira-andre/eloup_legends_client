export default function decimalUnit(price: number) {
  const plainPrice = price.toString();
  return plainPrice.slice(plainPrice.length - 2, plainPrice.length);
}