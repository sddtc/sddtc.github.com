---
title: "[Java] Codebashing"
layout: post
categories: sddtc tech
guid: urn:uuid:613ca4d3-7820-4d5e-b246-5c4cc79615dc
tags:
  - java
---

### Session Fixation

The principle of defense in depth (combining multiple best practices) is necessary for defending against Session Fixation attacks. These include to:   

1.Ensure that only server generated session values are accepted by the application.  
2.Upon a successful login, invalidate the original session value, and re-issue a new session value.  
3.Prevent the application from accepting session values via GET or POST requests and instead store session values within HTTP Cookies only.  

### Dom XSS

To defend against Cross Site Scripting attacks within the application user's Browser Document Object Model (DOM) environment a defense-in-depth approach is required, combining a number of security best practices.  
Note You should recall that for Stored XSS and Reflected XSS injection takes place server side, rather than client browser side.   

Whereas with DOM XSS, the attack is injected into the Browser DOM, this adds additional complexity and makes it very difficult to prevent and highly context specific, because an attacker can inject HTML, HTML Attributes, CSS as well as URLs. As a general set of principles the application should first HTML encode and then Javascript encode any user supplied data that is returned to the client.  

Due to the very large attack surface developers are strongly encouraged to review areas of code that are potentially susceptible to DOM XSS, including but not limited:  
window.name document.referrer document.URL document.documentURI location location.href location.search location.hash eval setTimeout setInterval document.write document.writeIn innerHTML outerHTML.  

Let's apply a suitable Regex pattern to remediate this particular DOM XSS vulnerability.

### Cross Site Request Forgery Post

To be effective, each response from the web server requires a Random Token to be generated. This token is then inserted by the application, as a hidden parameter, into sensitive form fields.   

By taking this approach, the application can then check, whenever a user submits/posts a form, that the token is both valid and correct. Because an attacker should never know this randomly generated value, it is a good strategy to protect against CSRF attacks. 

In essence it allows the application to determine the answer to this simple question: Was the form that the user POSTed legitimately created by the application (valid) or by an unknown third party (invalid)?' 

Note wherever cryptographically secure pseudo-random number generation (pRNG) is required, the wheel should not be re-invented. Correct use of java.security.SecureRandom is strongly preferred over bespoke/custom random number generation code, the latter being extremely prone to developer error. 
