import xhr from 'xmlhttprequest-ssl'

// declarations for node.js
declare const global: any;

// override XMLHttpRequest
global.XMLHttpRequest = xhr.XMLHttpRequest;

