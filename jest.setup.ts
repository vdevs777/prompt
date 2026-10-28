/* eslint-disable @typescript-eslint/no-explicit-any */

import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "node:util";
import { webcrypto } from "node:crypto";

(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = webcrypto;
}

expect.extend({});
