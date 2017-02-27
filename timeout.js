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

StopsArray=[56,46,36];


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
