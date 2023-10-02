import './style.css'
import * as pdw from 'pdw';
import { exportToFile, importFromFile } from './fileAsyncDataStores';
// import { Query } from 'firebase/firestore';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>AsyncDataStores</h1>
  <p>Do some work.</p>
  <button id="write">Write</button>
  <button id="export"">Export</button>
  <button id="log"">Log</button>
  <h2>Inputs</h2>
  <p>Filename</p>
  <input id="key" placeholder="data.json"></input>
  <h2>File Input</h2>
  <input id="filedrop" type="file"></input>`

let writeBtn = document.querySelector<HTMLButtonElement>('#write')!
let exportBtn = document.querySelector<HTMLButtonElement>('#export')!
let logBtn = document.querySelector<HTMLButtonElement>('#log')!
let nameInput = document.querySelector<HTMLButtonElement>('#key')!
let fileInput = document.querySelector<HTMLButtonElement>('#filedrop')! as HTMLInputElement
writeBtn.onclick = write;
exportBtn.onclick = exportThem;
fileInput.oninput = importFrom;
logBtn.onclick = async ()=>{console.log(await pdwRef.getAll({}))}

//establish singleton
let pdwRef = pdw.PDW.getInstance();

async function init() {
  await Promise.all([
    pdwRef.newDef({
      _did: 'defA',
      _lbl: "AAAAA"
    }),
    pdwRef.newDef({
      _did: 'defB',
      _lbl: "BBBBB"
    })
  ])
  await Promise.all([
    pdwRef.getFromManifest('defA').newEntry({ _note: 'Foray' }),
    pdwRef.getFromManifest('defB').newEntry({ _note: 'Forbee' }),
  ])
  console.log('Loaded');
}

// init();

// await pdwRef.getFromManifest('bbbb').newEntry({});

// console.log(await pdwRef.getDefs(true))

async function write() {
  let def = pdwRef.getFromManifest('zzfh');
  let e1 = new pdw.Entry({
    '7qhv': 'Meta',
    'btz9': "Entry 1"
  }, def);
  let e2 = new pdw.Entry({
    '7qhv': 'Meta',
    'btz9': "Entry 2"
  }, def);
  let e3 = new pdw.Entry({
    '7qhv': 'Meta',
    'btz9': "Entry 3"
  }, def);
  let result = await pdwRef.setAll({ entries: [e1, e2, e3], defs: [] })

  console.log(result);

}

async function importFrom(){
  const files = fileInput.files!
  const file = files.item(0)!;
  importFromFile(file);
}

async function exportThem() {
  let name = nameInput.value;
  const allData = await pdwRef.getAll({})
  console.log('Exporting to ' + name, allData);
  exportToFile('xlsx', name, allData)
}