import path from "path";
import { fileURLToPath } from "url";
const ffi = await import("ffi-napi");
const ref = await import("ref-napi");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const voidPtr = ref.default.refType(ref.default.types.void);
const charPtr = ref.default.types.CString;
const dllPath = path.join(__dirname, "dlls", "plcommpro.dll");

const PullSDK = ffi.default.Library(dllPath, {
  Connect: [voidPtr, [charPtr]],
  Disconnect: ["void", [voidPtr]],
  GetDeviceParam: ["int", [voidPtr, charPtr, "int", charPtr]],
});

export class PullDllSDK {
  connectSDK;

  constructor(params) {
    if (params) {
      const { ipaddress, port, timeout, passwd = "" } = params;
      this.connectSDK = `protocol=TCP,ipaddress=${ipaddress},port=${port},timeout=${timeout},passwd=${passwd}`;
    } else {
      throw Error("No config connection");
    }
  }

  async connect(params) {
    const { ipaddress, port, timeout, passwd = "" } = params;
    const connectionString = `protocol=TCP,ipaddress=${ipaddress},port=${port},timeout=${timeout},passwd=${passwd}`;

    const handle = PullSDK.Connect(connectionString);

    if (ref.default.isNull(handle)) {
      return {
        success: false,
        message: "Failed to connect to device.",
      };
    }

    return {
      success: true,
      handle,
    };
  }

  async disconnect(params) {
    const { handle } = params;

    if (!handle) {
      return {
        success: false,
        message: "Missing handle.",
      };
    }

    try {
      PullSDK.Disconnect(handle);
      return {
        success: true,
        message: "Disconnected successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while disconnecting: ${error.message}`,
      };
    }
  }

  async setDeviceParam(params) {
    const { handle, itemValues } = params;

    if (!handle || !itemValues) {
      return {
        success: false,
        message: "Missing handle or itemValues.",
      };
    }

    try {
      const result = PullSDK.SetDeviceParam(handle, itemValues);
      return {
        success: result >= 0,
        result,
        message:
          result >= 0
            ? "Set device parameters successfully."
            : "Failed to set device parameters.",
      };
    } catch (error) {
      return {
        success: false,
        message: `Error while setting device parameters: ${error.message}`,
      };
    }
  }
}
