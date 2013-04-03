var entries = [],
    doc = $(document),
    docLoc = document.location,
    docLocPr = docLoc['protocol'],
    docLocHs = docLoc['host'],
    docLocP = docLoc['pathname'],
    overlay = $('.b-overlay'),
    step,
    author = 'aig1001',
    album = '63684',
    appid = '55577',
    api_url = 'http://api-fotki.yandex.ru/api/users/',
//    album_url = 'http://api-fotki.yandex.ru/api/users/miroslav-martynoff/album/127195/photos/';
//    album_url = 'http://api-fotki.yandex.ru/api/users/miroslav-martynoff/album/127192/photos/';
    album_url = api_url + author + '/album/' + album + '/photos/';

function parseHash(hash) {
    var d1 = $.Deferred(),
        str = hash.slice(1),
        ar = str.split(':');

        if (ar.length === 4) {
            return d1.resolve(ar);
        } else {
            return d1.reject();
        }
    return d1.promise();
}

function checkUrl() {
    var docLocHash = docLoc['hash'];

    parseHash(docLocHash)
        .done(function(ar){
            console.log('ar===' + ar);
            console.dir(ar);
            var _appid = ar[0],
                _author = ar[1],
                _album = ar[2],
                _start = parseInt(ar[3]),
                gen_url = album_url;

            if (_appid === appid) {
                console.info('app id correct!');
                gen_url = api_url + _author + '/album/' + _album + '/photos/';
            } else {
                console.error('wrong!!! app id!');
                console.info(gen_url);
                _start = 0;
                var newLoc = docLocPr + '//' + docLocHs + docLocP + '#' + appid + ':' + author + ':' + album + ':' + 0;
                docLoc = newLoc;
            }

            console.info('start='+_start);

            $.when(loadStatus(gen_url)).done(function(){
                console.log('%%%%%%%%%%');
                slider(entries, step, _start);
                overlay.fadeOut(500);
            });
        })
        .fail(function(){
            console.warn('no hash - start from beginning');
            var newLoc = docLocPr + '//' + docLocHs + docLocP + '#' + appid + ':' + author + ':' + album + ':' + 0;
            document.location = newLoc;

            $.when(loadStatus(album_url)).done(function(){
                console.log('%%%%%%%%%%');
                slider(entries, step, 0);
                overlay.fadeOut(500);
            });
        });
}
checkUrl();


function loadFeed(url) {
    var d = $.Deferred();
    var jqxhr = $.get('proxy.php',{site: url}, function(data){
        console.info('Ajax req done');
    }, 'html');

    jqxhr
        .fail(d.reject)
        .done(function(data){
            var xml = data,
                json = $.xml2json(xml)
                link = json.link,
                $ent = json.entry,
                img_count = json.image_count;
//            console.log(json);
//            console.log(link);

            for (var i=0;i<$ent.length;i++) {
                entries.push($ent[i]);
            }

            if (link.length === 3) {
                var linkNext = link[2].href;
            } else {
                var linkNext = undefined;
            }

            d.resolve(linkNext);
        });

    return d.promise();
}

function loadStatus(url) {
    return loadFeed(url)
        .pipe(function(linkNext){
            if (linkNext === undefined) {
                return linkNext;
            }
            return loadStatus(linkNext);
        });
}




function slider(items, step, start) {
    step = step || 10;
    start = start || 0;

    var imgWrap = $('.b-slider_wrap'),
        imgHtml = '',
        tmbWrap = $('.b-slider_thumb'),
        tmbHtml = '',
        navWrap = $('.b-slider_nav'),
        navTrigger = navWrap.find('.i-trigger'),
        halfStep = step/2,
        step2 = step,
        lastStep = items.length - halfStep,
        i = 0;

    if (start > 0 && start < lastStep) {
        switch (start) {
            case 1:
                i = -1;
                break;
            case 2:
                i = -2;
                break;
            case 3:
                i = -3;
                break;
            case 4:
                i = -4;
                break;
            case 5:
                i = -(halfStep);
                break;
            default :
                i = -(halfStep);
        }

        step2 = step + i;
    }

    function addEl(id, imgs, tmbs, type) {
            type = type || 'append';
            imgs = imgs || imgHtml;
            tmbs = tmbs || tmbHtml;
        var img = items[id].img,
            title = items[id].title,
            xxxs = img[4].href,
            xxs = img[0].href,
            xs = img[6].href,
            s = img[5].href,
            m = img[2].href,
            l = img[3].href,
            xl = img[1].href;
//        console.log('фотки размера xxxs: '+xxxs);
//        console.log('фотки размера xxs: '+xxs);
//        console.log('фотки размера xs: '+xs);
//        console.log('фотки размера s: '+s);
//        console.log('фотки размера m: '+m);
//        console.log('фотки размера l: '+l);
//        console.log('фотки размера xl: '+xl);
        console.log('length of items='+items.length);
        console.error('curI='+id);
        console.log('step='+i);

        imgs += '' +
            '<div class="b-slider_slide" data-slide="'+id+'">' +
            '   <img src="'+l+'" alt="'+title+'">' +
            '</div>';

        tmbs += '' +
            '<a href="#'+id+'" data-slide="'+id+'" title="'+title+'">' +
            '   <img src="'+xs+'" alt="'+title+'" >' +
            '</a>';

        if (type === 'append') {
            imgWrap.append(imgs);
            tmbWrap.append(tmbs);
        } else if (type === 'prepend') {
            imgWrap.prepend(imgs);
            tmbWrap.prepend(tmbs);
        }

    }

    function loadMore(step,id) {
        id = id || start;
        for (i;i<step2;i++) {
            var curI = parseInt(id + i);
            if (curI < items.length) {
//                console.warn('iterator == ' + i + '; current image index (items length =' + items.length + ') == ' + curI);
//                console.warn('number of images: ' + items[curI].img.length);
                addEl(curI, imgHtml, tmbHtml);

            }
        }

    }

    loadMore(step2);



    if (start > 0) {
        imgWrap.find('.b-slider_slide[data-slide="'+start+'"]').addClass('active').siblings().removeClass('active');
        tmbWrap.find('[data-slide="'+start+'"]').addClass('active').siblings().removeClass('active');
    } else {
        imgWrap.find('.b-slider_slide:first-child').addClass('active').siblings().removeClass('active');
        tmbWrap.find('a:first-child').addClass('active').siblings().removeClass('active');
    }

    tmbWrap.on('click','a[data-slide]', function(e) {
        e.preventDefault();
        console.dir(e);
        var _this = $(this),
            parent = _this.parent(),
            parentW = parent.outerWidth(),
            posX = e.currentTarget['offsetLeft'],
            clientW = e.delegateTarget['clientWidth'],
            tmbW = e.currentTarget['clientWidth'],
            to_left = posX - clientW/2 + tmbW/2,
            dataImg = _this.attr('data-slide');

        parent.css('margin-left', '-' + to_left + 'px');

        console.info('ширина родителя: ' + parentW);
        console.info('Отступ ребенка: ' + posX);
        console.info('на сколько отступать: ' + to_left);

        var clcLoc = docLocPr + '//' + docLocHs + docLocP + '#' + appid + ':' + author + ':' + album + ':' + dataImg;

        document.location = clcLoc;
        $('[data-slide="'+dataImg+'"]').addClass('active').siblings().removeClass('active');
    });

    doc.bind('mousemove', function(e){
        var _this = $(this),
            docW = _this.innerWidth(),
            docH = _this.innerHeight(),
            ex = e.clientX,
            ey = e.clientY;

        if (ey > (docH - 150)) {
            tmbWrap.parent().addClass('active');
        } else {
            tmbWrap.parent().removeClass('active');
        }
    });
    doc.bind('mouseleave', function(e) {
        setTimeout(function(){
            navWrap.fadeOut(200);
        }, 500);
    });

    doc.bind('mouseenter', function(e){
        setTimeout(function(){
            navWrap.fadeIn(250);
        }, 100);
    });

    navTrigger.bind('click', function(e){
        e.preventDefault();
        var _this = $(this),
            hsh = _this.attr('href'),
            way = hsh.slice(1),
            actImg = imgWrap.find('.active'),
            actImgIndex = actImg.attr('data-slide'),
            ind = parseInt(actImgIndex);
        console.warn('ind = ' + ind);
        var indForLoc = ind + 1;



        if (way === 'left') {
            if (ind < 1) {
                alert('first');
            } else {
                var neighbor = $('[data-slide="'+(ind - 1)+'"]');
                console.log('есть кто рядом слева?');
                console.dir(neighbor);
                if (neighbor.length <= 0) {
                } else {
                    indForLoc = ind -1;
                    console.log(neighbor.prev().length == 0);
                    if (neighbor.prev().length === 0) {
                        addEl((ind - 2), '','','prepend');
                    }
                    console.log(neighbor.prev());
                    console.log('сосед слева есть ---------');
                }
                actImg.addClass('left').siblings().removeClass('left');;
                neighbor.addClass('active').siblings().removeClass('active');
            }
        } else if (way === 'right') {
            if (ind === items.length) {
                alert('last');
            } else {
                var neighbor = $('[data-slide="'+(ind +1)+'"]');
                console.log('есть кто рядом справа?');
                console.dir(neighbor);

                if (neighbor.length <= 0) {


                } else {
                    indForLoc = ind + 1;
                    console.log(neighbor.next().length == 0);
                    if (neighbor.next().length === 0) {
                        addEl((ind + 2), '','');
                    }
                    console.log('сосед справа есть ++++++++');

                }
//                loadMore(halfStep,(ind+1));
                actImg.addClass('right').siblings().removeClass('right');;
                neighbor.addClass('active').siblings().removeClass('active');
            }
        }
        var clcLoc = docLocPr + '//' + docLocHs + docLocP + '#' + appid + ':' + author + ':' + album + ':' + indForLoc;

        document.location = clcLoc;

    });
}
