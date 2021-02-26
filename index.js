const setSettings = settings => {

    settings = {...settings, "groupLength": defaultAppSettings.groupLength};

    for (let option in settings)
        {
            // set value on input slider
            document.getElementsByName(option)[0].value = settings[option];

            // set output display value
            document.getElementsByName(option + "Display")[0].value = settings[option];
        }

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
    totalTime: 30
}

const currentPlayerSettings = {...defaultPlayerSettings};

setSettings(currentPlayerSettings);

const updatePlayerSettings = (event, callback) => {

    document.getElementById(event.target.name + "Display").value = event.target.value;

    if (event.target.name === "groupLength")
        { defaultAppSettings[event.target.name] = callback(event.target.value); }    
    else
        { defaultPlayerSettings[event.target.name] = callback(event.target.value); }
    
    

    console.log(defaultPlayerSettings);
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

// create CW player
const createCWPlayer = settings => {

    // remove groupLength before passing into CW player
    const {groupLength, ...playerSettings} = settings;

    const cwPlayer = new jscw(playerSettings);
    cwPlayer.setText("one two three four five six seven eight nine ten");
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
}

document.getElementById("textToConvert").addEventListener("input", event => updateAppSettings(event, text => text));
document.getElementById("characterSelection").addEventListener("input", event => updateAppSettings(event, text => text.split("")));
document.getElementById("characterWeights").addEventListener("input", event => updateAppSettings(event, text => text.split(" ").map(n => parseInt(n))));
document.getElementById("totalCharacters").addEventListener("input", event => updateAppSettings(event, parseInt));
document.getElementById("totalTime").addEventListener("input", event => updateAppSettings(event, parseInt));

createCWPlayer(currentPlayerSettings);