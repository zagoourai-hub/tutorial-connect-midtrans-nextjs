export default function codeMeta() {
  /** @param {{tagName?:string,data?:{meta?:string},properties?:Record<string,unknown>,children?:object[]}} tree */
  function visit(tree) {
    if (tree.tagName === 'code' && tree.data?.meta) {
      const title = tree.data.meta.match(/title="([^"]+)"/)
      if (title) tree.properties = { ...tree.properties, 'data-title': title[1] }
    }
    tree.children?.forEach(visit)
  }
  return visit
}
