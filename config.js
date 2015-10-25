module.exports = {
  paths: {
    src: {
      ts: './src/**/*.ts'
    },
    test: {
      ts: './test/**/*.ts'
    },
    typings: './tools/typings/*/**/*.d.ts',
    dest: {
      temp: './.tmp',
      build: './dist'
    }
  },
  requireBuild: {
    baseUrl: '.tmp/src/',
    out: 'main.min.js',
    name: '../../node_modules/almond/almond',
    include: ['main', 'jquery'],
    wrap: {
      startFile: ["./dev/frags/banner.frag", "./dev/frags/start.frag"],
      endFile: "./dev/frags/end.frag"
    },
    rawText: {
        'jquery': 'define(function () { return jQuery; });\n'
    }
  }
}