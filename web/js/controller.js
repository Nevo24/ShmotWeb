var app=angular.module('shmotApp', []);
userData = [];
app.controller('loginCtrl', function($scope)
{
    $scope.validate= function(){
        userData=[];
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        getData(username, password, "login");
        console.log('here: '+ userData);
        if (userData.Username == username){
            alert ("Login successfully");
            localStorage.setItem('loggedInUser', username);
            window.location = "index.html";
            return false;
        }
        else{
            alert("wrong password, try again");
            document.getElementById("username").value="";
            document.getElementById("password").value="";
        }
    }
}
);
app.controller('tableCtrl',function($scope, $http)
	{
        userData=[];
        getData("","","leaders");

        var data=[];
        for (var i=0;i<userData.LeadersBoard.length;i++) {
            data.push({"username":userData.LeadersBoard[i][0],
                "score":userData.LeadersBoard[i][1],
                "filtType":userData.LeadersBoard[i][2]});
        }
        data.push({"username":"Ratnesh Singh",
            "score":100,
            "filtType":"The total gross profit"});

        $scope.filtData = data;

		$http.get('tableData/filtType.json').success(function(filtData)
			{
					$scope.filtType = filtData;
			}
		);

  	}
);

app.controller('statisticsCtrl', function($scope)
    {
        userData=[];
        var username=localStorage.getItem('loggedInUser');
        getData(username,"","statistics");
        $scope.dolars=userData.DolarsWinRate;
        $scope.grossProfit=userData.GrossProfitWinRate;
    });

function getData(username, password, type) {
    var url;
    switch (type){
        case "login":
             url= "https://localhost:55802/api/System?username=" + username + "&password="+password;
            break;
        case "statistics":
            url= "https://localhost:55802/api/System?username=" + username;
            break;
        case "leaders":
            url= "https://localhost:55802/api/System";
            break;
    }
    //const url = "https://localhost:55802/api/System?username=" + username + "&password="+password;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        const done = 4;
        if (xhr.readyState === done) {
            const ok = 200;
            if (xhr.status === ok) {
                userData = JSON.parse(xhr.responseText);
                console.log('bla: '+ userData)
            } else {
                console.log("Error: ${xhr.status}");
            }
        }
    };
    try{
        xhr.open("GET", url, false); // add false to synchronous request
        xhr.send();
    }
    catch(e){
        console.log("errorrrrrrrrrrrrrrrrrrrrr: "+ e);
    }
}


