import debug = require('debug');
import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import routes from './routes/index';
import users from './routes/user';
var fs = require("fs");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


//这里用于 接受 推送
app.all("/devicemsg", function (req, res) {
    var Data = req.body;
    console.log("rev:" + Data);
    if (Data.MsgType == "报警消息") {
        console.log("rev: MsgType:" + Data.MsgType + "  Title:" + Data.Title + "  Context:" + Data.Context);
    } else if (Data.MsgType == "设备回复") {
        console.log("rev: MsgType:" + Data.MsgType + "  Title:" + Data.Title + "  Context:" + Data.Context);
    } else if (Data.MsgType == "文本消息") {
        console.log("rev: MsgType:" + Data.MsgType + "  Title:" + Data.Title + "  Context:" + Data.Context);

    } else if (Data.MsgType == "图片消息" || Data.MsgType == "语音消息") {
        console.log("rev: MsgType:" + Data.MsgType + "  Title:" + Data.Title + "  Context:" + Data.Context);
        var buf = new Buffer(Data.Context, 'base64')
        fs.writeFile(Data.Title, buf, function (err) {
            if (err) throw err;
            console.log(Data.Title + " File Saved !"); //文件被保存
        });
    }
    res.send("收到数据")
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
