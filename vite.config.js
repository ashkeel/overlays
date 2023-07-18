const { resolve } = require('path');

module.exports = {
  base: `http://localhost:4337/static/`,
  build: {
    target: 'chrome95',
    rollupOptions: {
      input: {
        alerts: resolve(__dirname, './alerts.html'),
        brb: resolve(__dirname, 'brb.html'),
        walkin: resolve(__dirname, 'walkin.html'),
        //ticker: resolve(__dirname, 'ticker.html'),
        spinthewheel: resolve(__dirname, 'spinthewheel.html'),
        skinnychat: resolve(__dirname, 'skinnychat.html'),
        chat: resolve(__dirname, 'chat.html'),
        shitpost: resolve(__dirname, 'shitpost.html'),
        //music: resolve(__dirname, 'music.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
      },
    },
  },
};
