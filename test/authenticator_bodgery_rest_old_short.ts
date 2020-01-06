import * as tap from 'tap';
import * as Bodgery from '../index';
import * as Doorbot from '@frezik/doorbot-ts';
import * as Express from 'express';
import * as os from 'os';

Doorbot.init_logger( os.tmpdir() + "/doorbot_test.log"  );

const PORT = 5001;
const TEST_SITE = "localhost";
const GOOD_KEY_SHORT = "123456789";
const GOOD_KEY = "0123456789";

tap.plan( 1 );

const http_app = Express();
http_app.get( '/check_tag/:rfid', (req, res) => {
    const rfid = req.params.rfid;

    if( rfid == GOOD_KEY ) {
        res.sendStatus( 200 );
    }
    else {
        res.sendStatus( 404 );
    }
});

let server = require( 'http' ).createServer( http_app );

server.listen( PORT, () => {
    const auth = new Bodgery.BodgeryOldAPIAuthenticator(
        "localhost"
        ,PORT
        ,"http"
    );
    const act = new Doorbot.DoNothingActivator( () => {
        tap.pass( "Callback made" );
    });
    auth.setActivator( act );

    const good_data = new Doorbot.ReadData( GOOD_KEY_SHORT );

    const auth_promise_allowed = auth.authenticate( good_data );
    Promise
        .all([
            auth_promise_allowed
        ])
        .then( (res) => {
            server.close();
        } );
});
