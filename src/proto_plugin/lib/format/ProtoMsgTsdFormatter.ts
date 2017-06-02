import {FileDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {ExportMap} from "../ExportMap";

export default class ProtoMsgTsdFormatter {

    static format(descriptor: FileDescriptorProto, map: ExportMap): string {
        return '';
    }

}