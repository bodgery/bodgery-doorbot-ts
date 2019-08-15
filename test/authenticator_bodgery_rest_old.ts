import * as tap from 'tap';
import * as Bodgery from '../index';
import * as Doorbot from '@frezik/doorbot-ts';
import * as Express from 'express';

const PORT = 5001;
const TEST_SITE = "localhost";
const GOOD_KEY = "is_allowed_key";
const BAD_KEY = "is_not_allowed_key";

// Only triggers callback once, as second call should not go through
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

    const good_data = new Doorbot.ReadData( GOOD_KEY );
    const bad_data = new Doorbot.ReadData( BAD_KEY );

    const auth_promise_allowed = auth.authenticate( good_data );
    const auth_promise_not_allowed = auth.authenticate( bad_data );
    Promise
        .all([
            auth_promise_allowed
            ,auth_promise_not_allowed
        ])
        .then( (res) => {
            server.close();
        } );
});
