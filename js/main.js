
var jqxhr = $.get('proxy.php',{site:'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/'}, function(data){
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
            json = $.xml2json(xml);
        console.log(json);
    });
