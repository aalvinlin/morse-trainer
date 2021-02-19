const setSettings = settings => {

    for (let option in settings)
        {
            // set value on input slider
            document.getElementsByName(option)[0].value = settings[option];

            // set output display value
            document.getElementsByName(option + "Display")[0].value = settings[option];
        }

}

// initialize settings upon page load
const defaultSettings = {
    wpm: 20,
    eff: 20,
    ews: 0,     // extra word spacing
    freq: 700,
    startDelay: 0,
    groupLength: 5
}

const currentSettings = {...defaultSettings};

setSettings(currentSettings);

// create CW player

// remove groupLength before passing into CW player
const {groupLength, ...playerSettings} = currentSettings;

const cwPlayer = new jscw(currentSettings);
cwPlayer.setText("one two three four five six seven eight nine ten");
cwPlayer.renderPlayer('cwPlayer', cwPlayer);
