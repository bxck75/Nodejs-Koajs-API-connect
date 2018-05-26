const koa = require('koa');
const router = require('koa-router');
const RQ = require("request");
const app = new koa();
const RT = new router();
const AuthKey = "<api-key>";
const PointsArr = ['competitions', 'matches', 'player','team'];

function FetchData(E_P, Req_Id='0'){
    
    if (Req_Id > 0){ RequestedId = "/"+Req_Id; } else { RequestedId = ""; }
    
    Url = "http://<api-domain>/2.0/"+E_P+RequestedId+"?Authorization="+AuthKey;

    RQ.get({
        "headers": { "content-type": "application/json" },
        "url": Url
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        return console.dir(JSON.parse(body));
    });
}

function Handler(point){

    var point_name  = point.slice(0,4);

    RT.get("/"+point_name, (req, res) => {
        return FetchData(point);
    });

    RT.get("/"+point_name+"/:num", (req, res) => {
        var competitions = [];
        var num = req.params.num;
        if (isFinite(num) && num  > 0 ) {
            return FetchData(point,num);
        } else {
            console.log('invalid number supplied');
        }
    });
}

RT.get("/", (req, res) => {
    console.log('API alive!');
});

PointsArr.forEach((item) => {
  Handler(item);
});

app.use(RT.routes());
app.listen(3000);
