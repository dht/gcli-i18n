// Sass configuration
var gulp = require("gulp");
var sass = require("gulp-sass");
var del = require("del");
var rename = require("gulp-rename");
var sequence = require("gulp-sequence");
var bump = require("gulp-bump");
var exec = require("child_process").exec;

var dest = "_package";

gulp.task("sass", function() {
    return gulp
        .src("src/**/*.scss")
        .pipe(sass())
        .pipe(
            gulp.dest(function(f) {
                return f.base;
            })
        );
});

gulp.task("bump", function() {
    return gulp
        .src("./src/cli-package.json")
        .pipe(bump())
        .pipe(gulp.dest("./src"));
});

gulp.task("clean", function() {
    return del(`${dest}/**`, { force: true });
});

gulp.task("yarn", function(cb) {
    exec("yarn build", function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
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

gulp.task("publish-package", function(cb) {
    exec("npm publish", { cwd: "_package" }, function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task("install-package", function(cb) {
    exec("npm install -g gcli-i18n", function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task("style", ["sass"], function() {
    gulp.watch("src/**/*.scss", ["sass"]);
});

gulp.task(
    "default",
    sequence("clean", "bump", "yarn", [
        "copy",
        "copy-cli-package",
        "copy-server",
        "copy-bin"
    ])
);

gulp.task("publish", sequence("default", "publish-package", "install-package"));
