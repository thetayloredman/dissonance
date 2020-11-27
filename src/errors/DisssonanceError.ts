/**
 * Dissonance
 * Copyright (C) 2020  BadBoyHaloCat
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// Heavily inspired by Discord.js' src/errors/DJSError.js system.

import type ErrorData from '../types/ErrorData';

const messages = new Map<string, ErrorData>();

/**
 * Extend some sort of error into a DissonanceError
 * @param {Error} Base Base error
 * @returns {DissonanceError} The made error
 */
function makeError(Base: typeof Error) {
    return class DissonanceError extends Base {
        public constructor(key: string, ...args: any[]) {
            // eslint-disable-next-line no-use-before-define
            super(message(key, args));
            this.code = key;
            // @ts-ignore
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, DissonanceError);
            }
        }

        get name() {
            return `${super.name} [${this.code}]`;
        }

        public code: string;
    };
}

/**
 * Make the error message
 * @param {string} key Error key
 * @param {Array<*>} args Args to pass for format or function args
 * @returns {string} Formatted string
 */
function message(key: string, args: any[]): string {
    if (typeof key !== 'string') {
        throw new Error('Error message key must be a string');
    }
    const msg = messages.get(key);
    if (!msg) {
        throw new Error(`An invalid error message key was used: ${key}.`);
    } else {
        if (typeof msg === 'function') {
            return msg(...args);
        }
        if (args === undefined || args.length === 0) {
            return msg;
        }
        args.unshift(msg);
        return String(...args);
    }
}

/**
 * Register an error
 * @param {string} code Error code
 * @param {*} val Error value
 */
function register(code: string, val: ErrorData): void {
    messages.set(code, typeof val === 'function' ? val : String(val));
}

const _Error = makeError(Error);
const _TypeError = makeError(TypeError);
const _RangeError = makeError(RangeError);

export { register, _Error as Error, _TypeError as TypeError, _RangeError as RangeError };
