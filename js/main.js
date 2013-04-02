var entries = [],
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
    console.dir(entries);
});

//var t = loadFeed(album_url).done(function(arg){
//    alert('Defff');
//    console.dir(entries);
//    console.log(arg);
//    loadFeed(arg.href);
//}).fail(function(){
//        alert('Fail');
//    });
