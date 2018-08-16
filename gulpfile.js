/*
const gulp = require('gulp');

gulp.task('watch', () => {
    gulp.watch('src/style.css', ['css']);
});

gulp.task('css', () => {
    return gulp.src('src/style.css')
        .pipe(gulp.dest('./public/'));
});

gulp.task('publicImages', () => {
    return gulp.src('src/!*.jpeg')
        .pipe(gulp.dest('./public/'));
});*/

const {series, parallel, src, dest} = require('gulp');

const gulp = require('gulp');

function defaultTask(cb) {
    cb();
}

// private task
function build(cb) {
    cb();
}

function cssToPublic() {
    return src('src/style.css')
        .pipe(dest('./public/'));
    // cb();
}

function imagesToPublic() {
    return src('src/*.jpeg')
        .pipe(dest('./public/'));
}

exports.build = parallel(cssToPublic, imagesToPublic);

/*function watchCSS() {

    cb();
}*/

// public export
// exports.build = build;

// private
// exports.build = series(cssToPublic, imagesToPublic, watchCSS);

/*
gulp.task('watch', function() {
    gulp.watch('src/style.css', ['css']);
});

gulp.task('css', function() {
    return gulp.src('src/style.css')
        .pipe(gulp.dest('./public/'));
});

gulp.task('publicImages', function() {
    return gulp.src('src/!*.jpeg')
        .pipe(gulp.dest('./public/'));
});*/
