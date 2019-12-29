import * as tap from 'tap';
import * as Bodgery from '../index';
import * as Doorbot from '@frezik/doorbot-ts';
import * as Express from 'express';
import * as os from 'os';

Doorbot.init_logger( os.tmpdir() + "/doorbot_test.log"  );

const PORT = 5002;
const TEST_SITE = "localhost";
const GOOD_KEY = "1234";
const BAD_KEY = "5678";

// Only triggers callback once, as the activator should not go through
tap.plan( 1 );

const http_app = Express();
http_app.get( '/no-path', (req, res) => {
    res.sendStatus( 200 );
});

let server = require( 'http' ).createServer( http_app );

server.listen( PORT, () => {
    const auth = new Bodgery.BodgeryOldAPIAuthenticator(
        "localhost"
        ,9999
        ,"http"
    );
    const act = new Doorbot.DoNothingActivator( () => {
        tap.fail( "Callback made" );
    });
    auth.setActivator( act );

    const good_data = new Doorbot.ReadData( GOOD_KEY );

    const auth_promise_allowed = auth.authenticate( good_data );
    Promise
        .all([
            auth_promise_allowed
        ])
        .then( (res) => {
            tap.pass( "Bad path, but didn't die" );
            server.close();
        } );
});
