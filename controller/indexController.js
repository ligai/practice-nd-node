var nodemailer = require('nodemailer');
var querystring = require('querystring');

var controller = {}
var success = {
    data:null,
    success:true,
    message:'操作成功!',
};

/**
 * -------------------------
 * 用户反馈
 * -------------------------
 */
controller.sendFeedback = (req, res) => {
    var data = null;
    req.on('data', (chunk) => {
        data += chunk;

    }).on('end', () => {
        var content = null;
        data = querystring.parse(data);
        var url = "http://localhost:3030/feedback?id="+req.query.id+"&title="+data.title+"&type="+data.type+"&operation="+data.operation+"&remark="+ data.remark;
        content = '<p>用户编号：'+ req.query.id +'</p>';
        content += '<p>文章标题：'+ data.title +'</p>';
        content += '<p>文章操作：'+ data.operation +' </p>';
        content += '<p>文章类型：'+ data.type +'</p>';
		content += '<p>用户说明：'+ data.remark +'</p>'
        content += '<p>处理链接：<a href="'+ url +'">'+ url +'</a></p>';
        
        sendMail('173.116@cn.fujitsu.com', content, function (result) {
            if (result) {
                success.message = '反馈成功!';
                res.send(success);
            }
        });

    });
};




/**
 * -----------------------------------
 *  邮件发送
 * -----------------------------------
 */

function sendMail (email,content, callback) {
	var mailTransport = nodemailer.createTransport({
		host:'smtp.sina.cn',
		port: 25,
		proxy: 'http://10.167.32.133:8080/',
		auth:{
			user:'sznoreply@sina.com',
			pass:'65239010'
		}
	});
	mailTransport.sendMail({
		from:'用户反馈 <sznoreply@sina.com>',
		to: email,
		subject:'用户反馈',
		generateTextFromHTML: true,
		html: content,
	}, function(error, response){
		if(error){
			throw error;
		} else {
			callback(true);
		}
		mailTransport.close();
	});
}

module.exports = controller;

