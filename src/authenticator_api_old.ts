import * as Doorbot from '@frezik/doorbot-ts';
import * as Http from 'http';
import * as Https from 'https';

const KEY_LEN = 10;


export class BodgeryOldAPIAuthenticator
{
    private act: Doorbot.Activator;
    private baseurl: string;
    private host: string;
    private port: number;
    private protocol: string;
    private client;


    /**
     * @constructor
     *
     * @param {string} Host
     * @param {number} Port
     * @param {string} Protocol
     */
    constructor(
        host: string
        ,port: number
        ,protocol: string = 'https'
    ) {
        this.host = host;
        this.port = port;
        this.protocol = protocol;

        this.client = this.protocol == 'https'
            ? Https
            : Http;

        Doorbot.init_logger();
    }


    /**
     * Sets the activator to fire off if authentication is successful
     *
     * @param {Activator} Activator to set
     */
    setActivator( act: Doorbot.Activator ): void
    {
        Doorbot.log.info( '<Bodgery.OldAPIAuthenticator> Setting activator: '
            + act.constructor.name );
        this.act = act;
    }

    /**
     * Returns a Promise to check against the API.
     *
     * If there's an error connecting to the server, the error will be 
     * logged, and the promise will resolve as false.
     */
    authenticate( read_data: Doorbot.ReadData ): Promise<any>
    {
        Doorbot.log.info( '<Bodgery.OldAPIAuthenticator>'
            + ' Requesting against ' + this.host + ':' + this.port );

        const promise = new Promise( (resolve, reject) => {
            let key: string  = read_data.key;
            if( key.length < KEY_LEN ) {
                let pad_len = KEY_LEN - key.length;
                let pad = "0".repeat( pad_len );
                key = pad + key;
            }

            this.client.get({
                port: this.port
                ,host: this.host
                ,path: "/check_tag/" + key
            }, (res) => {
                Doorbot.log.info( '<Bodgery.OldAPIAuthenticator>'
                    + ' Checked against data ' + key 
                    + ', status: ' + res.statusCode );

                const next_promise = (200 == res.statusCode)
                    ? this.act.activate()
                    : new Promise( (resolve, reject) => {
                        resolve( false );
                    });
                resolve( next_promise );
            })
            .on( 'error', (e) => {
                Doorbot.log.info( '<Bodgery.OldAPIAuthenticator>'
                    + ' Error connecting to '
                    + this.host + ':' + this.port 
                    + ': ' + e.message
                );
                resolve( false );
            });
        });

        return promise;
    }
}
