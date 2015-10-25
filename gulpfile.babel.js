'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import merge from 'merge2';
import config from './config';
import karma from 'karma';

const $ = gulpLoadPlugins();
// const tsProj = $.typescript.createProject('tsconfig.json');

gulp.task('tslint:src', () => {
  return gulp.src(config.paths.src.ts)
    .pipe($.tslint())
    .pipe($.tslint.report('verbose', {
      emitError: false
    }));
});

gulp.task('compile:dev', () => {
  var tsProj = $.typescript.createProject('tsconfig.json');
  var result = gulp.src(config.paths.src.ts)
    .pipe($.sourcemaps.init())
    .pipe($.typescript(tsProj));

  return result.js
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(config.paths.dest.temp + '/src'));
});

gulp.task('compile:test', () => {
  var tsProj = $.typescript.createProject('tsconfig.json');
  var result = gulp.src(config.paths.test.ts)
    .pipe($.sourcemaps.init())
    .pipe($.typescript(tsProj));

  return result.js
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(config.paths.dest.temp + '/test'));
});

gulp.task('test', ['typescript:dev'], (done) => {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, () => {
    gulp.src('.tmp/coverage/**/*.json')
        .pipe($.istanbulReport())
    done();
  }).start();
});

gulp.task('typescript:dev', ['tslint:src', 'compile:dev', 'compile:test']);
gulp.task('default', ['typescript:dev']);