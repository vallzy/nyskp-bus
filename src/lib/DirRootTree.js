async function BFS2(root) {
  
}

async function BFS(node) {
    let tr = [];
    let dirQueue = [node];
    while(dirQueue.length > 0) {
      var nodeIndex = dirQueue.shift();
      for (const key of Object.keys(nodeIndex)) {
        const item = nodeIndex[key];
        if(item.visited !== undefined && !item.visited)
          dirQueue.push(item);
      }
      nodeIndex.visited = true;
      tr.push({
        title: nodeIndex.name,
        key: nodeIndex.entry ? nodeIndex.entry.path : nodeIndex.name,
        children: await PopulateRoot(nodeIndex)
      });
    }
    return tr;
  }
  
async function PopulateRoot(dir) {
    let content = [];
    for (const key of Object.keys(dir)) {
      const item = dir[key];
      /* eslint-disable */
      if(item instanceof FileSystemFileHandle) {
        content.push({ title: key, key: item.path, isLeaf:true });
      }

    }
    return content;
  }

  export { BFS };