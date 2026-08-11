import uk from './locales/uk.json'
import en from './locales/en.json'
import pl from './locales/pl.json'

export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'uk',
  messages: { uk, en, pl }
}))
