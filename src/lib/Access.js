import { set, values } from 'idb-keyval';

async function GetDirectoryAccess() {
    const out = {};
    let dirHandle = await window.showDirectoryPicker();
    let dirHandleBackup = dirHandle;
    out.name = dirHandle.name;
    let pathList = {};
    await HandleDirectoryEntry(dirHandle, out, dirHandleBackup, pathList);
    //console.log('pathList', pathList);
    let t = await GenerateDirectoryList(pathList, dirHandleBackup);
    return t;
}

function ParentPath(full, dirHandleRoot) {
    let sp = full.split('/');
    if (sp.length === 1) return dirHandleRoot.name;
    return sp.slice(0, sp.length - 1).join("/");
}

function MergeDirectories(output, dirHandleRoot) {
    Object.keys(output).forEach((key) => {
        if (key !== dirHandleRoot.name) {
            let parent = ParentPath(key, dirHandleRoot);
            output[parent].children.push(output[key]);
        }
    });
    return output[dirHandleRoot.name];
}

async function GenerateDirectoryList(files, dirHandleRoot) {
    let dir = {};
    dir[dirHandleRoot.name] = { title: dirHandleRoot.name, key: dirHandleRoot.name, children: [] };
    Object.keys(files).forEach((key) => {
        let item = files[key];
        if (item.type === "directory") {
            dir[key] = { title: item.name, key: item.path, children: [] }
        }
    });
    Object.keys(files).forEach((key) => {
        let item = files[key];
        if (item.type === "file") {
            let parent = ParentPath(item.path, dirHandleRoot);
            let entry = { title: item.name, key: item.path, isLeaf: true }
            dir[parent] ? dir[parent].children.push(entry) : dir[dirHandleRoot.name].children.push(entry);
        }
    });
    let tree = MergeDirectories(dir, dirHandleRoot);
    return tree;
}

async function HandleDirectoryEntry(dirHandle, out, rootCopy, pathList) {
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

async function CountFileType() {
    let extList = {};
    await values().then(async (values) => {
        for (let i = 0; i < values.length; i++) {
            if (values[i].kind === "file") {
                let n = values[i].name.split('.').pop();
                if (extList[n] !== undefined)
                    extList[n].count += 1;
                else
                    extList[n] = { count: 1 };
            }
        }
    });
    return extList;
}

export { GetDirectoryAccess, HandleDirectoryEntry, GenerateDirectoryList, CountFileType };