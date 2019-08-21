import * as tap from 'tap';
import * as Bodgery from '../index';
import * as Doorbot from '@frezik/doorbot-ts';
import * as os from 'os';
import * as process from 'process';

Doorbot.init_logger( os.tmpdir() + "/doorbot_test.log"  );

const TEST_CACHE = "./test_data/no_such_file.json";

tap.plan( 1 );


const auth = new Bodgery.BodgeryCacheAuthenticator( TEST_CACHE );
const act = new Doorbot.DoNothingActivator( () => {
    tap.fail( "Callback made, shouldn't have been" );
    process.exit( 1 );
});
auth.setActivator( act );

const good_data = new Doorbot.ReadData( "is_allowed_key" );

const auth_promise_allowed = auth.authenticate( good_data );
const timeout_promise = new Promise( (resolve, reject) => {
    setTimeout( () => {
        tap.pass( "Callback never made" );
        process.exit( 0 );
        resolve();
    }, 2000 );
});
Promise
    .all([
        auth_promise_allowed
        ,timeout_promise
    ])
    .then( (res) => {} )
    .catch( (err) => {
        tap.fail( "File not found error was not properly handled" );
        process.exit( 1 );
    });
