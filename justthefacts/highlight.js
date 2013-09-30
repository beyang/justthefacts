(function() {
  function isLetter(char) {
    if (char.length != 1) {
      return false;
    }
    return ('a' <= char  && char <= 'z') || ('A' <= char && char <= 'Z');
  }

  function markPatternAsClass(str, regex, className) {
    str = str.replace(regex, "<span class='justthefacts-" + className + "'>$&</span>");
    return str;
  }

  function markQuotes(str) {
    str = markPatternAsClass(str, /“[^“”<>]*”/g, "quote");
    str = markPatternAsClass(str, /\"[^\"<>]*\"/g, "quote");
    return str;
  }

  function markYear(str) {
    str = markPatternAsClass(str, /(?:[0-9]{4})/g, 'date');
    return str;
  }

  function markMonthDate(str) {
    var className = 'date';
    str = str.replace(/(?:Jan(?:uary|\.)?|Feb(?:ruary|\.)?|Mar(?:ch|\.)?|Apr(?:il|\.)?|May|Jun(?:e|\.)?|Jul(?:y|\.)?|Aug(?:ust|\.)?|Sept(?:ember|\.)?|Oct(?:ober|\.)?|Nov(?:ember|\.)?|Dec(?:ember|\.)?)\s?(?:[0-9]{0,2})/g, function(match, offset, str) {
      if (match.length === 3 || match === 'Sept') {
        var nextOffset = offset + match.length;
        if (str.length > nextOffset && isLetter(str[nextOffset])) {
          return match;
        }
      }
      return '<span class="justthefacts-' + className + '">' + match + '</span>';
    });

    return str;
  }

  function markDay(str) {
    str = markPatternAsClass(str, /Mon(?:day|\.),?|Tues(?:day|\.),?|Wed(?:nesday|\.),?|Thurs(?:day|\.),?|Fri(?:day|\.),?|Sat(?:day|\.),?|Sun(?:day|\.),?/g, 'date');
    return str;
  }

  function markNumbers(str) {
    str = markPatternAsClass(str, /\$?(?:[0-9]{1,3})(?:,[0-9]{3})*(?:\.[0-9]+)?(?:%|\s(?:percent|dozen|hundred|thousand|million|billion|trillion))?(?:\s[A-Za-z]+)?/g, 'number');
    return str;
  }

  var _commonWords = ['but', 'for', 'on', 'if', 'in', 'to', 'of', 'it', 'be', 'as', 'at', 'so', 'by', 'and', 'that', 'with', 'from', 'both'];

  function computeNameCounts(str) {
    var nameCounts = {};
    // This permits 2-3 character abbreviations such as "Mr." and
    // "Mrs." in the first token, but restricst to single-letter
    // abbreviations (i.e., initials) in subsequent tokens.
    var nameCandidates = str.match(/(?:[A-Z](?:\.|[a-zA-Z]{1,2}\.?[a-zA-Z\-']*|))(?:(?:\s(?:of|in))?(?:\s[A-Z](?:\.|[a-zA-Z\-']+)))+/g);
    if (nameCandidates) {
      nameCandidates.forEach(function(candidate) {
        if (nameCounts[candidate] === undefined) {
          nameCounts[candidate] = 0;
        }
        nameCounts[candidate]++;
      });
    }
    return nameCounts;
  }

  function markNames(str, nameCounts) {
    var className = 'name';

    // All caps
    str = markPatternAsClass(str, /(?:(?:[A-Z]\.){2,})/g, className);
    str = markPatternAsClass(str, /(?:(?:[A-Z]){3,})/g, className);

    // Other names
    Object.keys(nameCounts).sort(function(s1, s2) {
      return s2.length - s1.length;
    }).forEach(function(candidate) {
      if (nameCounts[candidate] > 0) {
        if (_commonWords.indexOf(candidate.split(' ')[0].toLowerCase()) < 0) {
          str = str.replace(candidate, "<span class='justthefacts-" + className + "'>" + candidate + "</span>");
        }
      }
    });

    return str;
  }

  function replaceTagHTML(tagHTML, nameCounts) {
    return tagHTML.replace(/>[^<>]+</g, function(str) {
      str = markQuotes(str);
      str = markNames(str, nameCounts);
      str = markYear(str);
      str = markMonthDate(str);
      str = markDay(str);
      str = markNumbers(str);
      return str;
    });
  }

  function main() {
    var url = document.location.href;
    chrome.runtime.sendMessage({'name': 'getSettings'}, function(response) {
      var domains = response['domains'];
      var shouldHighlight = false;
      for (var d = 0; d < domains.length; ++d) {
        if (url.indexOf(domains[d]) >= 0) {
          shouldHighlight = true;
          break;
        }
      }

      if (shouldHighlight) {
        console.log('highlighting page...');
        var pTags = document.getElementsByTagName('p');

        var src = "";
        for (var i = 0; i < pTags.length; ++i) {
          src += pTags[i].outerHTML + "\n\n\n";
        }
        nameCounts = computeNameCounts(src);

        for (var i = 0; i < pTags.length; ++i) {
          pTag = pTags[i];
          pTag.outerHTML = replaceTagHTML(pTag.outerHTML, nameCounts);
        }
        console.log('highlighting succeeded');
      }
    });
  }

  main();
})();
