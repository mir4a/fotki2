var entries = [],
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
    var docLoc = document.location,
        docLocPr = docLoc['protocol'],
        docLocHs = docLoc['host'],
        docLocP = docLoc['pathname'],
        docLocHash = docLoc['hash'];

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
                alert('app id correct!');
                gen_url = api_url + _author + '/album/' + _album + '/photos/';
            } else {
                alert('wrong!!! app id!');
                alert(gen_url);
                _start = 0;
            }

            alert('start='+_start);

            $.when(loadStatus(gen_url)).done(function(){
                console.log('%%%%%%%%%%');
                slider(entries, step, _start);
            });
        })
        .fail(function(){
            alert('hash a little');
            var newLoc = docLocPr + '//' + docLocHs + docLocP + '#' + appid + ':' + author + ':' + album + ':' + 0;
            document.location = newLoc;

            $.when(loadStatus(album_url)).done(function(){
                console.log('%%%%%%%%%%');
                slider(entries, step, 0);
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
            console.log(json);
            console.log(link);

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

    for (var i=0;i<step;i++) {
        var curI = parseInt(start + i);
        if (curI < items.length) {
            console.warn('iterator == ' + i + '; current image index (items length =' + items.length + ') == ' + curI);
            console.warn('number of images: ' + items[curI].img.length);
            var img = items[curI].img,
                xxxs = img[4].href,
                xxs = img[0].href,
                xs = img[6].href,
                s = img[5].href,
                m = img[2].href,
                l = img[3].href,
                xl = img[1].href;
            console.log('фотки размера xxxs: '+xxxs);
            console.log('фотки размера xxs: '+xxs);
            console.log('фотки размера xs: '+xs);
            console.log('фотки размера s: '+s);
            console.log('фотки размера m: '+m);
            console.log('фотки размера l: '+l);
            console.log('фотки размера xl: '+xl);
//            console.log('фотки размера xxs: '+xxs);
            console.log('length of items='+items.length);
            console.error('curI='+curI);
            console.log('step='+i);
        }
    }
}
