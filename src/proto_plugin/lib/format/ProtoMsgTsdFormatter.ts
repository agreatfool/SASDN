import {FileDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {ExportMap} from "../ExportMap";
import Printer from "../Printer";
import {Utility} from "../Utility";
import {WellKnownTypesMap} from '../WellKnown';
import {printMessage} from "ts-protoc-gen/lib/ts/message";
import {printExtension} from "../../ts/extensions";
import {printEnum} from "ts-protoc-gen/lib/ts/enum";

export namespace ProtoMsgTsdFormatter {

    export function format(descriptor: FileDescriptorProto, exportMap: ExportMap): string {
        const fileName = descriptor.getName();
        const packageName = descriptor.getPackage();

        const printer = new Printer(0);

        printer.printLn(`// package: ${packageName}`);
        printer.printLn(`// file: ${descriptor.getName()}`);

        const upToRoot = Utility.getPathToRoot(fileName);

        printer.printEmptyLn();
        printer.printLn(`import * as jspb from "google-protobuf";`);

        descriptor.getDependencyList().forEach((dependency: string) => {
            const pseudoNamespace = Utility.filePathToPseudoNamespace(dependency);
            if (dependency in WellKnownTypesMap) {
                printer.printLn(`import * as ${pseudoNamespace} from "${WellKnownTypesMap[dependency]}";`);
            } else {
                const filePath = Utility.filePathFromProtoWithoutExt(dependency);
                printer.printLn(`import * as ${pseudoNamespace} from "${upToRoot}${filePath}";`);
            }
        });

        descriptor.getMessageTypeList().forEach(enumType => {
            printer.print(printMessage(fileName, exportMap, enumType, 0, descriptor));
        });

        descriptor.getExtensionList().forEach(extension => {
            printer.print(printExtension(fileName, exportMap, extension, 0));
        });

        descriptor.getEnumTypeList().forEach(enumType => {
            printer.print(printEnum(enumType, 0));
        });

        printer.printEmptyLn();

        return printer.getOutput();
    }

}