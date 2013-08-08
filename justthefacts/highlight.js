(function() {
    function markPatternAsClass(str, regex, className) {
        str = str.replace(regex, "<span" + " class='justthefacts-" + className + "'>$&</span>");
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
        str = markPatternAsClass(str, /(?:Jan(?:uary|\.)?|Feb(?:ruary|\.)?|Mar(?:ch|\.)?|Apr(?:il|\.)?|May|Jun(?:e|\.)?|Jul(?:y|\.)?|Aug(?:ust|\.)?|Sept(?:ember|\.)?|Oct(?:ober|\.)?|Nov(?:ember|\.)?|Dec(?:ember|\.)?)\s?(?:[0-9]{0,2})/g, 'date');
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

    function markNames(str) {
        // This permits 2-3 character abbreviations such as "Mr." and
        // "Mrs." in the first token, but restricst to single-letter
        // abbreviations (i.e., initials) in subsequent tokens.
        str = markPatternAsClass(str, /(?:[A-Z](?:\.|[a-zA-Z]{1,2}\.?[a-zA-Z\-']*|))(?:(?:\s(?:of|in))?(?:\s[A-Z](?:\.|[a-zA-Z\-']+)))+/g, 'name');

        str = markPatternAsClass(str, /(?:[A-Z]{4,})/g, 'name');

        // TODO: capitalize tokens that occur more than X times
        return str;
    }

    function markAll(str) {
        str = markQuotes(str);
        str = markNames(str);
        str = markYear(str);
        str = markMonthDate(str);
        str = markDay(str);
        str = markNumbers(str);
        return str;
    }

    function replaceTagHTML(tagHTML) {
        return tagHTML.replace(/>[^<>]+</g, markAll);
    }

    function main() {
        console.log('highlighting page...');
        var pTags = document.getElementsByTagName('p');
        for (var i = 0; i < pTags.length; ++i) {
            pTag = pTags[i];
            console.log(pTag.innerHTML);
            pTag.outerHTML = replaceTagHTML(pTag.outerHTML);
        }
        console.log('highlighting succeeded');
    }

    main();
})();
