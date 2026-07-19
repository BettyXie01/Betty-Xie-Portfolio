(() => {
  const blockedShortcuts = new Set(["c", "x", "s", "u", "p"]);

  const stopAction = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  ["contextmenu", "copy", "cut", "dragstart"].forEach((eventName) => {
    document.addEventListener(eventName, stopAction, true);
  });

  document.addEventListener(
    "keydown",
    (event) => {
      const key = event.key.toLowerCase();

      if (event.key === "F12") {
        stopAction(event);
        return;
      }

      if ((event.ctrlKey || event.metaKey) && blockedShortcuts.has(key)) {
        stopAction(event);
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key)) {
        stopAction(event);
      }
    },
    true
  );
})();
