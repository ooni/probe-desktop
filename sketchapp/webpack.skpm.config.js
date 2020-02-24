module.exports = config => {
  config.node = {
    console: false,
    global: false,
    fs: false,
    process: true,
    __filename: 'mock',
    __dirname: 'mock',
    Buffer: false,
    setImmediate: false
  };
  config.plugins.push(
    new webpack.IgnorePlugin(/electron|fs|tls|net|child_process|term.js|pty.js|readline|dgram|dns|repl/)
  )
};
