/* tslint:disable */
/* eslint-disable */
/**
 * @returns {any}
 */
export function wasm_memory(): any;
export class Universe {
  free(): void;
  /**
   * @param {number} width
   * @param {number} height
   * @returns {Universe}
   */
  static new(width: number, height: number): Universe;
  /**
   * @returns {number}
   */
  width(): number;
  /**
   * Set the width of the universe.
   *
   * Resets all cells to the dead state.
   * Marks all cells as hot
   * @param {number} width
   */
  set_width(width: number): void;
  /**
   * @returns {number}
   */
  height(): number;
  /**
   * Set the height of the universe.
   *
   * Resets all cells to the dead state.
   * Marks all cells as hot
   * @param {number} height
   */
  set_height(height: number): void;
  /**
   * @returns {number}
   */
  cells(): number;
  tick(): void;
  /**
   * @param {number} row
   * @param {number} col
   */
  toggle_cell(row: number, col: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly wasm_memory: () => number;
  readonly __wbg_universe_free: (a: number, b: number) => void;
  readonly universe_new: (a: number, b: number) => number;
  readonly universe_width: (a: number) => number;
  readonly universe_set_width: (a: number, b: number) => void;
  readonly universe_height: (a: number) => number;
  readonly universe_set_height: (a: number, b: number) => void;
  readonly universe_cells: (a: number) => number;
  readonly universe_tick: (a: number) => void;
  readonly universe_toggle_cell: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_start: () => void;
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
