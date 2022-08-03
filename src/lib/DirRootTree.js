function BFS(node) {
    let counter = 0;
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
        key: 'dir-' + nodeIndex.name,
        children: PopulateRoot(nodeIndex, counter)
      });
  
      counter += 1;
    }
    return tr;
  }
  
  function PopulateRoot(dir, num) {
    let content = [];
    let counter = 0;
    for (const key of Object.keys(dir)) {
      const item = dir[key];
      if(item instanceof File) {
          content.push({ title: key, key: num + '-' + counter, isLeaf:true });
          counter += 1;
      }
    }
    return content;
  }

  export { BFS };