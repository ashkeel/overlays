const { resolve } = require("node:path");

module.exports = {
	base: "http://localhost:4337/static/",
	build: {
		target: "chrome95",
		rollupOptions: {
			input: {
				alerts: resolve(__dirname, "./alerts.html"),
				brb: resolve(__dirname, "brb.html"),
				walkin: resolve(__dirname, "walkin.html"),
				//ticker: resolve(__dirname, 'ticker.html'),
				spinthewheel: resolve(__dirname, "spinthewheel.html"),
				skinnychat: resolve(__dirname, "skinnychat.html"),
				shitpost: resolve(__dirname, "shitpost.html"),
				shitpostpanel: resolve(__dirname, "shitpost-panel.html"),
				//music: resolve(__dirname, 'music.html'),
				dashboard: resolve(__dirname, "dashboard.html"),
				micstatus: resolve(__dirname, "micstatus.html"),
				eightsky: resolve(__dirname, "eightsky.html"),
			},
		},
	},
};
