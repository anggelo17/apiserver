var request = require("request")
var mysql      = require('mysql');

var feed = "http://38.101.255.70:60003/feed/departures/byStop/"

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'toor',
  database : 'dbtest'
});

connection.connect();


StopsArray=[139,137,136,135,134,133,132,131,130,129,128,127,126,125,123,122,121,120,115,114,113,112,110,
109,108,107,106,105,104,103,102,101,100,43,42,41,40,39,38,37,36,35,34,33,32,31,29,28,27,26,25,24,23,22,
21,20,19,18,17,16,15,14,13,12,11,10,4,3,2,1,48,49,50,51,52,53,54,55,56,57,58,59,6,60,61,62,63,64,65,66,
67,68,69,7,70,71,72,73,74,75,76,77,78,79,8,80,81,82,83,84,85,86,87,88,89,9,91,94,95,96,97,98,99]


var interval = 10 * 1000; // 10 seconds;

for (var i = 0; i <=StopsArray.length-1; i++) {
    setTimeout( function (i) {
        var url = feed+StopsArray[i]+"?preWindow=1200";
        console.log(url);
        request({
    	url: url,
    	json: true
				}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
		        //console.log(body) // Print the json response
		        var arrayStops=body.data
		        if(arrayStops.length>0){
			        console.log(arrayStops[0].predictedDepartureTime);

			        var at=new Date(arrayStops[0].arriveTime).getTime();
			        var dt=new Date(arrayStops[0].departTime).getTime();
			        var routeId=arrayStops[0].routeId;
			        var scheArriveTime=new Date(arrayStops[0].scheduledArrivalTime).getTime();
			        var scheDepartTime=new Date(arrayStops[0].scheduledDepartureTime).getTime();
			        var stopId=arrayStops[0].stopId;
			        var tripId=arrayStops[0].tripId;
			        var vehicleId=arrayStops[0].vehicleId;

			        console.log(at+" "+dt+" "+routeId+" "+scheArriveTime+" "+scheDepartTime+" "+stopId+" "+tripId+" "+vehicleId+"\n")

			        var post  = {arriveTime: vehicleId};

					var query=connection.query('INSERT INTO stop SET ?', post);
					console.log(query.sql)
				
				}
		    }
		})



	}, interval * i, i);
}


connection.end()
