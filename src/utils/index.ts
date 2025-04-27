import { NQrCode } from "naive-ui"
import { h, render } from 'vue'

export function toBase64St(str: string) {
    // Convert the string to a Uint8Array (array of bytes)
    const utf8Bytes = new TextEncoder().encode(str);

    // Convert the array of bytes into a binary string
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');

    // Use btoa to convert the binary string to base64
    return  btoa(unescape(encodeURIComponent(str)));
}
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Base64 string without the "data:...," prefix
        };

        reader.onerror = (error) => {
            reject(error);
        };
    });
}
export function base64ToFile(base64String:string, fileName:string, mimeType:any) {
    // Decode the Base64 string
    const byteString = atob(base64String);
    
    // Convert the byte string into an array of bytes
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
  
    // Create a Blob from the byte array
    const blob = new Blob([byteArray], { type: mimeType });
  
    // Convert the Blob to a File
    const file = new File([blob], fileName, { type: mimeType });
    // Trigger a download of the file
    return file;
  }
export function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}
export function minimalizeText(text: string, size = 30) {
    if (!text) return ''
    return text?.length <= size ? text : text?.slice?.(0, size) + "..."
}
export function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}
export default function sleep(time = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}


export function getContrastTextColor(hexColor: string) {
    if (!hexColor) return '#000000'
    // Remove "#" if it exists
    hexColor = hexColor.replace("#", "");

    // Convert to RGB
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    // Calculate relative luminance
    const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

    // Return black or white based on luminance threshold
    return luminance > 0.8 ? "#000000" : "#FFFFFF";
}
export function hexToRgba(hex: string, alpha:number): string {
    if(!hex) return ''
    // Validate and normalize the hex color
    hex = hex.replace("#", "");
    if (![6, 8].includes(hex.length)) {
      throw new Error("Invalid hex color format. Expected 6 (RRGGBB) or 8 (RRGGBBAA) characters.");
    }
  
    // Extract color components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // Extract alpha if present, otherwise assume 255 (fully opaque)
    const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
  
    // Return RGBA string
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
// QR CODE
// 
export function generateQrCodeFromString(data: {
    value: string,
    color: string,
    size: number
  }) {
    let qrWrap = document.createElement('div')
    let vNodeQr = h(NQrCode, data)
    render(vNodeQr, qrWrap)
    const canvas = qrWrap.querySelector('canvas')
    const imgSrc = canvas?.toDataURL('image/png')
    return imgSrc || ''
  }
  
  export function qrCodeBase(data: string) {
    return generateQrCodeFromString({
      value: data,
      color: '#0363ad',
      size: 40
    })
  }