export function servicePriceKey(service: {
  priceUnit?: 'project' | 'hour'
  priceCurrency?: 'USD' | 'PLN'
}) {
  const unit = service.priceUnit === 'hour' ? 'Hourly' : ''
  const currency = service.priceCurrency === 'PLN' ? 'Pln' : ''
  return `services.priceFrom${unit}${currency}`
}
