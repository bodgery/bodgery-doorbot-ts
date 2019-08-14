import * as Doorbot from '@frezik/doorbot-ts';
import * as fs from 'fs';


export class BodgeryCacheAuthenticator
{
    private act: Doorbot.Activator;
    private cache_file: string;


    /**
     * @constructor
     *
     * @param {Array<Authenticator>} List of authenticators to check
     */
    constructor(
        cache_file: string
    ) {
        this.cache_file = cache_file;
    }


    /**
     * Sets the activator to fire off if authentication is successful
     *
     * @param {Activator} Activator to set
     */
    setActivator( act: Doorbot.Activator ): void
    {
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
                if( err ) {
                    reject( err );
                }
                else {
                    const cache = JSON.parse( data.toString() );
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
