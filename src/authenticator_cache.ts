import * as Doorbot from '@frezik/doorbot-ts';
import * as fs from 'fs';


export class BodgeryCacheAuthenticator
{
    private act: Doorbot.Activator;
    private cache_file: string;


    /**
     * @constructor
     *
     * @param {string} Path to cache_file
     */
    constructor(
        cache_file: string
    ) {
        this.cache_file = cache_file;

        Doorbot.init_logger();
    }


    /**
     * Sets the activator to fire off if authentication is successful
     *
     * @param {Activator} Activator to set
     */
    setActivator( act: Doorbot.Activator ): void
    {
        Doorbot.log.info( '<Bodgery.CacheAuthenticator> Setting activator: '
            + act.constructor.name );
        this.act = act;
    }

    /**
     * Returns a Promise to check against the cache file data.
     */
    authenticate( read_data: Doorbot.ReadData ): Promise<any>
    {
        // TODO watch for changes in the cache file (fs.watch()) and 
        // reload it then
        const promise = new Promise( (resolve, reject) => {
            fs.readFile( this.cache_file, (err, data) => {
                Doorbot.log.info( '<Bodgery.CacheAuthenticator>'
                    + ' Checked against data ' + read_data.key );

                if( err ) {
                    reject( err );
                }
                else {
                    const cache = JSON.parse( data.toString() );
                    Doorbot.log.info( '<Bodgery.CacheAuthenticator>'
                        + ' Is allowed: '
                        + cache.hasOwnProperty( read_data.key ) );
                    const next_promise = cache.hasOwnProperty( read_data.key )
                        ? this.act.activate()
                        : new Promise( (resolve, reject) => {
                            resolve( false );
                        });

                    resolve( next_promise );
                }
            });
        });

        return promise;
    }
}
