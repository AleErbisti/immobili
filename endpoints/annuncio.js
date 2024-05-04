function endpoint(app, connpool) {

    app.post("/api/immobili", (req, res) => {
        var errors = []
        // controllo dati inseriti
        if (!req.body.descrizione) {
            errors.push("No description specified");
        }
        if (!req.body.prezzo) {
            errors.push("No description specified");
        }
        if (!req.body.nstanze) {
            errors.push("No description specified");
        }
        if (!req.body.nbagni) {
            errors.push("No description specified");
        }
        if (!req.body.piano) {
            errors.push("No description specified");
        }
        if (!req.body.datapubblicazione) {
            errors.push("No description specified");
        }
        if (!req.body.idUtente) {
            errors.push("No description specified");
        }
        if (!req.body.idCitta) {
            errors.push("No description specified");
        }
        if (!req.body.idTipo) {
            errors.push("No description specified");
        }
        if (req.body.status === "") {
            errors.push("No status specified");
        }
        
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            descrizione: req.body.descrizione,
            prezzo: req.body.prezzo,
            nstanze: req.body.nstanze,
            nbagni: req.body.nbagni,
            piano: req.body.piano,
            datapubblicazione: req.body.datapubblicazione,
            idUtente: req.body.idUtente,
            idCitta: req.body.idCitta,
            idTipo: req.body.idTipo,

        }

        var sql = 'INSERT INTO annuncio (descrizione,prezzo,nstanze,nbagni,piano,datapubblicazione,idUtente,idCitta,idTipo) VALUES (?,?,?,?,?,?,?,?,?)'
        var params = [data.descrizione, data.prezzo, data.nstanze, data.nbagni, data.piano, data.datapubblicazione, data.idUtente, data.idCitta, data.idTipo]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.insertID
            })
            console.log(results)
        });

    })



    app.get("/api/immobili", (req, res, next) => {
        var sql = "select * from annuncio"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });


    app.get("/api/immobili/:id", (req, res) => {
        var sql = "select * from annuncio where idAnnuncio= ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows[0]
            })
          });
    });


    app.put("/api/immobili/:id", (req, res) => {
        var data = {
            description: req.body.descrizione,
            description: req.body.prezzo,
            description: req.body.nstanze,
            description: req.body.nbagni,
            description: req.body.piano,
            description: req.body.datapubblicazione,
            description: req.body.idUtente,
            description: req.body.idCitta,
            description: req.body.idTipo
        }
        connpool.execute(
            `UPDATE immobili set 
               description = COALESCE(?,description), 
               status = COALESCE(?,status) 
               WHERE idAnnuncio = ?`,
            [data.description, data.status, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                console.log(result )
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
        });
    })



    app.delete("/api/immobili/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM annuncio WHERE idAnnuncio = ?',
            [req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({"message":"deleted", changes: result.affectedRows})
        });
    })


}





module.exports = endpoint;