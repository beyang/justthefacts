(function() {
    function highlight(str) {
        str = str.replace(/(“[^“”]*”)/g, "<span" + " class='justthefacts-quote'>$1</span>");
        return str
    }

    function main() {
        console.log('highlighting page...');
        document.body.innerHTML = highlight(document.body.innerHTML);
        console.log('highlighting succeeded');
    }

    setTimeout(function() { main(); }, 500);
})();
