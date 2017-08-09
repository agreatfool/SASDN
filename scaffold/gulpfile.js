const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');
const shell = require('gulp-shell');
const copy = require('gulp-copy');

const tsProject = ts.createProject('tsconfig.json', {
  // declaration: true
});

gulp.task('protoc', function () {
  return gulp.src('gulpfile.js', {read: false}) // dummy src
    .pipe(shell([
      './bash/grpc_compile.sh'
    ]));
});

gulp.task('protoc-copy', ['protoc'], function () {
  return gulp.src('src/result/**/*').pipe(copy('build', {prefix: 1}));
});

gulp.task('typescript', function () {
  let tsResult = gulp.src('src/**/*.ts').pipe(tsProject());

  return merge([
    tsResult.dts.pipe(gulp.dest('build')),
    tsResult.js.pipe(gulp.dest('build'))
  ]);
});

gulp.task('watch', ['typescript', 'protoc-copy'], function () {
  gulp.watch('src/**/*.ts', ['typescript']);
  gulp.watch('result/**/*.result', ['protoc-copy']);
});