const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = path.join(process.cwd(), 'dist');
const output = fs.createWriteStream(path.join(distDir, "..", 'game.zip'));

const archive = archiver('zip', { zlib: { level: 9 } });

archive.pipe(output);

// append a file
archive.glob('*.*', { cwd: distDir });

// archive.file(distDir + '*.*', {cwd:__dirname});
console.log(distDir )
archive.finalize();