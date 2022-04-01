const { src, dest } = require('gulp');
const concat = require('gulp-concat');

const cssBundle = () =>
src('public/css/*.css')


.pipe(concat('styles.css'))
.pipe(dest('dist/css'));

exports.cssBundle = cssBundle;


function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask