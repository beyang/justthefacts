function main() {
  var domainsInputElem = document.getElementById("domains-input");
  domainsInputElem.onkeypress = function() {
    var domains = domainsInputElem.value.trim().split('\n');
    for (var d = 0; d < domains.length; d++) {
      domains[d] = domains[d].trim();
    }
    chrome.runtime.sendMessage({
      'name': 'setSettings',
      'domains': domains
    });
  };

  chrome.runtime.sendMessage({'name': 'getSettings'}, function(response) {
    domainsInputElem.value = response['domains'].join('\n');
  });
}

main();
