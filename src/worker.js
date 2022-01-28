"use strict"; return (onmessage = ({ data: { regex, corpus } }) => {
    const re = new RegExp(regex, 'gm');
    let output = "";
    let matches;
    let matchCount = 0;
    while (matches = re.exec(corpus)) {
        matches.shift();
        output += matches.join('\t') + '\n';
        matchCount++;
    }
    postMessage({
        output,
        matchCount
    });
};)