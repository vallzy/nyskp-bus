async function GetDirectoryAccess() {
    const out = {};
    let dirHandle = await window.showDirectoryPicker();
    await HandleDirectoryEntry( dirHandle, out );
    return out;
}



async function HandleDirectoryEntry( dirHandle, out ) {
    for await (const entry of dirHandle.values()) {
        if (entry.kind === "file"){
        const file = await entry.getFile();
        out[ file.name ] = file;
        }
        if (entry.kind === "directory") {
        const newOut = out[ entry.name ] = { visited: false, name: entry.name };
        await HandleDirectoryEntry( entry, newOut );
        }
    }
  }

  export { GetDirectoryAccess, HandleDirectoryEntry };