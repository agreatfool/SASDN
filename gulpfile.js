const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');
const copy = require('gulp-copy');

const tsProject = ts.createProject('tsconfig.json', {
  declaration: true
});

gulp.task('tpl-copy', function () {
  return gulp.src('src/bin/template/**/*').pipe(copy('build', {prefix: 1}));
});

gulp.task('typescript', function () {
  let tsResult = gulp.src('src/**/*.ts').pipe(tsProject());

  return merge([
    tsResult.dts.pipe(gulp.dest('build')),
    tsResult.js.pipe(gulp.dest('build'))
  ]);
});

gulp.task('watch', ['typescript', 'tpl-copy'], function () {
  gulp.watch('src/**/*.ts', ['typescript']);
  gulp.watch('src/bin/template/**/*', ['tpl-copy']);
});