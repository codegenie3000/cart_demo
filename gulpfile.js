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

const {watch, parallel, series, src, dest} = require('gulp');

// const gulp = require('gulp');

function cssToPublic() {
    return src('src/style.css')
        .pipe(dest('./public/'));
}

function imagesToPublic() {
    return src('src/*.jpeg')
        .pipe(dest('./public/'));
}

/*function watchCSS() {
    watch('src/style.css', cssToPublic);
}*/

function watchCSS() {
    const watcher = watch('src/style.css', cssToPublic);
    watcher.on('change', function() {
        console.log('ran');
    });
}

const watcher = watch('src/style.css', cssToPublic);
watcher.on('change', function(path) {
    console.log('File ' + path + ' was changed');
});

// const build = series(parallel(cssToPublic, imagesToPublic), watchCSS);

const build = series(imagesToPublic, watchCSS);

exports.build = build;

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
