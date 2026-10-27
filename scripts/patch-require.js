const Module = require('module')
const path = require('path')
const fs = require('fs')

const origResolve = Module._resolveFilename
Module._resolveFilename = function(request, parent, isMain, options) {
  try {
    return origResolve.call(this, request, parent, isMain, options)
  } catch (err) {
    if (parent && parent.filename && request.startsWith('./')) {
      const parentDir = path.dirname(parent.filename)
      const serverDir = path.join(process.cwd(), '.next', 'server')
      const rel = request.slice(2)
      const candidates = [
        path.join(parentDir, 'chunks', rel),
        path.join(parentDir, 'chunks', `${rel}.js`),
        path.join(parentDir, '..', 'chunks', rel),
        path.join(parentDir, '..', 'chunks', `${rel}.js`),
        path.join(serverDir, 'chunks', rel),
        path.join(serverDir, 'chunks', `${rel}.js`),
        path.join(serverDir, 'vendor-chunks', rel),
        path.join(serverDir, 'vendor-chunks', `${rel}.js`),
        path.join(serverDir, rel),
        path.join(serverDir, `${rel}.js`),
      ]
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          return cand
        }
      }
    }
    throw err
  }
}
