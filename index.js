const setSettings = settings => {

    settings = {...settings, "groupLength": defaultAppSettings.groupLength};

    for (let option in settings)
        {
            // set value on input slider
            document.getElementsByName(option)[0].value = settings[option];

            // set output display value
            document.getElementsByName(option + "Display")[0].value = settings[option];
        }
    
    if (defaultAppSettings.displayPlayer)
        { togglePlayerDisplay(); }

}

// initialize settings upon page load
const defaultPlayerSettings = {
    wpm: 20,
    eff: 20,
    ews: 0,     // extra word spacing
    freq: 700,
    startDelay: 0
}

const defaultAppSettings = {
    groupLength: 5,
    
    inputType: "text",
    textToConvert: "",
    characterSelection: [],
    characterWeights: [],
    totalCharacters: 100,
    totalTime: 30,

    displayPlayer: false
}

const currentPlayerSettings = {...defaultPlayerSettings};

setSettings(currentPlayerSettings);

const updatePlayerSettings = (event, callback) => {

    document.getElementById(event.target.name + "Display").value = event.target.value;

    if (event.target.name === "groupLength")
        { defaultAppSettings[event.target.name] = callback(event.target.value); }    
    else
        { defaultPlayerSettings[event.target.name] = callback(event.target.value); }
    
    if (defaultAppSettings.displayPlayer)
        { togglePlayerDisplay(); }
}

document.getElementById("wpm").addEventListener("input", event => updatePlayerSettings(event, parseInt));
document.getElementById("eff").addEventListener("input", event => updatePlayerSettings(event, parseInt));
document.getElementById("ews").addEventListener("input", event => updatePlayerSettings(event, parseInt));
document.getElementById("freq").addEventListener("input", event => updatePlayerSettings(event, parseInt));
document.getElementById("startDelay").addEventListener("input", event => updatePlayerSettings(event, parseInt));
document.getElementById("groupLength").addEventListener("input", event => updatePlayerSettings(event, parseInt));

// Fisher-Yates Shuffle: https://stackoverflow.com/a/12646864
const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const generateRandomText = (charactersArray, charactersToGenerate, distribution = []) => {

    // initialize an array of the requested length. Fill with zeroes.
    const selectedCharacters = Array(charactersToGenerate).fill(0);

    let lastAccessedIndex = 0;

    // if a weighting distribution is specified, create those entries
    for (let i = 0; i < distribution.length; i += 1)
        {
            const currentWeight = distribution[i] / 100;
            const mostRecentCharacter = charactersArray[charactersArray.length - 1 - i];

            const totalCharactersForWeight = Math.floor(charactersToGenerate * currentWeight);
            
            for (let j = 0; j < totalCharactersForWeight; j += 1)
                {
                    selectedCharacters[lastAccessedIndex] = mostRecentCharacter;
                    lastAccessedIndex += 1;
                }
        }

    // determine the remaining characters
    let remainingCharacters = charactersArray;

    if (distribution.length > 0)
        {
            remainingCharacters = charactersArray.slice(0, -1 * distribution.length);
        }

    // fill with remaining characters
    for (let i = lastAccessedIndex; i < charactersToGenerate; i += 1)
        {
            selectedCharacters[i] = remainingCharacters[Math.floor(Math.random() * remainingCharacters.length)];
        }

    shuffle(selectedCharacters);

    return selectedCharacters;
}

const togglePlayerDisplay = () => {

    if (defaultAppSettings.displayPlayer)
        {
            document.getElementById("saveSettings").style.display = "block";
            document.getElementById("cwPlayer").style.display = "none";
        }
    else
        {
            document.getElementById("saveSettings").style.display = "none";
            document.getElementById("cwPlayer").style.display = "block";
        }

    defaultAppSettings.displayPlayer = !defaultAppSettings.displayPlayer;
}

// create CW player
const createCWPlayer = () => {

    const cwPlayer = new jscw(defaultPlayerSettings);

    if (defaultAppSettings.inputType === "text")
        {
            cwPlayer.setText(defaultAppSettings.textToConvert);
        }
    
    togglePlayerDisplay();
    cwPlayer.renderPlayer('cwPlayer', cwPlayer);
}

// add events for buttons
const setInputType = selection => {

    defaultAppSettings.inputType = selection;

    document.getElementsByClassName("input-text")[0].style.display = "none";
    document.getElementsByClassName("input-generated")[0].style.display = "none";

    document.getElementsByClassName("input-" + selection)[0].style.display = "flex";
}

document.getElementById("inputTypeText").addEventListener("click", () => setInputType("text"));
document.getElementById("inputTypeGenerated").addEventListener("click", () => setInputType("generated"));

// add events for input fields
const updateAppSettings = (event, callback) => {
    
    defaultAppSettings[event.target.name] = callback(event.target.value);
    
    if (defaultAppSettings.displayPlayer)
        { togglePlayerDisplay(); }
}

document.getElementById("textToConvert").addEventListener("input", event => updateAppSettings(event, text => text));
document.getElementById("characterSelection").addEventListener("input", event => updateAppSettings(event, text => text.split("")));
document.getElementById("characterWeights").addEventListener("input", event => updateAppSettings(event, text => text.split(" ").map(n => parseInt(n))));
document.getElementById("totalCharacters").addEventListener("input", event => updateAppSettings(event, parseInt));
document.getElementById("totalTime").addEventListener("input", event => updateAppSettings(event, parseInt));

// create and display player
document.getElementById("saveSettings").addEventListener("click", createCWPlayer);

const characterDotLengths = {
    "0": 19, "1": 17, "2": 15, "3": 13, "4": 11,
    "5": 9, "6": 11, "7": 13, "8": 15, "9": 17,
    "a": 5, "b": 9, "c": 11, "d": 7, "e": 1,
    "f": 9, "g": 9, "h": 7, "i": 3, "j": 13,
    "k": 9, "l": 9, "m": 7, "n": 5, "o": 11,
    "p": 11, "q": 13, "r": 7, "s": 5, "t": 3,
    "u": 7, "v": 9, "w": 9, "x": 11, "y": 13,
    "z": 11, "/": 13, "+": 13, "=": 13, "?": 15,
    ".": 17, ",": 19, ":": 17, "(": 15, ")": 19,
    "@": 17, "-": 15, '"': 15, "!": 13, "$": 17,
    "'": 19, "`": 23, ";": 17
}

const getWordDotLength = word => {

    let dotLength = 0;

    for (let i = 0; i < word.length; i += 1)
        {
            if (characterDotLengths[word[i]])
                { dotLength += characterDotLengths[word[i]]; }

            // add extra space between characters
            if (i < word.length - 1)
                { dotLength += 3; }
        }
    
    return dotLength;
}

const getTextDotLength = (text, extraWordSpacing = 0) => {

    let words = text.split(" ");
    let textDotLength = 0;

    for (let i = 0; i < words.length; i += 1)
        {
            let currentWord = words[i];

            textDotLength += getWordDotLength(currentWord);

            // add extra word spacing if needed
            if (i < words.length - 1)
                { textDotLength += 7 + extraWordSpacing; }
        }

    return textDotLength;
}

const estimateTextLengthInSeconds = (text, effectiveSpeed = defaultAppSettings.eff, extraWordSpacing = 0) => {

    let textDotLength = getTextDotLength(text, extraWordSpacing);
    return Math.round(50 * effectiveSpeed / textDotLength * 60); // 50 * effectiveSpeed is characters per minute (PARIS standard)
}

const formatTimeInWords = seconds => {

    if (seconds < 0)
        { return ""; }

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds - minutes * 60;

    let minuteText = "";

    // display minutes if more than 0
    if (minutes > 0)
        { minuteText = minutes + " min"; }

    // add space if there are seconds left
    if (remainingSeconds)
        { minuteText += " "; }

    let secondText = "";

    // display seconds if more than 0
    if (remainingSeconds > 0)
        { secondText = remainingSeconds + " sec"; }

    return minuteText + secondText;
}