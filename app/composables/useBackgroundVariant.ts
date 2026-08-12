export const useBackgroundVariant = () => {
  return useCookie<'1' | '2'>('bg-variant', { default: () => '1' })
}
