(function () {
/**
 * Simple Affiliate Tracking and Form Submission Tracker
 * - Place just before </body> on each page you want to track.
 * - Tracks page views and form submits (excluding sensitive forms).
 */

// Helper: Set cookie
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;secure`;
}

// Helper: Get cookie
function getCookie(name) {
  return document.cookie.split(';').map(c => c.trim())
    .find(c => c.startsWith(name + '='))?.split('=')[1] || null;
}

// Send tracking event
function sendTrackingEvent(type, data, eid) {
  if (!eid) return;
  fetch('https://eulerapp.com/api/1.1/wf/trackaffiliateclicksandsubmits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, eventData: data, eid }),
  }).catch(()=>{});
}

// Get EID from URL or cookie, set cookie if new
const params = new URLSearchParams(window.location.search);
const eid = params.get('eid') || getCookie('eidCookie') || 'unknown';
if (params.get('eid') && !getCookie('eidCookie')) setCookie('eidCookie', params.get('eid'), 14);

// Track page view
sendTrackingEvent('pageView', { page: window.location.href, eid }, eid);

// Track form submissions (exclude login/signup/password reset forms)
document.querySelectorAll('form').forEach(form => {
  const action = (form.action || '').toLowerCase();
  const name = (form.name || '').toLowerCase();
  const exclude = ['login','log-in','signin','sign-in','password','reset'].some(k =>
    action.includes(k) || name.includes(k)
  );
  if (exclude) return;

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = {};
    form.querySelectorAll('input, textarea, select').forEach(input => {
      if (!input.name) return;
      // Only track email in signup forms
      if ((action.includes('signup') || name.includes('signup')) && !input.name.toLowerCase().includes('email')) return;
      formData[input.name] = input.value;
    });
    sendTrackingEvent('formSubmit', { page: window.location.href, form: name, formData }, eid);
  });
});
})();