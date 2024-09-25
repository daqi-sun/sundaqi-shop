if (window.location.pathname === '/pages/giving-back' || window.location.pathname === '/pages/giving-back-lp') {
    //console.log('DOCUMENT REFERRER:', document.referrer)
	if (!document.referrer.match(/^https?:\/\/([^\/]+\.)?ecoflow\.com(\/|$)/i) && !Shopify.designMode) {
	  window.location.replace('https://es.ecoflow.com');
	}
}