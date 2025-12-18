/* tslint:disable */
/* eslint-disable */

export class WasmSolution {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  get part1(): string | undefined;
  set part1(value: string | null | undefined);
  get part2(): string | undefined;
  set part2(value: string | null | undefined);
}

export function solve(day: number, part: number, input: string): Promise<WasmSolution>;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly solve: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_get_wasmsolution_part1: (a: number, b: number) => void;
  readonly __wbg_get_wasmsolution_part2: (a: number, b: number) => void;
  readonly __wbg_set_wasmsolution_part1: (a: number, b: number, c: number) => void;
  readonly __wbg_set_wasmsolution_part2: (a: number, b: number, c: number) => void;
  readonly __wbg_wasmsolution_free: (a: number, b: number) => void;
  readonly __wasm_bindgen_func_elem_73: (a: number, b: number, c: number) => void;
  readonly __wasm_bindgen_func_elem_63: (a: number, b: number) => void;
  readonly __wasm_bindgen_func_elem_127: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_export: (a: number) => void;
  readonly __wbindgen_export2: (a: number, b: number) => number;
  readonly __wbindgen_export3: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export4: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
