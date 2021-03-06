
const buttonEnterprise = document.getElementById("cluster-button-enterprise");
const buttonStage = document.getElementById("cluster-button-stage");
const buttonPublic = document.getElementById("cluster-button-public");
const buttonClear = document.getElementById('cluster-button-execClear');
const buttonCopy = document.getElementById('cluster-button-execCopy');

const port = document.getElementById('cluster-port');
const username = document.getElementById('cluster-username');
const textArea = document.querySelector('#cluster-result');
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

// Copy generated command
function execCopy() {
    textArea.select();
    document.execCommand("copy");
}

// Clear
function execClear() {
    textArea.textContent = '';
}

// Get enterprise clusters.
let formSubmit =  function() {
    let range = document.getElementById('cluster-range').value;
    let exclude = document.getElementById('cluster-exclude').value;
    let chunkSplit = document.getElementById('cluster-chunk').value;
    chunkSplit = parseInt(chunkSplit);
    let valid = true;
    let msg = '';
    if (username.value === '') {
        valid = false
        msg = 'Invalid username'+'\n';
    }

    let loginString = `csshx --login ${username.value} --ssh_args "-p ${port.value}" data.cl`;
    let rangeArray = range.split(",");
    valid = isValidateRange(rangeArray);
    if (valid) {
        lowerRange = parseInt(rangeArray[0]);
        upperRange = parseInt(rangeArray[1]);
        if (isNaN(lowerRange) || isNaN(upperRange)) {
            msg += 'Invalid Lower/Upper range'+'\n';
            valid = false;
        }
    } else {
        msg += 'Invalid range'+'\n';
        valid = false;
    }

    if (exclude !== '') {
        exclude = exclude.split(" ");
        for (let r = 0 ; r < exclude.length; r++ ) {
            if (isNaN(parseInt(exclude[r]))) {
                valid = false;
                msg += ' ' + 'Exclude must be an integer'+'\n';
                break;
            }
        }
    }
    if (!port || !chunkSplit) {
        valid = false;
        if (!port) {
            msg += 'Invalid port'+'\n';
        }
        if (!chunkSplit) {
            msg += 'Invalid chunk'+'\n';
        }
    }
    if (valid) {
        constructedArray = generateClustersLogin(lowerRange, upperRange);
        finalResult = constructExcludedClusters(constructedArray, exclude);
        let chunks = splitToChunks(finalResult,chunkSplit);

        let chunkedResult = '';
        chunks.forEach(chunk => {
            pritnedResult =   displayResult(chunk, loginString);
            chunkedResult += pritnedResult+'\n'+'\n';
        })
        textArea.textContent = chunkedResult;

    } else {
        fail(msg);
    }
}

//Get public clusters.
const formSubmitPublic =  function() {
    if (port.value !== '' || username.value.toLowerCase() !== '') {
        textArea.textContent = `csshx --login ${username.value} --ssh_args "-p ${port.value}" data.cl[20012,30011,40011,40012,40013,40014].vanilladev.com`;
    } else {
        fail("Invalid port or username.");
    }

}

// Get Stage clusters.
const formSubmitStage =  function() {
    if (port.value !== '' || username.value.toLowerCase() !== '') {
        textArea.textContent = `csshx --login ${username.value} --ssh_args "-p ${port.value}" data.cl[10013,10014,20011,20013,20014,20024,20082].vanilladev.com`;
    } else {
        fail("Invalid port or username.");
    }
}

// Event Handlers.
buttonEnterprise.addEventListener("click", formSubmit);
buttonPublic.addEventListener("click", formSubmitPublic);
buttonStage.addEventListener("click", formSubmitStage);
buttonCopy.addEventListener('click', execCopy);
buttonClear.addEventListener('click', execClear);
toggleSwitch.addEventListener('change', switchTheme, false);

// Validate Range.
function isValidateRange(rangeArray) {
    let valid = true;
    if (rangeArray === undefined || rangeArray === '' || rangeArray[0] === '') {
        valid = false;
    }
    return valid;
}

// Construct excluded clusters array.
function constructExcludedClusters(constructedArray, exclude) {
    let arrayLength = exclude.length;
    for(i = 0; i <= arrayLength; i++) {
        let index = constructedArray.indexOf(parseInt(exclude[i]));
        if (index > -1) {
            constructedArray.splice(index, 1);
        }
    }
    return constructedArray;
}

// Generate clusters array.
function generateClustersLogin(lowerRange, upperRange) {
    let constructedArray = [];
    let arrayLength = upperRange - lowerRange;
    for(i = 0; i <= arrayLength; i++) {
         constructedArray[i] = lowerRange;
         lowerRange = lowerRange +1;
    }
    return constructedArray;
}

// Display final result.
function displayResult(constructedArray, loginString) {
    let result = "";
    for(k = 0; k < constructedArray.length; k++) {
        if (k === constructedArray.length - 1) {
            result += constructedArray[k];
        } else {
            result += constructedArray[k]+ ',';
        }
    }
   return loginString +'['+result+']'+'.vanilladev.com';
}

function fail(msg) {
    alert(msg);
}

// Split clusters to chunks.
function splitToChunks(array, parts) {
    let result = [];
    for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
}

// Switch Theme.
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}


// Dark Mode
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }
}

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

