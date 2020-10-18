var path="H:/Users/dell/Music/thcb/acb_other";
var url="https://prd-static.touhoucb.app/assets/sounddata/prd200819C8CAD968934693BBB6F9114560BE04/";
//console.clear();
const readline=require('readline');
const r1=readline.createInterface({
	input:process.stdin,
	output:process.stdout,
	prompt:'please input a line:'
});
//r1.setPrompt('please input a line:');
r1.prompt();
r1.on('line',function(line){
	if(line.match(/([\w.]*)\,(\w{32})\,?/)==null){
		console.log("input,error!!");
		r1.close();
		process.exit(0);
	};
	var fname=line.match(/([\w.]*)\,(\w{32})\,?/)[1];
	var fhash=line.match(/([\w.]*)\,(\w{32})\,?/)[2];
	//console.log(fname+fhash);
	var crypto = require('crypto');
	var h = crypto.createHash('md5');
	h.update(fname);
	h.update(fhash);
	rhash=h.digest('hex');
	//console.log(rhash);
	var exec = require('child_process').exec;
	var cmdstring='aria2c -x 16 --all-proxy="http://127.0.0.1:1085" "'+url+rhash+'" -d "'+path+'" -o '+fname+'';
	exec(cmdstring, function(err,stdout,stderr){
    	if(err) {
        	console.log('error:'+stderr);
        	r1.prompt();
    	} else {
    		//var data = JSON.parse(stdout);
        	console.log(stdout);
        	r1.prompt();
    	}
	});
/*	var fs = require('fs');
	fs.stat(path+'/'+fname, function(err, stat){
    	if(stat&&stat.isFile()) {
		console.log('file exist');
		r1.prompt();
    	} else {
		console.log('file not exist');
    	}
	});*/
});