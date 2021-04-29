var http = require('http');
var fs = require('fs');
var qs = require('querystring');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://sprisc01:15090cav@cluster0.kfima.mongodb.net/companies?retryWrites=true&w=majority";

http.createServer(function (req, res)
  {

	  if (req.url == "/")
	  {
		  file = 'hw14part2.html';
		  fs.readFile(file, function(err, txt) {
    	  res.writeHead(200, {'Content-Type': 'text/html'});
		  res.write("This is the home page<br>");
          res.write(txt);
          res.end();
		  });
	  }
	  else if (req.url == "/process")
	  {
		 res.writeHead(200, {'Content-Type':'text/html'});
		 pdata = "";
		 req.on('data', data => {
           pdata += data.toString();
         });

		// when complete POST data is received
		req.on('end', () => {
			pdata = qs.parse(pdata);
      MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
      if(err) { return console.log(err); }

      var dbo = db.db("companies");
      if (pdata['ticker'] != "") {
        var ticker = pdata['ticker'];
        ticker = ticker.toUpperCase();
        console.log(ticker);
        dbo.collection("companies").find({"Ticker":ticker}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      } else if (pdata['name'] != "") {
        dbo.collection("companies").find({"Company":pdata['name']}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      }
      });
		});

	  }
	  else
	  {
		  res.writeHead(200, {'Content-Type':'text/html'});
		  res.write ("Unknown page request");
		  res.end();
	  }


}).listen(8080);
