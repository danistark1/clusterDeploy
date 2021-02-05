
document.getElementById('execCopy').addEventListener('click', execCopy);
function execCopy() {
    document.querySelector("#cluster-result").select();
    document.execCommand("copy");
}
let formSubmit =  function() {
    let range = document.getElementById('cluster-range').value;
    let exclude = document.getElementById('cluster-exclude').value;
    let username = document.getElementById('cluster-username').value;
    username = username.toLowerCase();
    let valid = true;
    let msg = '';
    if (username === '') {
        valid = false
        msg = 'Invalid username.';
    }
    let loginString = `csshx --login ${username} --ssh_args "-p 4028" data.cl`;
    let rangeArray = range.split(",");
    valid = isValidateRange(rangeArray);
    if (valid) {
        lowerRange = parseInt(rangeArray[0]);
        upperRange = parseInt(rangeArray[1]);
        if (isNaN(lowerRange) || isNaN(upperRange)) {
            msg += ' ' + 'Invalid Lower/Upper range';
            valid = false;
        }
    } else {
        msg += ' '+ 'Invalid range provided';
        valid = false;
    }

    if (exclude !== '') {
        exclude = exclude.split(" ");
        for (let r = 0 ; r < exclude.length; r++ ) {
            if (isNaN(parseInt(exclude[r]))) {
                valid = false;
                msg += ' ' + 'Exclude must be an integer';
                break;
            }
        }
    }
    if (valid) {
        constructedArray = generateClustersLogin(lowerRange, upperRange);
        finalResult = constructExcludedClusters(constructedArray, exclude);
        pritnedResult = displayResult(finalResult, loginString);
        document.querySelector(
            '#cluster-result'
        ).textContent = pritnedResult;
    } else {
        fail(msg);
    }
}
let button = document.getElementById("cluster-button");
button.addEventListener("click", formSubmit);

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
    var arrayLength = exclude.length;
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
    var constructedArray = [];
    var arrayLength = upperRange - lowerRange;
    for(i = 0; i <= arrayLength; i++) {
         constructedArray[i] = lowerRange;
         lowerRange = lowerRange +1;
    }
    return constructedArray;
}

// Display final result.
function displayResult(constructedArray, loginString) {
    var result = "";
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
