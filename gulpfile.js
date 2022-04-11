const { src, dest, watch } = require('gulp');
const gulp = require('gulp');
const minifyCss = require('gulp-clean-css');
const sourceMaps = require('gulp-sourcemaps')
const concat = require('gulp-concat');
 //hier 

 //hier wordt een task aangemaakt
 const cssBundle = () =>  {

//selecteren van css files
 return src('./public/css/**/*.css')

  .pipe(sourceMaps.init())

  //hier wordt het door gulp cleancss gebracht om het te minifyen
  .pipe(minifyCss())
  
  //sourcempas wordt overgeschreven naar de minified files
  .pipe(sourceMaps.write())

  //compilen van alle css files naar 1 css file
  .pipe(concat('bundle.css'))

  //alle folders worden hier dan opgeslagen
  .pipe(dest('./dist/public/css/'));
 }

//run gulptask
 const lWatch = () => {
   watch('./public/css/**/*.css', cssBundle);
 };

//de functies exporteren
 exports.cssBundle = cssBundle;
 exports.lWatch = lWatch;


//bron: https://www.youtube.com/watch?v=imnjg2KEKdU&t=249s
//author DevTuts