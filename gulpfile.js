// Sass configuration
var gulp = require("gulp");
var sass = require("gulp-sass");
var del = require("del");
var rename = require("gulp-rename");
var sequence = require("gulp-sequence");

const dest = "_package";

gulp.task("sass", function() {
    gulp.src("src/**/*.scss")
        .pipe(sass())
        .pipe(
            gulp.dest(function(f) {
                return f.base;
            })
        );
});

gulp.task("clean", function() {
    return del(`${dest}/**`, { force: true });
});

gulp.task("copy-cli-package", function() {
    gulp.src("./src/cli-package.json")
        .pipe(rename("package.json"))
        .pipe(gulp.dest(dest));
});

gulp.task("copy", function() {
    return gulp
        .src(["./build/**/*"], {
            base: "./build/"
        })
        .pipe(gulp.dest(`./${dest}/public`));
});

gulp.task("copy-bin", function() {
    return gulp.src(["./src/bin/**"]).pipe(gulp.dest(`./${dest}/bin`));
});

gulp.task("copy-server", function() {
    return gulp.src(["./src/server.js"]).pipe(gulp.dest(`./${dest}`));
});

gulp.task("default", ["sass"], function() {
    gulp.watch("src/**/*.scss", ["sass"]);
});

gulp.task(
    "deploy",
    sequence("clean", ["copy", "copy-cli-package", "copy-server", "copy-bin"])
);
