import * as LibPath from 'path';
import {RpcApplication} from 'sasdn';
import {GrpcInstrumentation} from 'zipkin-instrumentation-grpcjs';
import {registerServices} from '../services/Register';
import {ConfigHelper} from '../helper/ConfigHelper';
import {TracerHelper} from '../helper/TracerHelper';

export default class MSServer {
    private _initialized: boolean;
    public app: RpcApplication;

    constructor() {
        this._initialized = false;
    }

    public init(isDev: boolean = false): Promise<any> {
        const configPath = (isDev)
            ? LibPath.join(__dirname, '..', '..', 'config.dev.json')
            : LibPath.join(__dirname, '..', '..', 'config.json');
        return new Promise((resolve, reject) => {
            Promise.resolve()
                .then(() => ConfigHelper.instance().init(configPath))
                .then(() => TracerHelper.instance().init())
                .then(() => {
                    const app = new RpcApplication();
                    app.use(GrpcInstrumentation.middleware(TracerHelper.instance().getTraceInfo()));
                    this.app = app;
                })
                .then(() => {
                    this._initialized = true;
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });

    }

    public start(): void {
        if (!this._initialized) {
            return;
        }

        registerServices(this.app);

        const options = ConfigHelper.instance().getOption();
        this.app.bind(`${options.host}:${options.port}`).start();
    }
}