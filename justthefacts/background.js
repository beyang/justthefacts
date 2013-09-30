chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.name === 'setSettings') {
    localStorage.setItem('domains', request['domains'].join('\n'));
  } else if (request.name === 'getSettings') {
    var domainsStr = localStorage.getItem('domains');
    var domains;
    if (domainsStr === null || domainsStr ===  undefined) {
      domains = [
        "nytimes.com",
        "economist.com",
        "washingtonpost.com",
        "wsj.com",
        "foxnews.com",
        "cnn.com",
        "npr.org",
        "huffingtonpost.com",
        "theguardian.com",
        "theguardian.co.uk",
        "reuters.com",
        "bbc.com",
        "bbc.co.uk",
        "chicagotribune.com",
        "techcrunch.com",
        "salon.com",
        "slate.com",
        "politico.com",
        "test.html",
      ];
    } else {
      domains = domainsStr.split('\n');
    }

    sendResponse({
      'domains': domains
    });
  }
});
