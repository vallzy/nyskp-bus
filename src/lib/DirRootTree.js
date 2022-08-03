function BFS(node) {
    let tr = [];
    let dirQueue = [node];
    node.name = 'root';
    while(dirQueue.length > 0) {
      var nodeIndex = dirQueue.shift();
      for (const key of Object.keys(nodeIndex)) {
        const item = nodeIndex[key];
        if(item.visited !== undefined && !item.visited) { 
          dirQueue.push(item);
        }
      }
      nodeIndex.visited = true;
      tr.push({
        title: nodeIndex.name,
        key: nodeIndex.name,
        children: PopulateRoot(nodeIndex)
      });
    }
    return tr;
  }
  
  function PopulateRoot(dir) {
    let content = [];
    let counter = 0;
    for (const key of Object.keys(dir)) {
      const item = dir[key];
      if(item instanceof File) {
          content.push({ title: key, key: dir.name + '-' + counter, isLeaf:true });
          counter += 1;
      }
    }
    return content;
  }

  export { BFS };