export default defineAppConfig({
  global: {
    picture: {
      dark: '/images/avatar.jpg',
      light: '/images/avatar.jpg',
      alt: 'Yurii Mokryi'
    },
    meetingLink: 'https://t.me/YuriiMokryi',
    email: 'admin@digispace.pro',
    available: true
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `Yurii Mokryi • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-telegram',
      'to': 'https://t.me/YuriiMokryi',
      'target': '_blank',
      'aria-label': 'Telegram'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/Yurij2015',
      'target': '_blank',
      'aria-label': 'GitHub'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://linkedin.com/in/yurii-mokryi',
      'target': '_blank',
      'aria-label': 'LinkedIn'
    }, {
      'icon': 'i-simple-icons-upwork',
      'to': 'https://www.upwork.com/freelancers/mokryiyurii',
      'target': '_blank',
      'aria-label': 'Upwork'
    }]
  }
})
