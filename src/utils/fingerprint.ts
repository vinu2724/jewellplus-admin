// utils/fingerprint.ts
import SHA256 from "crypto-js/sha256";
export interface FingerprintData {
  userAgent: string;
  platform: string;
  language: string;
  languages: readonly string[];
  hardwareConcurrency: number;
  deviceMemory: number | undefined;
  screenResolution: string;
  colorDepth: number;
  timezone: string;
  canvas: string;
  webglVendor: string;
  webglRenderer: string;
  audio: string;
}

export interface FingerprintResult {
  fingerprint: string;
  raw: FingerprintData;
}

export async function generateDeviceFingerprint(): Promise<FingerprintResult> {
  const hash = async (input: string): Promise<string> => {
    return SHA256(input).toString(); // returns hex string
  };

  const getCanvasFingerprint = (): string => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";
      ctx.textBaseline = "top";
      ctx.font = "16px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = "#069";
      ctx.fillText("device-fingerprint", 10, 10);
      return canvas.toDataURL();
    } catch {
      return "";
    }
  };

  const getWebGLFingerprint = (): { vendor: string; renderer: string } => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;

      if (!gl) return { vendor: "", renderer: "" };

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      return {
        vendor: debugInfo
          ? (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string)
          : "",
        renderer: debugInfo
          ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
          : "",
      };
    } catch {
      return { vendor: "", renderer: "" };
    }
  };

  const getAudioFingerprint = async (): Promise<string> => {
    try {
      const ctx = new OfflineAudioContext(1, 44100, 44100);
      const osc = ctx.createOscillator();
      const comp = ctx.createDynamicsCompressor();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(10000, ctx.currentTime);
      osc.connect(comp);
      comp.connect(ctx.destination);
      osc.start(0);
      ctx.startRendering();

      const buffer = await new Promise<Float32Array>((resolve) => {
        ctx.oncomplete = (e) =>
          resolve(e.renderedBuffer.getChannelData(0).slice(4500, 5000));
      });

      return buffer.reduce((acc, val) => acc + Math.abs(val), 0).toString();
    } catch {
      return "";
    }
  };

  const gl = getWebGLFingerprint();

  const fingerprintParts = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: getCanvasFingerprint(),
    webglVendor: gl.vendor,
    webglRenderer: gl.renderer,
    audio: await getAudioFingerprint(),
  };

  const fullString = JSON.stringify(fingerprintParts);
  const fingerprintHash = await hash(fullString);
  return {
    fingerprint: fingerprintHash,
    raw: fingerprintParts,
  };
}

//
