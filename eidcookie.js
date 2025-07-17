(function () {
    function setCookie(name, value, days) { const expires = new Date(); expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure` }
    function getCookie(name) {
        const cookieName = `${name}=`; const cookies = document.cookie.split(';'); 
        for (let i = 0; i < cookies.length; i++) { let cookie = cookies[i].trim(); if (cookie.indexOf(cookieName) === 0) { return cookie.substring(cookieName.length, cookie.length) } }
        return null
    }
    function sendTrackingEvent(eventType, eventData, eventIdentifier) { if (!eventIdentifier) return; const data = { type: eventType, eventData: eventData, eid: eventIdentifier, }; const trackingScriptURL = 'https://eulerapp.com/api/1.1/wf/trackaffiliateclicksandsubmits'; fetch(trackingScriptURL, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(data), }).catch(() => { }) }
    function generateTrackingPayload(eid) { const pageURL = window.location.href; return { page: pageURL, eid: eid } }
    const urlParams = new URLSearchParams(window.location.search); const eid = urlParams.get('eid'); const eidCookie = getCookie('eidCookie'); if (eid && !eidCookie) { setCookie('eidCookie', eid, 30) }
    const pageViewEid = eid || eidCookie || 'unknown'; 
    const pageViewPayload = generateTrackingPayload(pageViewEid); 
    sendTrackingEvent('pageView', pageViewPayload, pageViewEid); 
    const forms = document.querySelectorAll('form'); 
    forms.forEach(form => { const formAction = form.getAttribute('action') || ''; 
    const formName = form.getAttribute('name') || ''; 
    const exclusionKeywords = ['login', 'log-in', 'signin', 'sign-in', 'password-reset', 'pwreset', 'pw-reset', 'passwordreset', 'password', 'reset']; 
    const isExcludedForm = exclusionKeywords.some(keyword => formAction.toLowerCase().includes(keyword) || formName.toLowerCase().includes(keyword)); 
    if (!isExcludedForm) { form.addEventListener('submit', event => { event.preventDefault(); const formData = {}; const formInputs = form.querySelectorAll('input, textarea, select'); 
    formInputs.forEach(input => { const inputName = input.getAttribute('name'); 
    if (inputName) { const isSignupForm = formAction.toLowerCase().includes('signup') || formName.toLowerCase().includes('signup') || formAction.toLowerCase().includes('sign-up') || formName.toLowerCase().includes('sign-up'); 
    if (isSignupForm) { if (inputName.toLowerCase().includes('email')) { formData[inputName] = input.value } } else { formData[inputName] = input.value } } }); 
    const formSubmitPayload = generateTrackingPayload(pageViewEid); 
    sendTrackingEvent('formSubmit', { ...formSubmitPayload, formName, formData }, pageViewEid) }) } })
})()