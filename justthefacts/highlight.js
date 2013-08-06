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
        str = markPatternAsClass(str, /(?:[A-Z][A-Za-z\.]+)(?:\s[A-Z][A-Za-z\.]+)+/g, 'name');
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

    function replaceTagInnerHTML(tagHTML) {
        return tagHTML.replace(/>[^<>]+</g, markAll);
    }

    function highlightedBody(bodyHTML) {
        return bodyHTML.replace(/<[Pp][^>]*>[^]+?<\/[Pp]>/g, replaceTagInnerHTML);
    }

    function main() {
        console.log('highlighting page...');
        document.body.innerHTML = highlightedBody(document.body.innerHTML);
        console.log('highlighting succeeded');
    }

    main();
})();
