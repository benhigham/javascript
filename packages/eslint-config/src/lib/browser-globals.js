/**
 * Browser globals that are confusing when used without an explicit `window.`
 * prefix. Each entry produces an error from `no-restricted-globals` with a
 * message explaining why the global is restricted and how to fix the
 * reference.
 *
 * Originally lifted from `facebook/create-react-app/packages/confusing-browser-globals`
 * and re-audited against modern browser semantics. Entries that are both
 * non-standard / removed from spec **and** not a plausible identifier
 * collision (`opera`, `defaultStatus`, `defaultstatus`) have been dropped.
 * @see {@link https://github.com/facebook/create-react-app/tree/main/packages/confusing-browser-globals}
 */
export const confusingGlobals = [
  {
    name: 'addEventListener',
    message:
      'Bare addEventListener() targets window; if you meant an element, call it on the element directly.',
  },
  {
    name: 'blur',
    message:
      'Bare blur() calls window.blur(); if you meant an element method, call it on the element directly.',
  },
  {
    name: 'close',
    message:
      'Bare close() calls window.close(); if you meant something else, use a specific name or qualify with window.close().',
  },
  {
    name: 'closed',
    message:
      'closed shadows window.closed; rename the local identifier or qualify with window.closed.',
  },
  {
    name: 'confirm',
    message:
      'Bare confirm() calls window.confirm(); rename the function or qualify with window.confirm().',
  },
  {
    name: 'event',
    message:
      'window.event is legacy (IE-era) and non-standard; use the event argument passed to the handler.',
  },
  {
    name: 'external',
    message:
      'window.external is deprecated and effectively a no-op in modern browsers; rename the local identifier.',
  },
  {
    name: 'find',
    message:
      'window.find() is non-standard; use Array.prototype.find or a DOM query method (e.g., document.querySelector).',
  },
  {
    name: 'focus',
    message:
      'Bare focus() calls window.focus(); if you meant an element method, call it on the element directly.',
  },
  {
    name: 'frameElement',
    message:
      'frameElement shadows window.frameElement; rename the local identifier or qualify with window.frameElement.',
  },
  {
    name: 'frames',
    message:
      'frames shadows window.frames; rename the local identifier or qualify with window.frames.',
  },
  {
    name: 'history',
    message:
      'history shadows window.history; rename the local identifier or qualify with window.history.',
  },
  {
    name: 'innerHeight',
    message:
      'innerHeight shadows window.innerHeight; rename the local identifier or qualify with window.innerHeight.',
  },
  {
    name: 'innerWidth',
    message:
      'innerWidth shadows window.innerWidth; rename the local identifier or qualify with window.innerWidth.',
  },
  {
    name: 'length',
    message:
      'length shadows window.length; rename the local identifier or qualify with window.length.',
  },
  {
    name: 'location',
    message:
      'location shadows window.location; rename the local identifier or qualify with window.location.',
  },
  {
    name: 'locationbar',
    message:
      'window.locationbar is a legacy BarProp with no practical effect; rename the local identifier.',
  },
  {
    name: 'menubar',
    message:
      'window.menubar is a legacy BarProp with no practical effect; rename the local identifier.',
  },
  {
    name: 'moveBy',
    message:
      'Bare moveBy() calls window.moveBy() (a legacy method with no effect in tabbed browsers); if you meant another method, qualify it explicitly.',
  },
  {
    name: 'moveTo',
    message:
      'Bare moveTo() calls window.moveTo() (a legacy method with no effect in tabbed browsers); if you meant another method, qualify it explicitly.',
  },
  {
    name: 'name',
    message: 'name shadows window.name; rename the local identifier or qualify with window.name.',
  },
  {
    name: 'onblur',
    message:
      "onblur shadows window.onblur; prefer addEventListener('blur', …) or qualify with window.onblur.",
  },
  {
    name: 'onerror',
    message:
      "onerror shadows window.onerror; prefer addEventListener('error', …) or qualify with window.onerror.",
  },
  {
    name: 'onfocus',
    message:
      "onfocus shadows window.onfocus; prefer addEventListener('focus', …) or qualify with window.onfocus.",
  },
  {
    name: 'onload',
    message:
      "onload shadows window.onload; prefer addEventListener('load', …) or qualify with window.onload.",
  },
  {
    name: 'onresize',
    message:
      "onresize shadows window.onresize; prefer addEventListener('resize', …) or qualify with window.onresize.",
  },
  {
    name: 'onunload',
    message:
      "onunload shadows window.onunload; prefer addEventListener('pagehide', …) (unload is deprecated) or qualify with window.onunload.",
  },
  {
    name: 'open',
    message:
      'Bare open() calls window.open(); if you meant something else, use a specific name or qualify with window.open().',
  },
  {
    name: 'opener',
    message:
      'opener shadows window.opener; rename the local identifier or qualify with window.opener.',
  },
  {
    name: 'outerHeight',
    message:
      'outerHeight shadows window.outerHeight; rename the local identifier or qualify with window.outerHeight.',
  },
  {
    name: 'outerWidth',
    message:
      'outerWidth shadows window.outerWidth; rename the local identifier or qualify with window.outerWidth.',
  },
  {
    name: 'pageXOffset',
    message:
      'window.pageXOffset is a legacy alias for window.scrollX; use scrollX (qualified with window. if needed).',
  },
  {
    name: 'pageYOffset',
    message:
      'window.pageYOffset is a legacy alias for window.scrollY; use scrollY (qualified with window. if needed).',
  },
  {
    name: 'parent',
    message:
      'parent shadows window.parent; rename the local identifier or qualify with window.parent.',
  },
  {
    name: 'print',
    message:
      'Bare print() calls window.print(); if you meant a logging or debug function, use a specific name.',
  },
  {
    name: 'removeEventListener',
    message:
      'Bare removeEventListener() targets window; if you meant an element, call it on the element directly.',
  },
  {
    name: 'resizeBy',
    message:
      'Bare resizeBy() calls window.resizeBy() (a legacy method with no effect in tabbed browsers); if you meant another method, qualify it explicitly.',
  },
  {
    name: 'resizeTo',
    message:
      'Bare resizeTo() calls window.resizeTo() (a legacy method with no effect in tabbed browsers); if you meant another method, qualify it explicitly.',
  },
  {
    name: 'screen',
    message:
      'screen shadows window.screen; rename the local identifier or qualify with window.screen.',
  },
  {
    name: 'screenLeft',
    message:
      'screenLeft shadows window.screenLeft; rename the local identifier or qualify with window.screenLeft.',
  },
  {
    name: 'screenTop',
    message:
      'screenTop shadows window.screenTop; rename the local identifier or qualify with window.screenTop.',
  },
  {
    name: 'screenX',
    message:
      'screenX shadows window.screenX; rename the local identifier or qualify with window.screenX.',
  },
  {
    name: 'screenY',
    message:
      'screenY shadows window.screenY; rename the local identifier or qualify with window.screenY.',
  },
  {
    name: 'scroll',
    message:
      'Bare scroll() calls window.scroll(); if you meant an element method, call it on the element directly.',
  },
  {
    name: 'scrollbars',
    message:
      'window.scrollbars is a legacy BarProp with no practical effect; rename the local identifier.',
  },
  {
    name: 'scrollBy',
    message:
      'Bare scrollBy() calls window.scrollBy(); if you meant an element method, call it on the element directly.',
  },
  {
    name: 'scrollTo',
    message:
      'Bare scrollTo() calls window.scrollTo(); if you meant an element method, call it on the element directly.',
  },
  {
    name: 'scrollX',
    message:
      'scrollX shadows window.scrollX; rename the local identifier or qualify with window.scrollX.',
  },
  {
    name: 'scrollY',
    message:
      'scrollY shadows window.scrollY; rename the local identifier or qualify with window.scrollY.',
  },
  {
    name: 'self',
    message:
      'self shadows window.self (which equals window); rename the local identifier or use window directly.',
  },
  {
    name: 'status',
    message: 'window.status is a no-op in modern browsers; rename the local identifier.',
  },
  {
    name: 'statusbar',
    message:
      'window.statusbar is a legacy BarProp with no practical effect; rename the local identifier.',
  },
  {
    name: 'stop',
    message:
      'Bare stop() calls window.stop(); if you meant something else, use a specific name or qualify with window.stop().',
  },
  {
    name: 'toolbar',
    message:
      'window.toolbar is a legacy BarProp with no practical effect; rename the local identifier.',
  },
  {
    name: 'top',
    message: 'top shadows window.top; rename the local identifier or qualify with window.top.',
  },
];
