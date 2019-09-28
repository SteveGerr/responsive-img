var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),       // Подключаем gulp-concat (для конкатенации файлов)
    uglify      = require('gulp-uglifyjs'),     // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano     = require('gulp-cssnano'),      // Подключаем пакет для минификации CSS
    rename      = require('gulp-rename'),       // Подключаем библиотеку для переименования файлов
    del         = require('del'),               //Подключаем библиотеку для удаления файлов и папок
    imagemin    = require('gulp-imagemin'),     // Подключаем библиотеку для работы с изображениями
    pngquant    = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache       = require('gulp-cache'),        // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function(done) {
  done();
  // return gulp.src('app/sass/**/*.sass')//Берем все sass файлы из папки sass и дочерних
  return gulp.src('app/sass/*.sass')//Берем все sass файлы из папки sass и дочерних
  .pipe(sass())// преобразуем sass в css
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest('app/css')) //Сохраняем полученные файлы в app/css
  .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
  
});

gulp.task('browser-sync', function(done) {
  browserSync({
    server: {
      baseDir: 'app' //Direct for server - app
    },
    notify: false //Off notify
  });
  done();
});

gulp.task('scripts', function(done) {
  done();
  return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
        
});


gulp.task('css-libs', gulp.parallel('sass'), function() {
    return gulp.src('app/css/libs.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('watch',  function(done) {
  done();
  gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));// Отслеживаем изменения всех sass файлов
  gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
  gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
}
);

gulp.task('clean', function() {
  return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});



gulp.task('build', gulp.parallel('img', 'sass', 'scripts'), function() {
  var buildcss = gulp.src([//Переносим css стили в продакшн
    'app/css/main.css',
    'app/css/libs.min.css'
  ])
  .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
  .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
  .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
  .pipe(gulp.dest('dist'));
});

gulp.task('clear', function () { // Clear cache 'gulp clear'
    return cache.clearAll();
});

gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'css-libs', 'scripts')); // Для консоли, вместо gulp watch теперь пишем gulp



//Old version

// gulp.task('default', ['watch']); // Для консоли, вместо gulp watch теперь пишем gulp

// gulp.task('clear', function () { // Clear cache 'gulp clear'
//     return cache.clearAll();
// });

// gulp.task('sass', function sass() {
//   return gulp.src('app/sass/**/*.sass')//Берем все sass файлы из папки sass и дочерних
//   .pipe(sass())// преобразуем sass в css
//   .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
//   .pipe(gulp.dest('app/css')) //Сщхраняем полученные файлы в app/css
//   .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
// }
// );
// sass();

// gulp.task('browser-sync', function broSync() {
//   browserSync({
//     server: {
//       baseDir: 'app' //Direct for server - app
//     },
//     notify: false //Off notify
//   });
// }
// );
// broSync();

// gulp.task('watch', ['browser-sync', 'sass', 'css-libs', 'scripts'], function watch() {
//   gulp.watch('app/sass/**/*.sass', ['sass']);// Отслеживаем изменения всех sass файлов
//   gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
//   gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
// }
// );
// watch();

// gulp.task('scripts', function scripts() {
//   return gulp.src([ // Берем все необходимые библиотеки
//         'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
//         'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
//         ])
//         .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
//         .pipe(uglify()) // Сжимаем JS файл
//         .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
// });
// scripts();

// gulp.task('css-libs', ['sass'], function cssLibs() {
//     return gulp.src('app/css/libs.css') // Выбираем файл для минификации
//         .pipe(cssnano()) // Сжимаем
//         .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
//         .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
// });
// cssLibs();

// gulp.task('img', function imgConvert() {
//     return gulp.src('app/img/**/*') // Берем все изображения из app
//         .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
//             interlaced: true,
//             progressive: true,
//             svgoPlugins: [{removeViewBox: false}],
//             use: [pngquant()]
//         })))
//         .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
// });
// imgConvert();

// gulp.task('clean', function clean() {
//     return del.sync('dist'); // Удаляем папку dist перед сборкой
// });

// gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function build() {
//   var buildcss = gulp.src([//Переносим css стили в продакшн
//     'app/css/main.css',
//     'app/css/libs.min.css'
//   ])
//   .pipe(gulp.dest('dist/css'))

//   var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
//   .pipe(gulp.dest('dist/fonts'))

//   var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
//   .pipe(gulp.dest('dist/js'))

//   var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
//   .pipe(gulp.dest('dist'));
// });
// clean();
