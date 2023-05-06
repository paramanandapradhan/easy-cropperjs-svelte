import path from 'path';
import fs from 'fs';
import json from './package.json' assert { type: 'json' };

let publicFolder = './public';

let packageJsonKeys = ['name', 'version', 'author', 'license', 'keywords', 'description', 'exports', 'files', 'type', 'main', 'module', 'svelte', 'types', 'repository', 'homepage',]
let dependencies = [];
let devDependencies = ['@cloudparker/easy-window-watcher'];
let peerDependencies = []

function main() {
    let result = {};
    if (json) {
        packageJsonKeys.forEach((key) => {
            if (json[key]) {
                result[key] = json[key];
            }
        })
    }

    if (dependencies && dependencies.length) {
        esult.dependencies[key] = {}
        dependencies.forEach((key) => {
            if (json.dependencies && json.dependencies[key]) {
                result.dependencies[key] = json.dependencies[key];
            }
        })
    }

    if (devDependencies && devDependencies.length) {
        esult.devDependencies[key] = {}
        devDependencies.forEach((key) => {
            if (json.devDependencies && json.devDependencies[key]) {
                result.devDependencies[key] = json.devDependencies[key];
            }
        })
    }

    if (peerDependencies && peerDependencies.length) {
        esult.peerDependencies[key] = {}
        peerDependencies.forEach((key) => {
            if (json.peerDependencies && json.peerDependencies[key]) {
                result.peerDependencies[key] = json.peerDependencies[key];
            }
        })
    }

    if (!fs.existsSync(publicFolder)) {
        fs.mkdirSync(publicFolder);
    }
    fs.writeFileSync(path.resolve(publicFolder + '/package.json'), JSON.stringify(result, null, 4))
    console.log('package.json created.')

}

main();