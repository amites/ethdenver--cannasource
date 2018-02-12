var enumUserRoles = {
  ANONYMOUS: 0,
  EMPLOYEE: 1,
  REGULATOR: 2,
}

var userRoles = [
    {
      state_name: 'ANONYMOUS',
      state_enum:  enumUserRoles.ANONYMOUS
    },{
      state_name: 'EMPLOYEE',
      state_enum:  enumUserRoles.EMPLOYEE
    },{
      state_name: 'REGULATOR',
      state_enum:  enumUserRoles.REGULATOR
    }
];

var user = {
  unique_id: '',
  role: '',
  facility: '',
};

var users = [];

var user_op_string = "No Pending Op";

var user_details_page_is_active = false;
var user_details_page_div;

function user_Contract(id, mode){
  console.log(id, " ",mode);
}

function userDetails(id, mode){
  console.log(id, " ",mode);
  var active_user;
  if(mode === 'new'){
    var new_user = {
      unique_id: uuid_hex(),
      role: 0,
      facility: 'NONE',
    }
    active_user = new_user;
  }else if(mode === 'update'){
    active_user = users.find(function(user){
      return user.unique_id === id;
    });
  }
  if(active_user){
  }else{
    console.log("active user not found for: ", id);
  }
  user_details_page_is_active = true;
  $(user_details_page_div).html('');
  var user_btn_title = 'Update User';
  if(mode === 'new'){
    user_btn_title = 'New User';
  }
  var html = '';
  html += '<a href="#" onclick="user_Contract(\'' + active_user.unique_id + '\', \''+mode+'\')" class="btn btn-success">'+user_btn_title+'</a>';
  html += '<b>User Details Table</b>';
  html += '<table class="table table-bordered table-striped" id="user_details_table">';
  html += '<tr><th>ID</th><th>Role</th><th>Facility</th></tr>';
  html += '<tr><td>'+active_user.unique_id+'</td>';
  //html +='<td>'+findStateName(userRoles,active_user.role)+'</td>';
  // +findStateName(userRoles,active_user.role)
  html +='</td><td colspan="1">'+ 'Role: <br/><select id='+ 'user_role_' + active_user.unique_id +'>';
  userRoles.forEach(function(state){
    //console.log(asset.storage_location, ' ',state.state_enum);
      if(parseInt(active_user.role) === state.state_enum){
        html += '<option selected value="'+ state.state_name + '">'+ state.state_name + '</option>';
      }else{
        html += '<option value="'+ state.state_name + '">'+ state.state_name + '</option>';
      }
  });
  html += '</select></td>';

  html +='<td colspan="1">'+ 'Facility: <br/><select id='+ 'user_facility_' + active_user.unique_id +'>';
  listFacilities.forEach(function(state){
      console.log(active_user.facility, ' ',state.state_name);
      if(active_user.facility === state.state_name){
        html += '<option selected value="'+ state.state_name + '">'+ state.state_name + '</option>';
      }else{
        html += '<option value="'+ state.state_name + '">'+ state.state_name + '</option>';
      }
  });
  html += '</select></td>';

  //html += '<td>'+active_user.facility+'</td>';

  html += '</tr>';
  html += '</table>';
  $(user_details_page_div).append(html);
}

var user_page_is_active = true;
var user_page_div;
var user_controls_div;
function userPage(){
  asset_page_is_active = false;
  $(asset_div).html('');

  user_page_is_active = true;
  $(user_page_div).html('');

  $(user_controls_div).html('');

  var html = '<button class="btn btn-danger"onclick="draw_inventory_stub()" >Go Back</button>';
  html += '<td><button id='+'new_user'+ ' class="btn btn-success" onclick="userDetails(\'' + '' + '\', \''+'new'+'\')">Add User</button></td>';
  html += '<b>Users Table</b>';
  html += '<input id="user_op_info" type="text name="Operation">';
  html += '<table class="table table-bordered table-striped" id="user_table">';
  html += '<tr><th>No.</th><th>ID</th><th>Role</th><th>Facility</th><th>Actions</th></tr>';
  var count = 0;
  users.forEach(function(user){
    html += '<tr><td>'+(++count)+'</td><td>'+user.unique_id+'</td><td>'+findStateName(userRoles,user.role)+'</td><td>'+user.facility+'</td>';
    var id = 'user_details_' + user.unique_id;
    html += '<td><button id='+id+ ' class="btn btn-success" onclick="userDetails(\'' + user.unique_id + '\', \''+'update'+'\')">Details</button></td>';
    html +='</tr>';
    html += '</tr>';
  });
  html += '</table>';
  $(user_page_div).append(html);

  //html = '';
  //html += '<a href="#" onclick="newUser_Contract()" class="btn btn-success">Add User</a>';
  //$(user_controls_div).append(html);
  document.getElementById("user_op_info").value = user_op_string;
}

function makeUser(role, facility){
  var new_user = {
    unique_id: uuid_hex(),
    role: role,
    facility: facility,
  };
  return new_user;
}

$(document).ready(function() {
  user_page_div = app_container_top.appendChild(document.createElement('div'));
  user_page_div.classList.add('table-responsive');
  user_controls_div = app_container_top.appendChild(document.createElement('div'));

  user_details_page_div = app_container_top.appendChild(document.createElement('div'));
  user_details_page_div.classList.add('table-responsive');

  var make_users = true;
  if(make_users){
    make_users = false;
    for(var i = 0; i < 3; i++){
      users.push(makeUser(i, 'FACILITY_1'));
    }
  }
  console.log(users);
});
