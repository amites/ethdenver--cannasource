var enumPackageStates = {
  CREATED_ASSET: 0,
  INVENTORY: 1,
  TRANSFERRING: 2,
}

var packageStates = [
    {
      state_name: 'CREATED_ASSET',
      state_enum:  enumPackageStates.CREATED_ASSET
    },{
      state_name: 'INVENTORY',
      state_enum:  enumPackageStates.IMMATURE
    },{
      state_name: 'TRANSFERRING',
      state_enum:  enumPackageStates.VEGATATIVE
    }
];

var assetPackage = {
  unique_id: '',
  asset_type: '',
  type: '',
  quantity: '',
  location: '',
  state: '',
  creation_time: '',
  last_update_time: '',
  transaction_list: [],
};

var packages = [];

function newPackage(){
  var new_assetPackage = {
    unique_id: uuid_hex(),
    asset_type: "PACKAGE",
    type: "Buds",
    quantity: "1 oz",
    strain: "Strain 1",
    location: "Room 2",
    state: "CREATED_ASSET",
    creation_time: parseFloat(new Date().getTime() / 1000.0),
    last_update_time: parseFloat(new Date().getTime() / 1000.0),
    transaction_list: [],
  }
  attempt_stg = "CreateAsset,Package,ID," + newPackage.unique_id + ",TXEE," + globalUser.unique_id;
  transaction_summary = {
    tx_hash: '',
    tx_time: '',
    asset_id: '',
    attempt: attempt_stg,
    result: 'Incomplete',
    tx_class: 'PACKAGE',
    tx_ee: globalUser.unique_id,
  };
  new_assetPackage.transaction_list.push(transaction_summary);
  return (new_assetPackage);
}

var addEvent = contractInstance.AddPackageAssetEvent();
addEvent.watch(function(error,result){
  if(!error){
    console.log("AddPackageAssetEvent ", result, " tx_hash: ", result.transactionHash);
    console.log("AddPackageAssetEvent args ",result.args.assetInfo);
    var result_elems = result.args.assetInfo.split(",");
    var elem_index = 0
    result_elems.forEach(function(elem){
     console.log(elem_index,":",elem);
    });
    var active_asset = packages.find(function(package){
      return package.unique_id === result_elems[2];
    });
    if(active_asset){
      if(active_asset.transaction_list){
          var currentTrans = active_asset.transaction_list.find(function(trans){
            return trans.attempt.startsWith("CreateAsset,Package") && trans.result === "Incomplete";
          });
          //console.log(currentTrans);
          currentTrans.tx_hash = result.transactionHash;
          currentTrans.tx_time = parseFloat(new Date().getTime() / 1000.0);
          currentTrans.result = result.args.assetInfo;
          console.log(active_asset);
          packagePage();
      }else{
          console.log("No active_asset.transaction_list");
      }
    }else{
      console.log("asset not found for: ", result_elems[2]);
    }
  }else{
      console.log(error);
  }
});

var addEvent = contractInstance.GetPackageStatesEvent();
addEvent.watch(function(error,result){
  if(!error){
    console.log("GetPackageStatesEvent ", result, " tx_hash: ", result.transactionHash);
    console.log("GetPackageStatesEvent args ",result.args.assetInfo);
    var result_elems = result.args.assetInfo.split(",");
    var elem_index = 0
    result_elems.forEach(function(elem){
     console.log(elem_index,":",elem);
     elem_index++;
    });
    /*
    current_systemState = result_elems[2];
    console.log(current_systemState);
    var currentTrans = systemStateObject.transaction_list.find(function(trans){
        return trans.attempt.startsWith("GetPlantStates") && trans.result === "Incomplete";
    });
    if(currentTrans){
      currentTrans.tx_hash = result.transactionHash;
      currentTrans.tx_time = parseFloat(new Date().getTime() / 1000.0);
      currentTrans.result = result.args.systemStateInfo;
      plantPage(state_div);
    }else{
      console.log("did not find trans record");
    }
    */
  }else{
      console.log(error);
  }
});

function getPackageStates() {
  /*
  var attempt_stg = "GetPlantStates,TXEE: " + globalUser.unique_id;
  transaction_summary = {
    tx_hash: '',
    asset_id: '',
    attempt: attempt_stg,
    result: 'Incomplete',
    tx_class: '',
    tx_ee: globalUser.unique_id
  };
  systemStateObject.transaction_list.push(transaction_summary);
  */
  contractInstance.GetPackageStates("GetPackageStates", globalUser.unique_id, {from: web3.eth.accounts[0], gas:4000000}, function(result) {
  });
}

function newPackage_Contract(){
  var new_package = newPackage();
  packages.push(new_package);
  console.log(new_package, " ", new_package);
  contractInstance.addPackageAsset(new_package.unique_id, "CreateAsset", "Package", globalUser.unique_id, {from: web3.eth.accounts[0], gas:4000000}, function(result) {
  });
}

function changePackageState(id){
  console.log(id);
  var select_id = 'selected_package_state_'+id;
  console.log(select_id);
  var new_state = $('#'+select_id).val();
  console.log(new_state);
  var active_package = packages.find(function(package){
    return package.unique_id === id;
  });
  if(active_package){
    active_package.state = new_state;
    active_package.last_update_time = parseFloat(new Date().getTime() / 1000.0);
  }else{
    console.log("package not found for ", id);
  }
  packagePage();
}
function draw_package_stub(){
    package_provenance_page_is_active = false;
    $(package_provenance_page_div).html('');
    //package_page_is_active = false;
    //$(package_page_div).html('');
    //$(package_controls_div).html('');
    packagePage();
}

var package_provenance_page_div;
var package_provenance_page_is_active = false;
function provenancePackagePage(package_id){
  package_page_is_active = false;
  $(package_page_div).html('');
  $(package_controls_div).html('');

  package_provenance_page_is_active = true;
  $(package_provenance_page_div).html('');

  var package = packages.find(function(package){
    return package.unique_id === package_id;
  });

  var html = '<button class="btn btn-danger"onclick="draw_package_stub()" >Go Back</button>';
  html += '<b>Package Provenance Table</b>';
  html += '<table class="table table-bordered table-striped" id="package_provenance_table">';
  html += '<tr><th colspan="2">No.</th><th colspan="2">ID</th><th colspan="2">Asset Type</th><th colspan="2">Creation</th><th colspan="2">Package Type</th><th>Currrent State</th><th>Last Update</th></tr>';  // Type, ID, creation, state, last update
  var count = 0;
  html += '<tr><td colspan="2">'+(++count)+'</td><td colspan="2">'+package.unique_id+'</td><td colspan="2">'+package.asset_type+'</td><td colspan="2">'+convertTimeLocal(package.creation_time)+'</td><td colspan="2">'+package.type+'</td><td>'+package.state;
  html += '</td><td>'+convertTimeLocal(package.last_update_time)+'</td>';
  html += '</tr>';

  if(package.transaction_list && package.transaction_list.length > 0){
      package.transaction_list.forEach(function(tx){
        //console.log("trans list ", tx.attempt, " ", tx.result);
        var attempt_items =  tx.attempt.split(",");
        var attempt_stg = '';
        attempt_items.forEach(function(item){
          attempt_stg += item + '<br/>';
        });
        var result_items =  tx.result.split(",");
        var result_stg = '';
        var result_index = 0;
        var txee_user = '';
        result_items.forEach(function(item){
          console.log(result_index,":",item);
          result_index++;
        });
        html += '<tr><td colspan ="12">'+'tx_hash: '+tx.tx_hash+'<br/>time: '+convertTimeLocal(tx.tx_time)+'<br/>Asset: '+ tx.asset_id;
        html += '<br/>' + '<button id="' + tx.tx_hash + '" class="btn btn" onclick="getTransByTxID(\'' + tx.tx_hash + '\')">Get Ledger Tx</button>'+'</td></tr>';
        if(result_items[0] === "CreateAsset"){
          txee_user = users.find(function(user){
            return user.unique_id === result_items[5];
          });
          //var role_name = findStateName(userRoles,parseInt(txee_user.role));
          html += '<tr><td colspan ="3" >' + 'Tx type<br/>' + result_items[0] +'<br/>'+result_items[1]+":"+result_items[2]+'</td><td colspan ="3">Product<br/>'+result_items[3]+ '</td><td colspan ="3">'+result_items[4]+'<br/>'+result_items[5]+'<br/>'+role_name+'</td><td colspan="3" bgcolor="'+ findStateColor(transactionResultStates, result_items[7]) +'">Result<br/>'+result_items[7]+'</td></tr>';
        }else if(result_items[0] === "ModifyStateBloodAsset"){
          txee_user = users.find(function(user){
            return user.unique_id === result_items[7];
          });
          var role_name = findStateName(userRoles,parseInt(txee_user.role));
          console.log(transactionResultStates);
          var color = findStateColor(transactionResultStates, result_items[9]);
          html += '<tr><td colspan ="2">' + 'Tx type:<br/>' + result_items[0] +'<br/>'+result_items[1]+":"+result_items[2]+'</td><td colspan ="2">State Category<br/>'+result_items[3]+ '</td><td colspan ="2">From<br/>'+result_items[4]+'</td><td colspan ="2">To<br/>'+result_items[5]+'</td><td colspan ="2">'+result_items[6]+'<br/>'+result_items[7]+'<br/>'+'role_name'+'</td><td colspan="2" bgcolor="'+ findStateColor(transactionResultStates, result_items[9]) +'">Result<br/>'+result_items[9]+'</td></tr>';
        }
      });
    }
  html += '</table>';
  $(package_provenance_page_div).append(html);
}

var package_page_div;
var package_page_is_active = false;
var package_controls_div;
function packagePage(){
  var asset_page_is_active = false;
  $(asset_div).html('');

  package_page_is_active = true;
  $(package_page_div).html('');

  $(package_controls_div).html('');

  var html = '<button class="btn btn-danger"onclick="draw_inventory_stub()" >Go Back</button>';
  html += '<b>Packages Table</b>';
  html += '<table class="table table-bordered table-striped" id="donor_history_table">';
  html += '<tr><th>No.</th><th>ID</th><th>Asset Type</th><th>Creation</th><th>Package Type</th><th>Currrent State</th><th>Last Update</th><th>Details</th></tr>';  // Type, ID, creation, state, last update
  var count = 0;
  packages.forEach(function(package){
    html += '<tr><td>'+(++count)+'</td><td>'+package.unique_id+'</td><td>'+package.asset_type+'</td><td>'+convertTimeLocal(package.creation_time)+'</td><td>'+package.type+'</td><td>'+package.state;

    var id = "selected_package_state_" + package.unique_id;
    console.log(id);
    html += '<br/><select id="'+ id + '" onchange="changePackageState(\'' + package.unique_id + '\')"'+'>';
    //html += '<br/><select id="selected_package_state" onchange="changePackageState(\'' + package.unique_id + '\')"'+'>';
    packageStates.forEach(function(packageState){
      if(package.state === packageState.state_name ){
        html += '<option selected value="'+ packageState.state_name + '">'+ packageState.state_name + '</option>';
      }else{
        html += '<option value="'+ packageState.state_name + '">'+ packageState.state_name + '</option>';
      }
    });

    html += '</select>';
    html += '</td><td>'+convertTimeLocal(package.last_update_time)+'</td>';
    html += '<td><button id="packagedetails_' + package.unique_id + '" class="btn btn-primary" onclick="provenancePackagePage(\'' + package.unique_id + '\')"><span class="glyphicon glyphicon-tint"></span>&nbsp;Provenance</button>';
    html += '</tr>';
  });
  html += '</table>';
  $(package_page_div).append(html);

  html = '';
  html += '<a href="#" onclick="newPackage_Contract()" class="btn btn-success">Add Package</a>';
  html += '<a href="#" onclick="getPackageStates()" class="btn btn-success">Get Package States</a>';
  $(package_controls_div).append(html);
}

$(document).ready(function() {
    package_page_div = app_container_top.appendChild(document.createElement('div'));
    package_page_div.classList.add('table-responsive');

    package_controls_div = app_container_top.appendChild(document.createElement('div'));

    package_provenance_page_div = app_container_top.appendChild(document.createElement('div'));
    package_provenance_page_div.classList.add('table-responsive');

    var make_packages = false;
    if(make_packages){
      var local_packages = [];
      for(var i = 0; i < 5; i++){
        var new_package = newPackage();
        console.log(new_package);
        local_packages.push(new_package);
      }
      console.log(local_packages);
      global_packages = local_packages;
    }
});