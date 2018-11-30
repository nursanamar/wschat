var http = require('http');
var ws = require('websocket').server;
var port = process.env.PORT || 9000;

var server = http.createServer(function(request,response) {
    console.log("sdasd")
})

server.listen(port,() => {
    console.log("Running on port "+port);
});

wsServer = new ws({
    httpServer: server,
})

wsServer.on("request",function(request) {
    
    let conn = request.accept();
    conn.on("message",function(re) {
        
        let request = JSON.parse(re.utf8Data);
       console.log(request);
        let action = request.action;
        let data = request.data;

        switch (action) {
            case "init":
                conn.userId = data.id;
                let res = {
                    action: "auth",
                    data : "success"
                }
                conn.send(JSON.stringify(res));
                
                break;
            case 'send':
                let to = data.to;
                let text = data.text;
                let payload = {
                    action: "newMsg",
                    data: {
                        id: conn.userId,
                        chat: {
                            text: text,
                            date: Date.now(),
                            isSelf: false
                        }
                    }
                }

                for (let i = 0; i < wsServer.connections.length; i++) {
                    if (wsServer.connections[i].userId == to){
                        wsServer.connections[i].send(JSON.stringify(payload));
                    }
                }

            default:
                break;
        }


        
    })
})