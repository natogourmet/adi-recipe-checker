async function translateCsvToJson() {
  const fs = require('fs');
  fs.readFile('src/data/recipes.csv', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    return csvJSON(data);
  });
}

function csvJSON(csv) {
  let lines = csv.split('\n');
  let result = [];
  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  let headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    let currentline = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  //return result; //JavaScript object
  return result;
}

module.exports = translateCsvToJson;