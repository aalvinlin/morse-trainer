// initialize settings upon page load
const defaultSettings = {
    characterWpm: 20,
    effectiveWpm: 20,
    wordSpacing: 0,
    tone: 700,
    startDelay: 0,
    groupLength: 5
}

for (let option in defaultSettings)
    {
        // set value on input slider
        document.getElementsByName(option)[0].value = defaultSettings[option];

        // set output display value
        document.getElementsByName(option + "Display")[0].value = defaultSettings[option];
    }