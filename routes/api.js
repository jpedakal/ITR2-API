const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
require('dotenv').config();
const oracledb = require('oracledb');

var database23_ITG = (
    {
        user: process.env.USER23_ITG,
        password: process.env.PASSWORD23_ITG,
        connectString: process.env.ORACLE_DEV_DB_TNS_NAME23_ITG
    });

router.get('/', (req, res) => {
    res.send('<h1>Welcome to Hubot ITR</h1>');
});

router.get('/:vCIname(*)', (req, res) => {
    oracledb.getConnection(database23_ITG, function (err, connection) {
        var counter = 0;
        if (connection) {
            var data = [];
            var vCIname = req.params.vCIname.split(',');
            vCIname.forEach(input => {
                if (input.trim() == "" || input.trim() == undefined || input.trim() == null) { 
                    res.status(200).json(`Invalid vCIname`); res.end();
                }
                else {
                    connection.execute(`select CI_LGCL_NM,CI_D_KY,CI_STAT_KY from itr23.ci_dtl_f where ci_lgcl_nm  = '${input}'`, function (err, result) {
                        if (result.rows.length != 0) {
                            data.push({ "Availability": `${input} available in itr23.ci_dtl_f`, "Result": result });
                            counter++;
                            if (counter == vCIname.length) { res.status(200).json(data); res.end(); }
                        }
                        else if (result.rows.length == 0) {
                            connection.execute(`select * from itr23.ci_d where ci_lgcl_nm  = '${input}'`, function (err, result) {
                                if (result.rows.length != 0) {
                                    data.push({ "Availability": `${input} available in itr23.ci_d and not availablein itr23.ci_dtl_f`, "Result": result });
                                    counter++;
                                    if (counter == vCIname.length) { res.status(200).json(data); res.end(); }
                                }
                                else if (result.rows.length == 0) {
                                    connection.execute(`select * from itr22.CI_NC where ci_lgcl_nm = '${input}'`, function (err, result) {
                                        if (result.rows.length != 0) {
                                            data.push({ "Availability": `${input} available in itr22.CI_NC and not availablein itr23.ci_d and itr23.ci_dtl_f`, "Result": result });
                                            counter++;
                                            if (counter == vCIname.length) { res.status(200).json(data); res.end(); }
                                        }
                                        else if (result.rows.length == 0) {
                                            connection.execute(`select * from itr22.CI where ci_lgcl_nm = '${input}'`, function (err, result) {
                                                if (result.rows.length != 0) {
                                                    data.push({ "Availability": `${input} available in itr22.CI and not availablein itr22.CI_NC,itr23.ci_d and itr23.ci_dtl_f`, "Result": result });
                                                    counter++;
                                                    if (counter == vCIname.length) { res.status(200).json(data); res.end(); }
                                                }
                                                else if (result.rows.length == 0) {
                                                    connection.execute(`select * from itr21.device2m1 where LOGICAL_NAME = '${input}'`, function (err, result) {
                                                        if (result.rows.length != 0) {
                                                            data.push({ "Availability": `${input} available in itr21.device2m1 and not availablein  itr22.CI, itr22.CI_NC,itr23.ci_d and itr23.ci_dtl_f`, "Result": result });
                                                            counter++;
                                                            if (counter == vCIname.length) { res.status(200).json(data); res.end(); }
                                                        }
                                                        else if (result.rows.length == 0) {
                                                            data.push({ "Availability": `${input} is not available in Database` });
                                                            counter++;
                                                            if (counter == vCIname.length) { res.status(200).json(data); res.end(); }
                                                        }
                                                        else res.status(400).json(err);
                                                    })
                                                }
                                                else res.status(400).json(err);
                                            })
                                        }
                                        else res.status(400).json(err);
                                    })
                                }
                                else res.status(400).json(err);
                            })
                        }
                        else res.status(400).json(err);
                    })
                }
            });
        }
        else res.json('Unable to access Database; '+ err);
    })
});

module.exports = router;