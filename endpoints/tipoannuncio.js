function endpoint(app, connpool) {

    app.post("/api/tipoannuncio", (req, res) => {
        var errors = []
        var data = {
            descrizione: req.body.descrizione
        }

        var sql = 'INSERT INTO tipoannuncio (descrizione) VALUES (?)'
        var params = [data.descrizione]
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



    app.get("/api/tipoannuncio", (req, res, next) => {
        var sql = "select * from tipoannuncio"
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


    app.get("/api/tipoannuncio/:id", (req, res) => {
        var sql = "select * from tipoannuncio where idTipo= ?"
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


    app.put("/api/tipoannuncio/:id", (req, res) => {
        var data = {
            "descrizione": req.body.descrizione
        }
        connpool.execute(
            `UPDATE tipoannuncio set 
               descrizione = COALESCE(?,descrizione)
               WHERE idTipo = ?`,
            [data.descrizione, req.params.id],
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



    app.delete("/api/tipoannuncio/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM tipoannuncio WHERE idTipo = ?',
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