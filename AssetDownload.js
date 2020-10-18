let manifestPath = "C:/Users/n/Documents/MuMu共享文件夹/_THCB/main_assets";
let downloadPath = "H:/Users/dell/Music/thcb/download/";
let proxyURL = "http://127.0.0.1:1085";
let isProxy = 1;
let proxy = "";
if (!isProxy) {
    proxy = "";
} else {
    proxy = "--all-proxy=\"" + proxyURL + "\" ";
}
let fs = require('fs');
let readline = require('readline');
let exec = require('child_process').exec;
let manifestData = fs.readFileSync(manifestPath);
let manifest = JSON.parse(manifestData);
let version = manifest.version;
let mainURL = "https://prd-static.touhoucb.app/assets/assetdata/main_assets/Android/" + version + "/";
function main(argv) {
    if (argv != "") {
        if (argv == "getassetlist") {
            nameList = getNameList();
            let out = nameList.join("\n");
            let sortedOut = nameList.sort().join("\n");
            let urlOut = namelist2url(nameList).join("\n");
            let fs2 = require('fs');
            fs2.writeFile("AssetBundleList.txt", out, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log("write AssetBundleList.txt success");
            });
            fs2.writeFile("sortedList.txt", sortedOut, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log("write sortedList.txt success");
            });
            fs2.writeFile("urlList.txt", urlOut, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log("write urlList.txt success");
            });
        }
        else {
            let rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question("download will be started", (answer) => {
                let cmdstring = "aria2c -x 16 " + proxy + mainURL + argv + " -d " + downloadPath;
                exec(cmdstring, function (err, stdout, stderr) {
                    if (err) {
                        console.log('error:' + stderr);
                    } else {
                        console.log(stdout);
                        process.exit(0);
                    }
                });
            });
        }
    }
    else {
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("Please select: \n1. jacket\n2. card\n", (answer) => {
            if (answer == 1) {
                rl.question("Please select: \n1. all large jacket\n2. all jacket\n3. one jacket\n", (answer) => {
                    let jacketList = ""
                    if (answer == 1) {
                        jacketList = getLargeJackets();
                    }
                    let out = namelist2url(jacketList).join("\n");
                    let fs2 = require('fs');
                    fs2.writeFile("tempList.txt", out, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    fs2.writeFile("sortedList.txt", jacketList.sort().join("\n"), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    let cmdstring = "aria2c -x 16 " + proxy + "-i tempList.txt -d " + downloadPath;
                    rl.question("totaly " + jacketList.length + " files, download will be started", (answer) => {
                        exec(cmdstring, function (err, stdout, stderr) {
                            if (err) {
                                console.log('error:' + stderr);
                            } else {
                                console.log(stdout);
                                fs.unlinkSync("tempList.txt");
                                rl.close();
                            }
                        });
                    });
                });
            }
        });
    }
}
function getNameList() {
    let list = [];
    for (i = 0; i < manifest.assetBundles.length; i++) {
        list.push(manifest.assetBundles[i].bundleName);
    }
    return list;
}
function getLargeJackets() {
    let list = [];
    for (i = 0; i < manifest.assetBundles.length; i++) {
        let n = manifest.assetBundles[i].bundleName;
        if (n.match(/^jck_512_/)) {
            list.push(n);
        }
    }
    return list;
}
function namelist2url(list) {
    let urlList = [];
    for (i = 0; i < list.length; i++) {
        urlList.push(mainURL + list[i]);
    }
    return urlList;
}
main(process.argv.slice(2));