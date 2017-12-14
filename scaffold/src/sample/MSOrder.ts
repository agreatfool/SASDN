import * as LibPath from 'path';
import { RpcApplication } from 'sasdn';
import { GrpcImpl } from 'sasdn-zipkin';
import { registerServices } from '../services/Register';

export default class MSOrder {
    private _initialized: boolean;
    public app: RpcApplication;

    constructor() {
        this._initialized = false;
    }

    public async init(isDev: boolean = false): Promise<any> {
        const configPath = (isDev)
            ? LibPath.join(__dirname, '..', '..', 'config.dev.json')
            : LibPath.join(__dirname, '..', '..', 'config.json');

        GrpcImpl.init(process.env.ZIPKIN_URL, {
            serviceName: process.env.ORDER,
            port: process.env.ORDER_PORT
        });

        const app = new RpcApplication();
        app.use(new GrpcImpl().createMiddleware());
        this.app = app;

        this._initialized = true;

        return Promise.resolve();
    }

    public start(): void {
        if (!this._initialized) {
            return;
        }

        registerServices(this.app);

        const host = process.env.ORDER_ADDRESS;
        const port = process.env.ORDER_PORT;
        this.app.bind(`${host}:${port}`).start();
    }
}