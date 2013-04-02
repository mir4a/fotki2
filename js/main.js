
var jqxhr = $.get('proxy.php',{site:'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/'}, function(data){
//    var output = '';
    var xml = data;
//        xmlDoc = $.parseXML(xml),
//        $xml = $(xmlDoc),
//        items = $xml.find('item');


//        console.log(output);
//    wrap.append(output);
//        console.log(xml);
//    var href = $(data).find('.hdtitle').first().children(':first-child').prop('href');
//    var url = href.split('/');
//    href = href.replace(url[2], 'nu.nl');
//
//    // Put the 'href' inside your div as a link
//    $('#myDiv').html('<a href="' + href + '" target="_blank">' + href + '</a>');
alert('start');
//    return xml;

}, 'html');

jqxhr
    .promise()
    .done(function(data){
    alert('done');
//    console.dir(data);
})
    $.when(jqxhr).then(function(data,textStatus,jqXHR){
        alert('done then');
        console.info(jqXHR.status);
//        console.trace(jqXHR);
//        console.time();
//        console.warn(data);
        var xml = data,
//            xmlDoc = $.parseXML(xml),
//            xml = $(xmlDoc),
//            $items = $xml.find('entry'),
            json = $.xml2json(xml);
//            $items = $json.entry;
//            $f = $items.find("f");

//        console.log(xmlDoc);
        console.log(json);
//        console.log($f);
//        console.dir($items);
    });
//    .done(function(data){
//                alert('done');
//        console.dir(data);
//    })
//    .fail(function(){
//                alert('fail');
//    })
//    .always(function(){
//                alert('always');
////                overlay.show(250);
//    });