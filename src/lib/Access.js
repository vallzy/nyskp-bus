import { set } from 'idb-keyval';

async function GetDirectoryAccess() {
    const out = {};
    let dirHandle = await window.showDirectoryPicker();
    out.name = dirHandle.name;
    let pathList = {};
    await HandleDirectoryEntry(dirHandle, out, dirHandle, pathList);
    //console.log('pathList', pathList);
    GenerateDirectoryList(pathList);
    return out;
}

function parentPath(full) {
    let sp = full.split('/');
    return sp.slice(0, sp.length - 1).join("/");
}

async function GenerateDirectoryList(files) {
    let children = [];
    let level = {  };

    Object.keys(files).forEach((path) => {
      path.split("/").reduce((r, name) => {
        if (!name) {
          return;
        }
        
        return r[name];
      }, level);
    });
    console.log(level);
}

/*
    dirHandle: The starting point of the directory.
    out: The output tree
    rootCopy: A copy of the starting point, used to resolve relative path.
*/
async function HandleDirectoryEntry(dirHandle, out, rootCopy, pathList) {
    //console.log('Location', dirHandle.name);
    await set(dirHandle.name, dirHandle);
    for await (const entry of dirHandle.values()) {
        let fkey = [rootCopy.name, ...await rootCopy.resolve(entry)];
        let path = fkey.join('/');
        entry.path = path;
        let pathObject = {
            name: entry.name,
            type: entry.kind,
            path: path
        };
        pathList[path] = pathObject;
        //console.log('Evaluating', entry);
        if (entry.kind === "file") {
            out[entry.name] = entry;
            await set(path, entry);
        }
        else if (entry.kind === "directory") {
            const newOut = out[entry.name] = { visited: false, name: entry.name, entry: entry };
            await set(path, entry);
            await HandleDirectoryEntry(entry, newOut, rootCopy, pathList);
        }

    }
}

export { GetDirectoryAccess, HandleDirectoryEntry };