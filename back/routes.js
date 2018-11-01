module.exports = function (app, appService) {

    console.log('Mapping routes....');

    // Node
    app.get('/api/node', function (req, res) {
        appService.configuration()
            .then(cfg=> res.send(cfg))
            .catch(ex=> res.status(500).send(ex.toString()));
    });

    // Authority
    app.get('/api/address', function (req, res) {
        let address = req.query.address;
        // let name = appService.addressToName(address);
        let acc = appService.addressDetails(address);
        res.send(acc);

    });

    app.get('/api/address/all', function (req, res) {
        res.send(appService.allAccounts());
    });

    app.get('/api/address/sender', function (req, res) {
       res.send(appService.getDefaultAccount())
    });

    app.post('/api/address/sender', function (req, res) {
        try {
            let sender = req.body.address;
            let pwd = req.body.password;
            appService.setDefaultAccount(sender, pwd);
            res.status(200).send(appService.getDefaultAccount())
        } catch (err) {
            console.error(err);
            res.status(500).send(err.toString())
        }
    });

    //TODO pass recipient as an argument
    app.post('/api/file/upload', function (req, res) {
        try {
            let file = req.file;
            let recipient = req.body.recipient;
            appService.uploadFile(file, recipient)
                .then(transaction=>{
                    console.log(transaction);
                    res.send(transaction);
                })
                .catch(ex => {
                    console.log(ex.toString());
                    res.status(500).send(ex.toString());
                });
        } catch (error) {
            console.error(error);
            res.status(500).send(error.toString());
        }
    });

    app.get('/api/boxes', function (req, res) {
        let sender = req.query.sender === 'true';
        appService.newBoxEvents(sender)
            .then(events=>{
                res.send(events);
            })
            .catch(ex => {
                console.log(ex.toString());
                res.status(500).send(ex.toString());
            });
    });

    app.get('/api/box', function (req, res) {
        let boxAddress = req.query.boxAddress;
        appService.downloadBox(boxAddress)
            .then(result=>{
                res.writeHead(200, {
                    'Content-Type': result.mimeType,
                    'x-filename': result.filename
                });
                result.stream.pipe(res);
            })
            .catch(error=> {
                console.error(error);
                res.status(500).send(error.toString());
            });
    });

    app.get('/api/box/request', function (req, res) {
        let boxAddress = req.query.boxAddress;
        appService.openRequest(boxAddress)
            .then(transaction=>{
                res.status(200).send(transaction);
            })
            .catch(error=> {
                console.error(error);
                res.status(500).send(error.toString());
            });
    });

    app.get('/api/box/approve', function (req, res) {
        let boxAddress = req.query.boxAddress;
        appService.approveOpenRequest(boxAddress)
            .then(transaction=>{
                res.status(200).send(transaction);
            })
            .catch(error=> {
                console.error(error);
                res.status(500).send(error.toString());
            });
    });

    /*
    app.get('/api/boxe/open', function (req, res) {
        let boxAddress = req.query.box;
        appService.openTheBox(boxAddress)
            .then(events=>{
                res.send(events);
            })
            .catch(ex => {
                console.log(ex.toString());
                res.status(500).send(ex.toString());
            });
    });*/

    // Static resources
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });
};
