var enumPlantStates = {
  CREATED_ASSET: 0,
  IMMATURE: 1,
  VEGATATIVE: 2,
  FLOWERING: 3,
  HARVESTED: 4,
  PACKAGED: 4,
  ATTACHED_TAG: 5,
}

var plantStates = [
    {
      state_name: 'CREATED_ASSET',
      state_enum:  enumPlantStates.CREATED_ASSET
    },{
      state_name: 'IMMATURE',
      state_enum:  enumPlantStates.IMMATURE
    },{
      state_name: 'VEGATATIVE',
      state_enum:  enumPlantStates.VEGATATIVE
    },{
      state_name: 'FLOWERING',
      state_enum:  enumPlantStates.FLOWERING
    },{
      state_name: 'HARVESTED',
      state_enum:  enumPlantStates.HARVESTED
    },{
      state_name: 'PACKAGED',
      state_enum:  enumPlantStates.PACKAGED
    },{
      state_name: 'ATTACHED_TAG',
      state_enum:  enumPlantStates.ATTACHED_TAG
    }
];

var assetPlant = {
  unique_id: '',
  asset_type: '',
  strain: '',
  location: '',
  state: '',
  creation_time: '',
  last_update_time: '',
  transaction_list: [],
};

var plants = [];

function newPlant(){
  var new_assetPlant = {
    unique_id: uuid_hex(),
    asset_type: "PLANT",
    strain: "Strain 1",
    locations: "Plant Room",
    state: "CREATED_ASSET",
    creation_time: parseFloat(new Date().getTime() / 1000.0),
    last_update_time: parseFloat(new Date().getTime() / 1000.0),
    transaction_list: [],
  }
  attempt_stg = "CreateAsset,Plant,ID," + new_assetPlant.unique_id + ",TXEE," + globalUser.unique_id;
  transaction_summary = {
    tx_hash: '',
    tx_time: '',
    asset_id: '',
    attempt: attempt_stg,
    result: 'Incomplete',
    tx_class: 'PLANT',
    tx_ee: globalUser.unique_id,
  };
  new_assetPlant.transaction_list.push(transaction_summary);
  return (new_assetPlant);
}

var addEvent = contractInstance.AddPlantAssetEvent();
addEvent.watch(function(error,result){
  if(!error){
    console.log("AddAssetEvent ", result, " tx_hash: ", result.transactionHash);
    console.log("AddAssetEvent args ",result.args.assetInfo);
    var result_elems = result.args.assetInfo.split(",");
    var elem_index = 0
    result_elems.forEach(function(elem){
     console.log(elem_index,":",elem);
    });
    var active_asset = plants.find(function(plant){
      return plant.unique_id === result_elems[2];
    });
    if(active_asset){
      if(active_asset.transaction_list){
          var currentTrans = active_asset.transaction_list.find(function(trans){
            return trans.attempt.startsWith("CreateAsset,Plant") && trans.result === "Incomplete";
          });
          //console.log(currentTrans);
          currentTrans.tx_hash = result.transactionHash;
          currentTrans.tx_time = parseFloat(new Date().getTime() / 1000.0);
          currentTrans.result = result.args.assetInfo;
          console.log(active_asset);
          plantPage();
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

var addEvent = contractInstance.GetPlantStatesEvent();
addEvent.watch(function(error,result){
  if(!error){
    console.log("GetPlantStatesEvent ", result, " tx_hash: ", result.transactionHash);
    console.log("GetPlantStatesEvent args ",result.args.assetInfo);
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

function getPlantStates() {
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
  contractInstance.GetPlantStates("GetPlantStates", globalUser.unique_id, {from: web3.eth.accounts[0], gas:4000000}, function(result) {
  });
}

function newPlant_Contract(){
  var new_plant = newPlant();
  plants.push(new_plant);
  console.log(new_plant, " ", plants);
  contractInstance.addPlantAsset(new_plant.unique_id, "CreateAsset", "Plant", globalUser.unique_id, {from: web3.eth.accounts[0], gas:4000000}, function(result) {
  });
}

function changePlantState(id){
  console.log(id);
  var select_id = 'selected_plant_state_'+id;
  console.log(select_id);
  var new_state = $('#'+select_id).val();
  console.log(new_state);
  var active_plant = plants.find(function(plant){
    return plant.unique_id === id;
  });
  if(active_plant){
    active_plant.state = new_state;
    active_plant.last_update_time = parseFloat(new Date().getTime() / 1000.0);
  }else{
    console.log("plant not found for ", id);
  }
  plantPage();
}

function draw_plant_stub(){
    plant_provenance_page_is_active = false;
    $(plant_provenance_page_div).html('');
    //plant_page_is_active = false;
    //$(plant_page_div).html('');
    //$(plant_controls_div).html('');
    plantPage();
}

var plant_provenance_page_div;
var plant_provenance_page_is_active = false;
function provenancePlantPage(plant_id){
  plant_page_is_active = false;
  $(plant_page_div).html('');
  $(plant_controls_div).html('');

  plant_provenance_page_is_active = false;
  $(plant_provenance_page_div).html('');

  var plant = plants.find(function(plant){
    return plant.unique_id === plant_id;
  });

  var html = '<button class="btn btn-danger"onclick="draw_plant_stub()" >Go Back</button>';
  html += '<b>Plant Provenance Table</b>';
  html += '<table class="table table-bordered table-striped" id="plant_provenance_table">';
  html += '<tr><th colspan ="2">No.</th><th colspan ="2">ID</th><th colspan ="2">Asset Type</th><th colspan ="2">Creation</th><th colspan ="2">Currrent State</th><th colspan ="2">Last Update</th></tr>';  // Type, ID, creation, state, last update
  var count = 0;
    html += '<tr><td colspan ="2">'+(++count)+'</td><td colspan ="2">'+plant.unique_id+'</td><td colspan ="2">'+plant.asset_type+'</td><td colspan ="2">'+convertTimeLocal(plant.creation_time)+'</td><td colspan ="2">'+plant.state;
    html += '</td><td colspan ="2">'+convertTimeLocal(plant.last_update_time)+'</td>';
    html += '</tr>';
    if(plant.transaction_list && plant.transaction_list.length > 0){
        plant.transaction_list.forEach(function(tx){
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
  //});
  html += '</table>';
  $(plant_provenance_page_div).append(html);
}

var plant_page_div;
var plant_page_is_active = false;
var plant_controls_div;

function plantPage(){
  var asset_page_is_active = false;
  $(asset_div).html('');

  plant_page_is_active = true;
  $(plant_page_div).html('');

  $(plant_controls_div).html('');

  var html = '<button class="btn btn-danger"onclick="draw_inventory_stub()" >Go Back</button>';
  html += '<b>Plants Table</b>';
  html += '<table class="table table-bordered table-striped" id="donor_history_table">';

  html += '<tr><th>No.</th><th>ID</th><th>Asset Type</th><th>Creation</th><th>Currrent State</th><th>Last Update</th><th>Details</th></tr>';  // Type, ID, creation, state, last update
  var count = 0;
  plants.forEach(function(plant){
    html += '<tr><td>'+(++count)+'</td><td>'+plant.unique_id+'</td><td>'+plant.asset_type+'</td><td>'+convertTimeLocal(plant.creation_time)+'</td><td>'+plant.state;
    var id = "selected_plant_state_" + plant.unique_id;
    //console.log(id);
    html += '<br/><select id="'+ id + '" onchange="changePlantState(\'' + plant.unique_id + '\')"'+'>';
    plantStates.forEach(function(plantState){
      if(plant.state === plantState.state_name ){
        html += '<option selected value="'+ plantState.state_name + '">'+ plantState.state_name + '</option>';
      }else{
        html += '<option value="'+ plantState.state_name + '">'+ plantState.state_name + '</option>';
      }
    });
    html += '</select>';
    html += '</td><td>'+convertTimeLocal(plant.last_update_time)+'</td>';
    html += '<td><button id="plantdetails_' + plant.unique_id + '" class="btn btn-primary" onclick="provenancePlantPage(\'' + plant.unique_id + '\')"><span class="glyphicon glyphicon-tint"></span>&nbsp;Provenance</button>';
    html += '</tr>';
  });
  html += '</table>';
  $(plant_page_div).append(html);

  html = '';
  html += '<a href="#" onclick="newPlant_Contract()" class="btn btn-success">Add Plant</a>';
  html += '<a href="#" onclick="getPlantStates()" class="btn btn-success">Get Plant States</a>';
  $(plant_controls_div).append(html);
}

$(document).ready(function() {
    plant_page_div = app_container_top.appendChild(document.createElement('div'));
    plant_page_div.classList.add('table-responsive');

    plant_controls_div = app_container_top.appendChild(document.createElement('div'));

    plant_provenance_page_div = app_container_top.appendChild(document.createElement('div'));
    plant_provenance_page_div.classList.add('table-responsive');

    var make_plants = false;
    if(make_plants){
      var local_plants = [];
      for(var i = 0; i < 5; i++){
        var new_plant = newPlant();
        console.log(new_plant);
        local_plants.push(new_plant);
      }
      console.log(local_plants);
      global_plants = local_plants;
    }
});
