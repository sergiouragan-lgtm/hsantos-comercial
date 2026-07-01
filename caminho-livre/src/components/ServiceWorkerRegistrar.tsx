"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Force an immediate check for a newer sw.js instead of waiting for the browser's
        // own polling interval, so a fresh release replaces a stale cached build right away.
        registration.update().catch(() => {});
      })
      .catch(() => {
        /* offline caching is a progressive enhancement — safe to ignore failures */
      });

    // Once the new service worker takes control, reload once so the page itself
    // (not just future requests) reflects the latest build.
    let reloaded = false;
    const onControllerChange = () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);
  return null;
}
