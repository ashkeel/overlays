interface ImportMetaEnv {
  readonly VITE_OBS_ENDPOINT: string;
  readonly VITE_OBS_PASSWORD: string;
  readonly VITE_KILOVOLT_ENDPOINT: string;
  readonly VITE_KILOVOLT_PASSWORD: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_TWITCH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
