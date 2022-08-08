async function GetDirectoryAccess() {
    const out = {};
    let dirHandle = await window.showDirectoryPicker();
    out.name = dirHandle.name;
    await HandleDirectoryEntry( dirHandle, out );
    return out;
}



async function HandleDirectoryEntry( dirHandle, out ) {
    for await (const entry of dirHandle.values()) {
        if (entry.kind === "file"){
        //const file = await entry.getFile(); 
        out[ entry.name ] = entry;
        }
        if (entry.kind === "directory") {
        const newOut = out[ entry.name ] = { visited: false, name: entry.name };
        await HandleDirectoryEntry( entry, newOut );
        }
    }
  }

  export { GetDirectoryAccess, HandleDirectoryEntry };