import { set } from 'idb-keyval';

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
        key: nodeIndex.name,
        children: await PopulateRoot(nodeIndex)
      });
    }
    return tr;
  }
  
async function PopulateRoot(dir) {
    let content = [];
    for (const key of Object.keys(dir)) {
      const item = dir[key];
      console.log(item);
      /* eslint-disable */
      if(item instanceof FileSystemFileHandle) {
        let tkey = dir.name + '-' + item.name;
        content.push({ title: key, key: tkey, isLeaf:true });
        await set(tkey, item);
      }

    }
    return content;
  }

  export { BFS };