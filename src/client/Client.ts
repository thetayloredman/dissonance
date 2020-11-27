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

import { Client as DJSClient } from 'discord.js';
import type { ClientOptions } from '../types/ClientOptions';
import { Error, TypeError, RangeError } from '../errors/index';

export class Client {
    public constructor(token: string, options?: ClientOptions) {
        if (typeof token !== 'string') {
            throw new TypeError('CLIENT_TOKEN_TYPE', typeof token);
        }
        this.token = token;
        this.client = new DJSClient(options);
    }

    public token: string;
    public client: DJSClient;

    public async login(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client
                .login(this.token)
                .then(() => {
                    resolve();
                })
                .catch((response) => {
                    const error = response as { code: string };

                    if (error.code === 'TOKEN_INVALID') {
                        throw new Error('TOKEN_INVALID');
                    }

                    // Unknown error
                    throw new Error('DJS_UNKNOWN_ERROR', error);
                });
        });
    }
}
