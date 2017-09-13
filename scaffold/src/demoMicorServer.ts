import * as LibPath from 'path';
import {RpcApplication} from "sasdn";
import {GrpcInstrumentation} from "zipkin-instrumentation-grpcjs"
import {registerServices} from "./services/register";
import {ConfigHandler} from "./handler/ConfigHandler";
import {TracerHandler} from "./handler/TracerHandler";

export default class GrpcServer {
    private _initialized: boolean;
    public app: RpcApplication;

    constructor() {
        this._initialized = false;
    }

    public init(isDev: boolean = false): Promise<any> {
        const configPath = (isDev)
            ? LibPath.join(__dirname, '..', 'config.dev.json')
            : LibPath.join(__dirname, '..', 'config.json');
        return new Promise((resolve, reject) => {
            Promise.resolve()
                .then(() => ConfigHandler.instance().init(configPath))
                .then(() => TracerHandler.instance().init())
                .then(() => {
                    const app = new RpcApplication();
                    app.use(GrpcInstrumentation.middleware(TracerHandler.instance().getTraceInfo()));
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

        const options = ConfigHandler.instance().getOption();
        this.app.bind(`${options.host}:${options.port}`).start();
    }
}