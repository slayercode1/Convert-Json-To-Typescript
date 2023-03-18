function jsonToInterface(jsonObj, interfaceName, indent = '') {
  let interfaceStr = `interface ${interfaceName} {\n`;

  const switchInput = document.querySelector('.switch input[type="checkbox"]');
  switchInput.addEventListener('change', function () {
    if (this.checked) {
      if (jsonObj.hasOwnProperty('data')) {
        jsonObj = jsonObj['data'];
      }
      if (Array.isArray(jsonObj) && jsonObj.length > 0) {
        jsonObj = jsonObj[0];
      }
    }
  });

  let objectCount = 0;
  const objectProps = {};

  Object.keys(jsonObj).forEach((key) => {
    const value = jsonObj[key];
    let type = typeof value;

    if (Array.isArray(value)) {
      type = `Array<${typeof value[0]}>`;
    } else if (type === 'object') {
      type = '';
      const subIndent = indent + '  ';
      Object.keys(value).forEach((innerKey) => {
        const innerValue = value[innerKey];
        const innerType = typeof innerValue;
        if (Array.isArray(innerValue)) {
          type += `${subIndent}${innerKey}: Array<${typeof innerValue[0]}>;\n`;
        } else if (innerType === 'object') {
          type += `${subIndent}${innerKey}: ${jsonToInterface(innerValue, `${interfaceName}_${key}`, subIndent)};\n`;
        } else {
          type += `${subIndent}${innerKey}: ${innerType};\n`;
        }
      });
      type = `{\n${type}${indent}}`;
    } else if (type === 'boolean') {
      type = 'boolean';
    }

    if (!isNaN(key)) {
      objectCount++;
      if (!objectProps[type]) {
        objectProps[type] = '';
      }
    } else {
      interfaceStr += `${indent}  ${key}: ${type};\n`;
      if (value instanceof Date) {
        interfaceStr = interfaceStr.replace(`${type};`, 'Date;');
      }
    }
  });

  if (objectCount > 0) {
    for (const [type] of Object.entries(objectProps)) {
      const test = `${indent}  ${type}`;
      const modifiedTest = test.replace('{', '').replace('}', '');
      interfaceStr = interfaceStr.replace('\n', '') + modifiedTest;
    }
  }

  interfaceStr += `${indent}}\n`;
  return interfaceStr;
}

function formatJSON(json) {
  if (typeof json === "string") {
    json = JSON.parse(json);
  }
  if (Array.isArray(json)) {
    return JSON.stringify(json, null, 2);
  } else if (typeof json === "object") {
    let result = "{\n";
    for (let key in json) {
      result += `   ${key}: ${JSON.stringify(json[key], null, 2)},\n`;
    }
    result = result.slice(0, -2);
    result += "\n}";
    return result;
  } else {
    return JSON.stringify(json);
  }
}

function toast(text) {
  const toast = document.querySelector('.toast');
  toast.textContent = text;
  toast.classList.add('show');
  toast.style.backgroundColor = "black"

  setTimeout(function () {
    toast.classList.remove('show');
  }, 2000)
}


function copyToClipboard(elementSelector, text) {
  document.querySelector(elementSelector).addEventListener('click', function () {
    navigator.clipboard.writeText(text);
    toast('Copié !')
  });
}

const form = document.querySelector("#myForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const urlInput = document.querySelector("#url");
  const urlValue = urlInput.value;
  fetch(urlValue)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const fetch = document.querySelector("#fetch")
      fetch.textContent = formatJSON(data)
      hljs.highlightBlock(fetch);
      
      
      const interfaceName = document.querySelector('#nameInterface').value;
      const interfaceStr = jsonToInterface(data, interfaceName);
      const result = document.querySelector("#result")
      result.textContent = interfaceStr
      hljs.highlightBlock(result);
      copyToClipboard('.btn-copy', interfaceStr);
    })
    .catch(error => {
      toast('Il y a eu un problème avec la requête fetch')
      console.log(error)
    });
});



