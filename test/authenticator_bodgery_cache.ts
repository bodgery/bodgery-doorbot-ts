import * as tap from 'tap';
import * as Bodgery from '../index';
import * as Doorbot from '@frezik/doorbot-ts';
import * as os from 'os';

Doorbot.init_logger( os.tmpdir() + "/doorbot_test.log"  );

const TEST_CACHE = "./test_data/cache.json";

// Only triggers callback once, as second call should not go through
tap.plan( 1 );


const auth = new Bodgery.BodgeryCacheAuthenticator( TEST_CACHE );
const act = new Doorbot.DoNothingActivator( () => {
    tap.pass( "Callback made" );
});
auth.setActivator( act );

const good_data = new Doorbot.ReadData( "is_allowed_key" );
const bad_data = new Doorbot.ReadData( "is_not_allowed_key" );

const auth_promise_allowed = auth.authenticate( good_data );
const auth_promise_not_allowed = auth.authenticate( bad_data );
Promise
    .all([
        auth_promise_allowed
        ,auth_promise_not_allowed
    ])
    .then( (res) => {} );
