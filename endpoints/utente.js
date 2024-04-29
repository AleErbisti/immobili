function endpoint(app, connpool) {

    app.post("/api/immobili", (req, res) => {
        var errors = []
        //controllo dati inseriti
        if (!req.body.psw) {
            errors.push("No description specified");
        }
        if (!req.body.email) {
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
            description: req.body.psw,
            description: req.body.email,
        }

        var sql = 'INSERT INTO utente (psw, email) VALUES (?,?)'
        var params = [data.psw, data.email]
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
        var sql = "select * from utente"
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
        var sql = "select * from utente where idUtente = ?"
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
            description: req.body.psw,
            description: req.body.email,
            
        }
        connpool.execute(
            `UPDATE immobili set 
               description = COALESCE(?,description), 
               status = COALESCE(?,status) 
               WHERE idUtente = ?`,
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
            'DELETE FROM utente WHERE idUtente = ?',
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