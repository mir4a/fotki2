var entries = [],
    author = 'aig1001',
    album = '63684',
    album_url = 'http://api-fotki.yandex.ru/api/users/miroslav-martynoff/album/127195/photos/';
//    album_url = 'http://api-fotki.yandex.ru/api/users/miroslav-martynoff/album/127192/photos/';
//    album_url = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/';

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
            alert(img_count);
            console.log(json);
            console.log(link);
//            console.log(data.status);

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



$.when(loadStatus(album_url)).done(function(){
    console.log('%%%%%%%%%%');
//    console.dir(entries);
    slider(entries);
});

function slider(items, step) {
    step = step || 10;
    var docLoc = document.location;
    var docLocPr = document.location['protocol'];
    var docLocHs = document.location['host'];
    var docLocP = document.location['pathname'];
    var newLoc = docLocPr + '//' + docLocHs + docLocP + '#author=' + author + '&album=' + album + '&slide=' + '0';
    document.location = newLoc;

//    history.pushState(newLoc);
//    while (step)

    for (var i=0;i<step;i++) {

        if (i < items.length) {
            var img = items[i].img,
                xl = img[3].href;

            console.log('фотки размера xl: '+xl);
        }

        console.log('step='+i);


    }
    console.dir(docLoc);
}
