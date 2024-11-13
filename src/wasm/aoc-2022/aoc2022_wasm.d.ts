/* tslint:disable */
/* eslint-disable */
/**
* @param {number} day
* @param {number} part
* @param {string} input
* @returns {Promise<WasmSolution>}
*/
export function solve(day: number, part: number, input: string): Promise<WasmSolution>;
/**
*/
export class WasmSolution {
  free(): void;
/**
*/
  part1?: string;
/**
*/
  part2?: string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly solve: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_wasmsolution_free: (a: number) => void;
  readonly __wbg_get_wasmsolution_part1: (a: number, b: number) => void;
  readonly __wbg_set_wasmsolution_part1: (a: number, b: number, c: number) => void;
  readonly __wbg_get_wasmsolution_part2: (a: number, b: number) => void;
  readonly __wbg_set_wasmsolution_part2: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_export_1: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_2: (a: number, b: number) => number;
  readonly __wbindgen_export_3: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_4: (a: number) => void;
  readonly __wbindgen_export_5: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export_6: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
