(function () {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors.
  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  window.addEventListener('load', function () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
      .then(function (registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function () {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set
            const installingWorker = registration.installing;

            installingWorker.onstatechange = function () {
              switch (installingWorker.state) {
                case 'installed':
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  let notification = document.createElement('div')
                  notification.id = 'sw-notification'
                  notification.innerHTML = `<div class="q-notification-list q-notification-list-bottom fixed column items-end absolute">
                                              <div class="q-notification">
                                                <div class="q-alert row no-wrap shadow-2 bg-amber-9 text-white">
                                                  <div class="q-alert-side col-auto row flex-center">
                                                    <i aria-hidden="true" class="q-icon material-icons">warning</i>
                                                  </div>
                                                  <div class="q-alert-content col self-center">
                                                    <div>The new version of TrackIt! is available. Refresh the page to update?</div>
                                                  </div>
                                                  <div class="q-alert-actions col-auto gutter-xs column flex-center">
                                                    <div class="full-width">
                                                      <button tabindex="0" class="q-btn inline relative-position q-btn-item non-selectable full-width q-btn-rectangle q-btn-flat q-focusable q-hoverable q-btn-dense">
                                                        <div class="q-focus-helper"></div>
                                                        <div class="q-btn-inner row col items-center justify-start">
                                                          <div>Agree</div>
                                                        </div>
                                                      </button>
                                                    </div>
                                                    <div class="full-width">
                                                      <button tabindex="0" class="q-btn inline relative-position q-btn-item non-selectable full-width q-btn-rectangle q-btn-flat q-focusable q-hoverable q-btn-dense">
                                                        <div class="q-focus-helper"></div>
                                                        <div class="q-btn-inner row col items-center justify-start">
                                                          <div>Abort</div>
                                                        </div>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>`
                  let buttons = notification.getElementsByTagName('button'),
                    body = document.getElementsByTagName('body')[0]
                  buttons[0].addEventListener('click', (ev) => { window.location.reload() })
                  buttons[1].addEventListener('click', (ev) => { notification.remove() })
                  body.appendChild(notification)
                  // if (confirm('The new version of TrackIt! is available. Refresh the page to update?')) {
                  //   window.location.reload()
                  // }
                  break;

                case 'redundant':
                  throw new Error('The installing ' +
                                  'service worker became redundant.');

                default:
                  // Ignore
              }
            };
          }
        };
      }).catch(function(e) {
        console.error('Error during service worker registration:', e);
      });
    }
  });
})();