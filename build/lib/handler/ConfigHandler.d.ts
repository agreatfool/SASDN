export interface ConfigOptions {
    name: string;
    host: string;
    port: number;
    tracer?: boolean | TracerOptions;
}

export interface TracerOptions {
    host: string;
    port: number;
}

export declare class ConfigHandler {
    private static _instance: ConfigHandler;

    private _initialized: boolean;
    private _configs: ConfigOptions;

    public static instance(): ConfigHandler ;

    private constructor();

    public init(configPath: string): Promise<void>;

    public getOption(): ConfigOptions;

    public static mergerObject(object: { [key: string]: any }, newObject: { [key: string]: any }): { [key: string]: any };
}