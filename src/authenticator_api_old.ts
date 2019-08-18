import * as Doorbot from '@frezik/doorbot-ts';
import * as Http from 'http';
import * as Https from 'https';


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
     */
    authenticate( read_data: Doorbot.ReadData ): Promise<any>
    {
        Doorbot.log.info( '<Bodgery.OldAPIAuthenticator>'
            + ' Requesting against ' + this.host + ':' + this.port );

        const promise = new Promise( (resolve, reject) => {
            this.client.get({
                port: this.port
                ,host: this.host
                ,path: "/check_tag/" + read_data.key
            }, (res) => {
                Doorbot.log.info( '<Bodgery.OldAPIAuthenticator>'
                    + ' Checked against data ' + read_data.key 
                    + ', status: ' + res.statusCode );

                const next_promise = (200 == res.statusCode)
                    ? this.act.activate()
                    : new Promise( (resolve, reject) => {
                        resolve( false );
                    });
                resolve( next_promise );
            });
        });

        return promise;
    }
}
