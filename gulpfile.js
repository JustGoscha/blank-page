var gulp = require("gulp");
var concat = require("gulp-concat");
var babel = require("gulp-babel");
var path = require("path");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var babelify = require("babelify");
var autoprefixer = require("gulp-autoprefixer");
var less = require("gulp-less");

gulp.task("js", function(done) {
  var b = browserify({
    entries: "js/main.js",
    fullPaths: false,
    extensions: [".js"],
    debug: true
  });

  return b
    .transform(babelify)
    .bundle()
    .pipe(source("blank-page.js"))
    .pipe(gulp.dest("build"))
    .on("end", done);

  // include main.js first, exclude js/lib
  // gulp.src(['js/**/main.js','js/**/*.js', '!js/lib/*'])
  // .pipe(babel())
  // .pipe(concat('bundle.js'))
  // .pipe(gulp.dest('build'));
});

gulp.task("less", function(done) {
  gulp
    .src(["./less/blank-page.less"])
    .pipe(
      less({
        paths: [path.join(__dirname, "less", "includes")]
      })
    )
    .pipe(
      autoprefixer({
        browsers: ["> 1%"]
      })
    )
    .pipe(gulp.dest("build/"))
    .on("end", done);
});

gulp.task("default", gulp.series("js"));
gulp.task("build", gulp.series("js", "less"));
