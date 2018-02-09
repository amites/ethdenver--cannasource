
function writeJSONHandler(url, js_object){
  var data = JSON.stringify(js_object);
  console.log(js_object, " ", data);
  $.ajax({
    type: 'POST',
    url: 'php/save_objects.php',
    data: {data : data, path : url},
    cache: false,
    success: success
  });
  function success(msg) {
    //console.log("msg: ", msg);
    console.log("write ok");
  }
}

var global_plants;
var global_packages;
function readJSONHandler(url, type){
  console.log(url, " ",type);
  $.ajax({
        url: url,
        dataType: 'text',
        cache: false
    }).done(success);
    function success(data) {
      //console.log("data: ", data);
      if(type === 'plants'){
        global_plants = JSON.parse(data);
        console.log("global_plants: ",global_plants);
      }else if(type === 'packages'){
        global_packages = JSON.parse(data);
        console.log("global_packages: ",global_packages);
      }
    }
}

function readJSON_Plants(){
  return $.ajax({
        url: 'php/get_plants.php',
        dataType: 'text',
    });
}
