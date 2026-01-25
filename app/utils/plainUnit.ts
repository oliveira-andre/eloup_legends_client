export default function plainUnit(price: number) {
  const plainPrice = price.toString();
  return plainPrice.slice(0, plainPrice.length - 2);
}