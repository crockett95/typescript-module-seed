'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import merge from 'merge2';
import config from './config';
import karma from 'karma';
import browserSync from 'browser-sync';
import del from 'del';
import sequence from 'run-sequence';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('typedoc', ['clean:docs'], () => {
  return gulp.src(config.paths.src.ts)
    .pipe($.typedoc({ 
      // TypeScript options (see typescript docs) 
      module: "commonjs", 
      target: "es5",
      includeDeclarations: true,
      
      // Output options (see typedoc docs) 
      out: "./typedoc",

      // TypeDoc options (see typedoc docs) 
      name: "my-project", 
      theme: "minimal",
      ignoreCompilerErrors: false,
      version: true,
    }));
});

function lint(files) {
  return gulp.src(files)
    .pipe($.tslint())
    .pipe($.tslint.report('verbose', {
      emitError: false
    }));
}

gulp.task('tslint:src', () => {
  return lint(config.paths.src.ts);
});

gulp.task('tslint:test', () => {
  return lint(config.paths.test.ts);
});

function compileTypescript(files) {
  var tsProj = $.typescript.createProject('tsconfig.json');
  return gulp.src(files)
    .pipe($.sourcemaps.init())
    .pipe($.typescript(tsProj));
}

gulp.task('compile:src', () => {
  return compileTypescript(config.paths.src.ts).js
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(config.paths.dest.temp + '/src'));
});

gulp.task('compile:test', () => {
  return compileTypescript(config.paths.test.ts).js
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(config.paths.dest.temp + '/test'));
});

gulp.task('compile:dist', ['clean:temp', 'clean:dist'], () => {
  var compiled = compileTypescript(config.paths.src.ts);

  return merge([
    compiled.js.pipe(gulp.dest('./.tmp/src')),
    compiled.dts.pipe(gulp.dest('./dist/dts'))
  ]);
});

gulp.task('clean:temp', () => {
  return del('./.tmp');
});

gulp.task('clean:dist', () => {
  return del('./dist');
});

gulp.task('clean:docs', () => {
  return del('./typedoc');
});

function runKarma(tdd, cb) {
  return new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: !tdd
  }, cb).start();
}

gulp.task('test', ['build:dev'], (done) => {
  runKarma(false, () => {
    gulp.src('.tmp/coverage/**/*.json')
        .pipe($.istanbulReport())
    done();
  });
});

gulp.task('watch:dev', (done) => {
  runKarma(true, done);

  gulp.watch(config.paths.src.ts, ['compile:src', 'tslint:src', 'typedoc']);
  gulp.watch(config.paths.test.ts, ['compile:test', 'tslint:test']);
});

gulp.task('serve:dev', (done) => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'examples', 'test'],
      routes: {
        '/bower_components': 'bower_components',
        '/coverage': '.tmp/coverage/html',
        '/typedoc': 'typedoc'
      }
    }
  });

  gulp.watch(['./.tmp/src/**/*.js', 'examples/**/*.*', 'test/runners/**/*.html'])
    .on('change', reload);
});

gulp.task('build:dev', (done) => {
  sequence(
    'clean:temp',
    ['tslint:src', 'tslint:test', 'compile:src', 'compile:test', 'typedoc'],
    done);
});

gulp.task('build:dist', ['compile:dist'], () => {
  return $.requirejs(config.requireBuild)
    .pipe($.uglify({
      preserveComments: 'license'
    }))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', (done) => { sequence('build:dev', 'watch:dev', done); });
gulp.task('serve', (done) => { 
  sequence(
    'build:dev',
    ['watch:dev', 'serve:dev'],
    done);
});
gulp.task('build', ['build:dist', 'typedoc'])
gulp.task('default', (done) => { sequence('test', 'build') });

module.exports = gulp;
