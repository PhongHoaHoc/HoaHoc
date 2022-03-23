var Base64 = {
  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode : function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {

          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
              enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
              enc4 = 64;
          }

          output = output +
          Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
          Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
      }

      return output;
  },

  // public method for decoding
  decode : function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

          enc1 = Base64._keyStr.indexOf(input.charAt(i++));
          enc2 = Base64._keyStr.indexOf(input.charAt(i++));
          enc3 = Base64._keyStr.indexOf(input.charAt(i++));
          enc4 = Base64._keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }
      }

      output = Base64._utf8_decode(output);

      return output;
  },

  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

          var c = string.charCodeAt(n);

          if (c < 128) {
              utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }
      }
      return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while ( i < utftext.length ) {

          c = utftext.charCodeAt(i);

          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          }
          else if((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i+1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
          }
          else {
              c2 = utftext.charCodeAt(i+1);
              c3 = utftext.charCodeAt(i+2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
          }
      }
      return string;
  }
}

function load(url){
  $(".ratio").empty();
  $(".ratio").append(
    `<iframe frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    src="${url}" allowfullscreen=""></iframe>`
  );
}

function loadlist(data, note, title){
  $('.video-content').removeClass('d-none');
  data = JSON.parse(Base64.decode(data));
  icon = ['<i class="fa-solid fa-file-image"></i>', '<i class="fa-solid fa-file-pdf"></i>', '<i class="fa-solid fa-circle-play"></i>', '<i class="fa-solid fa-circle-play"></i>'];
  $(".text-content").empty();
  $('.text-content').removeClass('d-none');
  $(".text-content").append(title);
  $(".note").empty();
  if(note !== "" & note != undefined){
    $(".note-container").removeClass('d-none');
    $(".note").append(`${note}`)
  } else $(".note-container").addClass('d-none');
  $(".listvideo").empty();
  $(".listvideo").append(`<a class="btn d-none" type="button" "></a>`);
  for (e of data) {
    //console.log(e.url);
    if(e.type == 3)
        $(".listvideo").append(
            `<a class="btn btn-outline-secondary text-left" type="button" href="#" onclick="load('https://www.youtube.com/embed/${e.url}')">
            ${icon[e.type]}
            ${e.title}
        </a>`
        );
    else
        $(".listvideo").append(
            `<a class="btn btn-outline-secondary text-left" type="button" href="#" onclick="load('https://drive.google.com/file/d/${e.url}/preview')">
            ${icon[e.type]}
            ${e.title}
        </a>`
        );
  }
  $(".listvideo").append(`<a class="btn d-none" type="button" "></a>`);
}

function tai_chuong(e){
    //data = JSON.parse(Base64.decode(b64));
    var list = '';
    //console.log(e.data);
    var buoi = 1;
    for(elm of e.data){
        //console.log(Base64.encode(JSON.stringify(elm.data)));
        list += 
        `<a type="button" style="border-bottom: 1px solid rgba(0,0,0,.1);" class="btn text-left" href="#" onclick="loadlist('${Base64.encode(JSON.stringify(elm.data))}','${elm.note}','<b>Buổi ${buoi}: </b>${elm.title}')">
            <b>Buổi ${buoi}: </b>${elm.title}
        </a>`;
        buoi++;
    }
    var res =
    `<div class="accordion-item">
        <h2 class="accordion-header" id="${e.id}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${e.id}-content" aria-expanded="false" aria-controls="${e.id}-content">
            ${e.title}
        </button>
        </h2>
        <div id="${e.id}-content" class="accordion-collapse collapse" aria-labelledby="${e.id}" data-bs-parent="#muc-luc">
        <div class="accordion-body">
            <div class="btn-group-vertical gap-2 w-100" role="group" aria-label="Vertical button group">
            <a type="button" class="btn d-none"></a>
            ${list}
            <a type="button" class="btn d-none"></a>
            </div>
        </div>
        </div>
    </div>`
    $('#muc-luc').append(res);
}