var jqxhr = $.get('proxy.php',{site:'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/'}, function(data){
//var jqxhr = $.get('proxy.php',{site:'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/updated;2013-03-19T17:41:11Z,619984,28797441/?limit=100'}, function(data){
//var jqxhr = $.get('proxy.php',{site:'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/updated;2013-03-19T11:14:54Z,103539,28797441/?limit=100'}, function(data){
//var jqxhr = $.get('proxy.php',{site:'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/updated;2013-03-19T09:41:53Z,51293,28797441/?limit=100'}, function(data){
    console.info('Ajax req done');
}, 'html');

jqxhr
    .promise()
    .done(function(data){
    console.info('done');
//    console.dir(data);
})
    $.when(jqxhr).then(function(data,textStatus,jqXHR){
        console.warn('done then');
        console.info(jqXHR.status);
        var xml = data,
            json = $.xml2json(xml)
            link = json.link,
            $ent = json.entry,
            img_count = json.image_count['value'];

        if (link[2]) {
            var next = link[2]['href'];
            alert(link[2]['rel']);
        } else {
            alert(link[1]['rel']);
        }

        alert(img_count);
        console.log(json);
        console.log(link);
        initGallery($ent);
    });

function initGallery(items) {

    for (var i=0; i<items.length; i++) {
        console.dir(items[i].img);
    }
}