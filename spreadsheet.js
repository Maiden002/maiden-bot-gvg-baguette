
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./client_secret.json');

function printPlayer(player) {

    console.log(`Hello : ${player.player}`);
    console.log(`${player._dw4je}`);
    // _dw4je vaut la valeur concatené des teams a poser
    console.log('----------------------');
}

    async function accessSpreadsheet() {
    console.log('Debut');
    const doc = new GoogleSpreadsheet('1CTA9M5EDc39mCX8iFqtv3raNKbGxLT8P-RkNGj1Xz9c');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[9];
    
    const rows = await promisify(sheet.getRows)({
        query: '_cn6ca = FALSE'
    });

    rows.forEach(row => {
        printPlayer(row);
    })
}

accessSpreadsheet();