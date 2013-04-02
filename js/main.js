var entries = [],
    album_url = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/';

function loadFeed(url) {
    var d = $.Deferred();
    var jqxhr = $.get('proxy.php',{site: url}, function(data){
        console.info('Ajax req done');
    }, 'html');

    jqxhr
        .fail(function(){
        alert('Что пошло не так');
    })
        .done(function(data){
            var xml = data,
                json = $.xml2json(xml)
                link = json.link,
                $ent = json.entry,
                img_count = json.image_count['value'];
            alert(img_count);
            console.log(json);
            console.log(link);

            for (var i=0;i<$ent.length;i++) {
                entries.push($ent[i]);
            }


            if (img_count > 100) {
                var linkNext = link[2].href;
            } else {
                var linkNext = null;
            }


            d.resolve(linkNext);
        });

    return d.promise();
}

var t = loadFeed(album_url).done(function(arg){
    alert('Defff');
    console.dir(entries);
    console.log(arg);
    loadFeed(arg);
}).fail(function(){
        alert('Fail');
    });

//    .done(function(data){
//    console.info('done');
////    console.dir(data);
//})
//    $.when(jqxhr).then(function(data,textStatus,jqXHR){
//        console.warn('done then');
//        console.info(jqXHR.status);
//        var xml = data,
//            json = $.xml2json(xml)
//            link = json.link,
//            $ent = json.entry,
//            img_count = json.image_count['value'];
//
//        if (link[2]) {
//            var next = link[2]['href'];
//            alert(link[2]['rel']);
//        } else {
//            alert(link[1]['rel']);
//        }
//
//        alert(img_count);
//        console.log(json);
//        console.log(link);
//        initGallery($ent);
//    });
//
//function initGallery(items) {
//
//    for (var i=0; i<items.length; i++) {
//        console.dir(items[i].img);
//    }
//}