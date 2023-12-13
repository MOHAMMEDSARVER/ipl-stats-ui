
google.charts.load('current', { 'packages': ['corechart'] });
let rols= new Set();
 var link="https://ipl-stats-server.onrender.com";

function showTeamNames(){
    const idShowTeamNames=document.getElementById("idShowTeamNames");
    getData(link+'/iplstats/api/v1/teamnames').then(data=>{
        data=getTeamNames(data);
        idShowTeamNames.innerHTML=data;
    });
}

function getTeamNames(teamNames) {
  let str = "<select id='idTeamName' class='form-control' onchange='showPlayers()'>";
  teamNames.forEach(team => {
      str += "<option value='" + team + "'>" + team + "</option>";
  });
  return str;
}

function showRoleNames(){
  const idShowRoleNames=document.getElementById("selectRole");
  let str = "<select id='idRoleName' class='form-control mt-3 mb-3' onchange='showTeamRoleCountrycount()'>";
  rols.forEach(rolename => {
      str += "<option value='" + rolename + "'>" + rolename + "</option>";
  });
  idShowRoleNames.innerHTML=str;  
}
function showTeamRoleCountrycount(){
  google.charts.setOnLoadCallback(drawTeamRoleCountryCountstats);
}



function showPlayers(){
  var teamName= document.getElementById("idTeamName");
  var tname=teamName.value;
  getData('http://localhost:8081/iplstats/api/v1/players/'+encodeURIComponent(tname)).then(data=>{
    console.log('members of the team '+data);
    showPlayersTable(data);
  });

  google.charts.setOnLoadCallback(showTeamRoleAmountStats); 
}




function showPlayersTable(players){
  
  let str = `<table class='table table-striped table-bordered mt-3'>`;
  str += `<thead class='thead-dark'>
          <tr>
          <th>Player Name</th>
          <th>Role</th>
          <th>Team</th>
          <th>Amount</th>
          <th>Country</th>
          </tr>
        </thead>`;
  str += "<tbody>";
  if(players){
    players.forEach(ele=>{
      rols.add(ele.roleName);
      str += `<tr>
      <td> ${ele.name} </td>
      <td>${ele.roleName}</td>
      <td>${ele.teamName}</td>
      <td>${ele.amount}</td>
      <td>${ele.countryName}</td>
      </tr>`
    });

  }
 
  str += `</tbody></table>`;
  document.getElementById("idShowPlayers").innerHTML = str;
  showRoleNames();
}


async function getData(url){
    return await fetch(url).then(res=>res.json());
}

function showTeamAmountStats(){
    console.log("showTeamAmountStats");
    fetch('http://localhost:8081/iplstats/api/v1/players').then(JSON=>JSON.json()).then(res=>{
        console.log(res);
    });

}
showTeamNames();


function teamNames(){
fetch('http://localhost:8081/iplstats/api/v1/teamnames')
  .then(response => {
    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON data in the response
    return response.json();
  })
  .then(data => {
    // Handle the data (list of strings) here
    console.log('Team Names:', data);
  })
  .catch(error => {
    // Handle errors here
    console.error('Error:', error);
  });
}

teamNames();
showTeamAmountStats();

function showTeamStats(){
  google.charts.setOnLoadCallback(drawTeamStats);
  google.charts.setOnLoadCallback(drawRoleAmountstats);
  google.charts.setOnLoadCallback(drawCountryCountStats);
  //google.chart.setOnLoadCallback(drawTeamRoleCountryCountstats);
}
function drawTeamRoleCountryCountstats(){
  var team=document.getElementById("idTeamName").value;
  var role=document.getElementById("idRoleName").value;

  let headings=["Country Name","Player Count"];
  getData('http://localhost:8081/iplstats/api/v1/countrycountstats/'+encodeURIComponent(team)+'/'+encodeURIComponent(role)).then(data=>{
    let inputdata=[];
    data.forEach(ele=>{
      inputdata.push([ele.countryName,ele.count]);
    });
    let title="Team Role Country-Count-Stats";
    let idName="teamrolecountrycountstats";
    drawColumnChart(inputdata,headings,title,idName);
  })


}
function drawCountryCountStats(){
  let headings=["Country Name","Player Count"];
  getData('http://localhost:8081/iplstats/api/v1/countrycountstats').then(data=>{
    let inputdata=[];
    data.forEach(ele=>{
      inputdata.push([ele.countryName,ele.count]);
    });
    let title="Country Count Stats";
    let idName="countryCountStats";
    drawColumnChart(inputdata,headings,title,idName);
  });
}
function drawRoleAmountstats(){
  let headings=["Role","Amount"];
  getData('http://localhost:8081/iplstats/api/v1/roleamountstats').then(data=>{
    let inputdata=[];
    data.forEach(ele=>{
      inputdata.push([ele.rollName,ele.totalAmount]);
    });
    let title="Role Stats";
    let idName="roleAmountstats";
    drawPieChart(inputdata, headings, title, idName);
  });
}

function showTeamRoleAmountStats(){
  let headings=["Role","Amount"];
  var teamName= document.getElementById("idTeamName");
  var tname=teamName.value;
  getData('http://localhost:8081/iplstats/api/v1/teamroleamountstats/'+encodeURIComponent(tname)).then(data=>{
    console.log("team role amount stats "+data);
    let inputdata=[];
    data.forEach(ele=>{
        inputdata.push([ele.rollName,ele.totalAmount]);
    });
    let title="Team Role Amount Stats";
    let idName="idteamroleamountstats";
    drawPieChart(inputdata,headings,title,idName);
  });
  
};

function drawPieChart(inputdata, headings, title, idName)
{
  var data = new google.visualization.DataTable();
  data.addColumn('string',headings[0]);
  data.addColumn('number',headings[1]);

  data.addRows(inputdata);
   var options = {
    'title':`${title}`,
    'with':700,
    'height':300
   };

   console.log(data);
   var chart= new google.visualization.PieChart(document.getElementById(idName));
   chart.draw(data,options);
}

function drawTeamStats(){
  let headings=["Team","Amount"];
  getData('http://localhost:8081/iplstats/api/v1/teamamountstat').then(data=>{
    let inputdata =[];
    data.forEach(team => {
      inputdata.push([team.teamName,team.totalAmount]);
    });
    let title="teamStats";
    let idName="teamamountstat";

    drawColumnChart(inputdata,headings,title,idName);
  });
}

function drawColumnChart(inputdata, headings, title, idName){
  var data = new google.visualization.DataTable();
    data.addColumn('string',headings[0]);
    data.addColumn('number',headings[1]);
    data.addRows(inputdata);
    var options = {
      'title' : `${title}`,
      'width': 450,
      'height':300
    };

    console.log(data);
    var chart=new google.visualization.ColumnChart(document.getElementById(idName));
    chart.draw(data,options);
  
}

showTeamStats();







