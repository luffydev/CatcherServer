
app.get('/pkmn/list', function(pRequest, pRes)
{
    var lUserID = 1;


    database.query("SELECT * FROM badges WHERE userid = $1 ORDER BY cast(value->>'id' as integer) ASC", [lUserID]).then(function(pResult)
    {
        if(pResult && pResult.rowCount > 0)
        {
            //console.log(pResult);

            var lBuffer = [];

            pResult.rows.forEach(function(pElement)
            {
                lBuffer.push(pElement.value);
            });

            pRes.setHeader('Content-Type', 'application/json');
            pRes.end(JSON.stringify(lBuffer));
        }else
        {
            pRes.end(JSON.stringify({success: false, error: 'empty_set'}));
        }

    }).catch(function()
    {

    });

});

app.get('pkmn/getBadgeStatus', function(pRequest, pRes)
{
});

app.post('/pkmn/syncBadges', function(pRequest, pRes)
{
    var lResponse = pRequest.body;
    var lBadges = JSON.parse(lResponse.badges);
    var lUserID = 1;

    const uuidv4 = require('uuid/v4');

    database.query("DELETE FROM badges WHERE userid = $1", [lUserID]).then(function()
    {
        Object.keys(lBadges).forEach(function(pIterator) {

            var lUUID_V4 = uuidv4();

            database.query("INSERT INTO badges (userid, value, uuid) VALUES($1, $2, $3)", [lUserID, lBadges[pIterator], lUUID_V4]);
        });
    });

    pRes.end(JSON.stringify({result : true}));
});

