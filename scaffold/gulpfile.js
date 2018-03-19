const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');
const copy = require('gulp-copy');
const del = require('del');

const tsProject = ts.createProject('tsconfig.json', {
  // declaration: true
});

gulp.task('clean', function() {
  return del('build/**/*');
});

gulp.task('protoc-copy', function () {
  return gulp.src('src/proto/**/*').pipe(copy('build', {prefix: 1}));
});

gulp.task('typescript', function () {
  let tsResult = gulp.src('src/**/*.ts').pipe(tsProject());

  return merge([
    tsResult.dts.pipe(gulp.dest('build')),
    tsResult.js.pipe(gulp.dest('build'))
  ]);
});

gulp.task('watch', ['clean', 'typescript', 'protoc-copy'], function () {
  gulp.watch('build/**/*', ['clean']);
  gulp.watch('src/**/*.ts', ['typescript']);
  gulp.watch('result/**/*.result', ['protoc-copy']);
});