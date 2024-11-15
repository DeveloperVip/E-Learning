// src/utils/random-code.util.ts

import * as crypto from 'crypto';

/**
 * Hàm tạo mã xác nhận ngẫu nhiên
 * @param length Độ dài của mã xác nhận
 * @param useAlphaNumeric Nếu true, mã sẽ bao gồm cả chữ và số; nếu false, chỉ bao gồm số.
 * @returns Chuỗi mã xác nhận ngẫu nhiên
 */
export function generateRandomCode(
  length: number = 6,
  useAlphaNumeric: boolean = false,
): string {
  if (useAlphaNumeric) {
    // Tạo mã với ký tự alphanumeric (chữ và số)
    return crypto
      .randomBytes(length)
      .toString('base64')
      .slice(0, length)
      .replace(/\+/g, 'A')
      .replace(/\//g, 'B');
  } else {
    // Tạo mã chỉ bao gồm số
    return crypto
      .randomInt(0, Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }
}
