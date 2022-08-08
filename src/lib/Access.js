import { set } from 'idb-keyval';

async function GetDirectoryAccess() {
    const out = {};
    const altout = [];
    let dirHandle = await window.showDirectoryPicker();
    out.name = dirHandle.name;
    await HandleDirectoryEntry(dirHandle, out, dirHandle);
    return out;
}


/*
    dirHandle: The starting point of the directory.
    out: The output tree
    rootCopy: A copy of the starting point, used to resolve relative path.
*/
async function HandleDirectoryEntry(dirHandle, out, rootCopy) {
    //console.log('Located in', dirHandle.name);
    for await (const entry of dirHandle.values()) {
        let fkey = [rootCopy.name, ...await rootCopy.resolve(entry)];
        let path = fkey.join('/');
        entry.path = path;
        //console.log('Evaluating', entry);
        if (entry.kind === "file") {
            //const file = await entry.getFile(); 
            out[entry.name] = entry;
            await set(path, entry);
        }
        if (entry.kind === "directory") {
            const newOut = out[entry.name] = { visited: false, name: entry.name, entry: entry };
            await set(path, entry);
            await HandleDirectoryEntry(entry, newOut, rootCopy);
        }
    }
}

export { GetDirectoryAccess, HandleDirectoryEntry };