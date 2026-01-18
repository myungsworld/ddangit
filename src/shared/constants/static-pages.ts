// Static page content constants
// Centralized content for legal and informational pages

export const SITE_INFO = {
  name: 'ddangit',
  nameKorean: '딴짓거리들',
  tagline: 'Quick mini-games to play during breaks',
  email: 'myungsworld@gmail.com',
  domain: 'ddangit.vercel.app',
  lastUpdated: 'January 2025',
} as const;

export const ABOUT_CONTENT = {
  mission: {
    title: 'Our Mission',
    description: `ddangit (딴짓거리들) is a collection of quick, browser-based mini-games designed for those short breaks in your day. Whether you're waiting for a meeting, taking a coffee break, or just need a quick mental refresh, our games are here for you.`,
    nameOrigin: `The name "ddangit" comes from Korean slang meaning "doing something else" or "goofing off" - because sometimes you just need a moment to step away and play.`,
  },
  features: [
    {
      icon: '⚡',
      title: 'Instant Play',
      description: 'No downloads, no sign-ups, no waiting. Just tap and play instantly in your browser.',
    },
    {
      icon: '🎮',
      title: 'Variety of Games',
      description: 'From reaction tests to puzzle games, we have something for every mood and skill level.',
    },
    {
      icon: '🏆',
      title: 'Daily Rankings',
      description: 'Compete with others and see where you stand on our daily leaderboards.',
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'All games are optimized for both desktop and mobile devices.',
    },
  ],
  gameDescriptions: {
    'reaction-speed': {
      icon: '⚡',
      name: 'Reaction Speed Test',
      description: 'Test your reflexes! Wait for the screen to turn green, then tap as fast as you can. Compare your reaction time with players worldwide and see if you can beat the average of 250ms.',
    },
    'sand-tetris': {
      icon: '🧱',
      name: 'Sand Tetris',
      description: 'A unique twist on the classic! Instead of clearing lines, connect same-colored pixels horizontally. Watch as sand physics creates satisfying chain reactions. Strategic placement is key to high scores.',
    },
    'block-blast': {
      icon: '🧩',
      name: 'Block Blast',
      description: 'Place blocks strategically on the grid to complete rows and columns. Plan ahead and create combos for massive scores. How long can you keep the board clear?',
    },
    'color-chain': {
      icon: '🔗',
      name: 'Color Chain',
      description: 'Tap matching colors in sequence to build chains and multiply your score. As you level up, more colors appear. Can you keep track of them all?',
    },
    'tariff-dodge': {
      icon: '📦',
      name: 'Tariff Dodge',
      description: 'Dodge falling obstacles in this fast-paced survival game. The longer you survive, the higher your score. Quick reflexes and good positioning are essential!',
    },
    'color-match': {
      icon: '🎨',
      name: 'Color Match (Stroop Test)',
      description: 'A brain teaser based on the famous Stroop effect! Match the color of the text, not what it says. This cognitive challenge tests your mental processing speed.',
    },
  },
  technology: 'ddangit is built using cutting-edge web technologies including Next.js, React, and TypeScript. This ensures fast loading times, smooth gameplay, and a great experience across all devices.',
} as const;

export const TERMS_CONTENT = {
  sections: [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using ddangit (${SITE_INFO.domain}), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.`,
    },
    {
      title: 'Description of Service',
      content: 'ddangit provides free browser-based mini-games for entertainment purposes. Our service includes various games with daily leaderboards and score tracking.',
    },
    {
      title: 'User Conduct',
      content: 'You agree to use our service only for lawful purposes. You must not attempt to manipulate rankings, exploit bugs, or interfere with the normal operation of the service.',
    },
    {
      title: 'User-Generated Content',
      content: 'When you submit a nickname for the leaderboard, you grant us permission to display it publicly. Nicknames that are offensive, inappropriate, or violate any laws will be removed without notice.',
    },
    {
      title: 'Intellectual Property',
      content: 'All games, graphics, and content on ddangit are the property of ddangit or its licensors. You may not copy, modify, or distribute any part of our service without permission.',
    },
    {
      title: 'Disclaimer of Warranties',
      content: 'Our service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or free of harmful components.',
    },
    {
      title: 'Limitation of Liability',
      content: 'To the maximum extent permitted by law, ddangit shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.',
    },
    {
      title: 'Advertisements',
      content: 'Our service displays advertisements through Google AdSense. These ads help us keep the service free. By using our service, you agree to view these advertisements.',
    },
    {
      title: 'Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.',
    },
    {
      title: 'Contact',
      content: `If you have any questions about these Terms of Service, please contact us at ${SITE_INFO.email}.`,
    },
  ],
} as const;

export const PRIVACY_CONTENT = {
  sections: [
    {
      title: 'Information We Collect',
      content: 'We do not collect any personal information directly. However, we use third-party services that may collect information used to identify you.',
    },
    {
      title: 'Third-Party Services',
      content: 'We use the following third-party services:',
      list: [
        'Google AdSense - for displaying advertisements',
        'Google Analytics - for analyzing website traffic',
      ],
      additionalContent: 'These services may use cookies and similar technologies to collect information about your browsing activity.',
    },
    {
      title: 'Cookies',
      content: 'This website uses cookies to enhance user experience and serve personalized advertisements. You can choose to disable cookies through your browser settings.',
    },
    {
      title: 'Google AdSense',
      content: 'Google uses cookies to serve ads based on your prior visits to this website or other websites.',
      link: {
        text: 'Google Ads Settings',
        url: 'https://www.google.com/settings/ads',
        description: 'You may opt out of personalized advertising by visiting',
      },
    },
    {
      title: 'Local Storage',
      content: 'We use browser local storage to save your game preferences and temporary game data. This data is stored only on your device and is not transmitted to our servers.',
    },
    {
      title: "Children's Privacy",
      content: 'Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.',
    },
    {
      title: 'Data Retention',
      content: 'Leaderboard nicknames and scores are stored on our servers and reset daily. We do not retain personal information beyond what is necessary for the operation of our service.',
    },
    {
      title: 'Changes to This Policy',
      content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.',
    },
    {
      title: 'Contact Us',
      content: `If you have any questions about this Privacy Policy, please contact us at ${SITE_INFO.email}.`,
    },
  ],
} as const;

export const CONTACT_CONTENT = {
  intro: "We'd love to hear from you! Whether you have feedback, suggestions, bug reports, or just want to say hi, feel free to reach out.",
  methods: [
    {
      icon: '📧',
      title: 'Email',
      description: 'For general inquiries and feedback',
      value: SITE_INFO.email,
      link: `mailto:${SITE_INFO.email}`,
    },
  ],
  topics: [
    {
      title: '🐛 Bug Reports',
      description: "Found something that doesn't work right? Let us know the game name, what happened, and what device/browser you were using.",
    },
    {
      title: '💡 Game Ideas',
      description: 'Have an idea for a new mini-game? We\'re always looking for inspiration!',
    },
    {
      title: '🎮 Feedback',
      description: 'Love a game? Hate a game? Tell us what you think and how we can improve.',
    },
    {
      title: '🤝 Business Inquiries',
      description: 'For partnership or business-related matters, please reach out via email.',
    },
  ],
  responseTime: 'We typically respond within 1-2 business days.',
} as const;
