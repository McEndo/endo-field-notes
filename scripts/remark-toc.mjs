// Assign anchors and export the same entries used by the article navigation.
export default function remarkToc() {
  return tree => {
    const toc = []
    const used = new Set()
    const text = node => node.type === 'image' ? (node.alt ?? '') : (node.value ?? (node.children ?? []).map(text).join(''))
    const visit = node => {
      if (node.type === 'heading' && node.depth >= 2 && node.depth <= 4) {
        const title = text(node).replace(/\s+/g, ' ').trim()
        const base = title.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section'
        let id = `section-${base}`
        let suffix = 2
        while (used.has(id)) id = `section-${base}-${suffix++}`
        used.add(id)
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } }
        toc.push({ id, title: title || 'Section', depth: node.depth })
      }
      node.children?.forEach(visit)
    }
    visit(tree)
    tree.children.push({
      type: 'mdxjsEsm',
      value: '',
      data: {
        estree: {
          type: 'Program', sourceType: 'module',
          body: [{
            type: 'ExportNamedDeclaration', specifiers: [], source: null,
            declaration: {
              type: 'VariableDeclaration', kind: 'const',
              declarations: [{
                type: 'VariableDeclarator', id: { type: 'Identifier', name: 'toc' },
                init: {
                  type: 'CallExpression', optional: false,
                  callee: { type: 'MemberExpression', computed: false, optional: false, object: { type: 'Identifier', name: 'JSON' }, property: { type: 'Identifier', name: 'parse' } },
                  arguments: [{ type: 'Literal', value: JSON.stringify(toc) }],
                },
              }],
            },
          }],
        },
      },
    })
  }
}
