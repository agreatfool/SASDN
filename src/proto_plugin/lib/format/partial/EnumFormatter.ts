import {EnumDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import TplEngine from "../../TplEngine";

export default class EnumFormatter {

    static format(enumDescriptor: EnumDescriptorProto, indentLevel: number): string {
        let enumName = enumDescriptor.getName();
        let values: {[key: string]: number} = {};
        enumDescriptor.getValueList().forEach(value => {
            values[value.getName()] = value.getNumber();
        });

        return TplEngine.compile('partial/enum')({
            enumName: enumName,
            values: values,
        });
    }

}