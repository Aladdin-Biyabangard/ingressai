import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";
import { initAll } from "@amplitude/unified";

export const initAmplitude = () => {
  const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

  const sessionReplayTracking = sessionReplayPlugin();
  amplitude.add(sessionReplayTracking);

  amplitude.init(API_KEY, {
    defaultTracking: true,
  });

  initAll(API_KEY, {
    sessionReplay: {
      sampleRate: 1,
    },
  });
};

export const logEvent = (eventName, eventProperties) => {
  amplitude.track(eventName, eventProperties);
};

logEvent("Test Event", { test: true });
