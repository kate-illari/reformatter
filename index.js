var clipboard = new Clipboard('.btn'),
    textString = document.getElementById("inpt"),
    infoTextArea = document.getElementById("info"),
    reelSetsSplitter = new RegExp(/(\-+\w*\-+)/, 'g'),
    objSplitter = new RegExp(/(\}|\},\s)/, 'g'),
    symName = new RegExp(/\bSYM*\D\d*/, 'g'),
    outputsContainer = document.getElementById("outputsContainer");


clipboard.on("success", function (e) {
    e.trigger.innerText = "COPIED!";
    setTimeout(function () {
        e.trigger.innerText = "copy";
    }, 800)
});

function processReformat() {
    while (outputsContainer.hasChildNodes()) {
        outputsContainer.removeChild(outputsContainer.lastChild);
    }

    if (reelSetsSplitter.test(textString.value)) {
        var rawReelSets = [];

        textString.value.split(reelSetsSplitter).forEach(function (string) {
            if (symName.test(string)) {
                rawReelSets.push(string);
            }
        });


        rawReelSets.forEach(function (reelsetText, i) {
            var splittedText = reelsetText.split(objSplitter),
                rawReelText = [];

            splittedText.forEach(function (text) {
                if (symName.test(text)) {
                    rawReelText.push(text)
                }
            });

            createOutputElement(rawReelText, i+1);
        });

    } else {
        var splittedText = textString.value.split(objSplitter),
            rawReelText = [];

        splittedText.forEach(function (text) {
            if (symName.test(text)) {
                rawReelText.push(text)
            }
        });

        createOutputElement(rawReelText);
    }

}

function getResult(rawReelText) {
    var result = [];

    rawReelText.forEach(function (reel) {
        var newArr = reel.match(symName),
            withQuotes = newArr.map(function (sym) {
                return '"' + sym + '"';
            });

        result.push("\n&emsp;&emsp;[" + withQuotes + "]");
    });

    return result;
}

function createOutputElement(rawReelText, i) {
    var newContainer = document.createElement("div"),
        newButton = document.createElement("button"),
        newElement = document.createElement("textarea");

    newContainer.setAttribute('class', 'oneOutputContainer');
    newElement.setAttribute('class', 'outputReelset');
    newElement.setAttribute('id', i ? 'outpt'+i : 'outpt');
    newButton.setAttribute('class', 'btn outputButton');
    newButton.setAttribute('data-clipboard-target', i ? '#outpt'+i : '#outpt');

    newButton.innerText = "copy";
    newElement.innerHTML = "[" + getResult(rawReelText) + "\n]";

    newContainer.appendChild(newElement);
    newContainer.appendChild(newButton);
    outputsContainer.appendChild(newContainer);

}

function processVerification() {
    var splittedText = textString.value.split(objSplitter),
        rawReels = [],
        message = "Info: no matched data";

    splittedText.forEach(function (text) {
        if (symName.test(text)) {
            rawReels.push(text);
            message = "Info:\n\nreels: " + rawReels.length + " штукэ\n";
        }
    });

    rawReels.forEach(function (reel, reelIdx) {
        var symbols = 0;

        if (reel.match(symName) !== null && reel.match(symName) !== undefined) {
            reel.match(symName).forEach(function () {
                symbols++;
            });
            message += reelIdx + ": " + symbols + "\n"
        } else {
            message = "Info: Please check the input!"
        }
    });

    infoTextArea.innerHTML = message;
}