// anki-procgen-js
// Copyright (C) 2020 Tom Z.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// 1: body / empty
// 2: body / border
// 3: always border
// 4: always body
// 5: border / empty
// 6: random walk
// 7: random walk, optional 
// 8: random walk, long 
//
// 0: empty
// 1: body
// 2: border

(function () {

    /** one pixel in the first generations step maps to how many canvas pixels? */
    const SCALE = 10;
    /** Use rendering animation when generating */
    const USE_RENDER_ANIMATION = true;
    /** Use animated effect */
    const USE_EFFECT_ANIMATION = true;
    /**  Every nth time on avg., the generated image should have an animation effect */
    const ANIMATION_CHANCE = 5;

    const ZOOM = 1.0;

    const template_1 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 7, 1],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 7, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 7, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_2 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 6],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_3 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 6, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const template_4 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 6, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 6, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_5 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 6, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_6 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 6, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_7 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 0, 0],
        [0, 0, 0, 0, 0, 4, 4, 4, 0],
        [0, 0, 0, 0, 0, 0, 4, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 7],
        [0, 0, 0, 0, 6, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_8 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 6, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 7],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 6, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_9 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_10 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_11 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_12 = [
        [3, 3, 3, 3, 3, 3, 3, 3, 3],
        [3, 1, 1, 1, 1, 1, 1, 1, 1],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 1, 1, 1, 1, 1, 1, 1, 1],
        [3, 3, 3, 3, 3, 3, 3, 3, 3]
    ];
    const template_13 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 7, 0, 7, 0, 0, 7, 0],
        [3, 1, 1, 1, 1, 1, 1, 1, 1],
        [3, 3, 3, 3, 3, 3, 3, 3, 3]
    ];
    const template_14 = [
        [3, 3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3, 3]
    ];
    const template_15 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 3, 3, 3, 3, 3, 3],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 8, 0, 0, 0, 0, 0],
        [0, 0, 3, 8, 0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 3, 3, 3, 3, 3, 3],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]

    const singleTemplates = [];

    singleTemplates.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 6, 4, 4],
        [0, 0, 0, 0, 0, 1, 4, 1, 1],
        [0, 0, 0, 0, 0, 1, 4, 1, 1],
        [0, 0, 0, 0, 0, 1, 4, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 4, 4],
        [0, 0, 0, 0, 6, 0, 0, 4, 4],
        [0, 0, 0, 0, 0, 0, 4, 4, 0],
        [0, 0, 0, 0, 0, 1, 4, 4, 1],
        [0, 0, 0, 0, 1, 4, 4, 1, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    );
    singleTemplates.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 6, 4, 4],
        [0, 0, 0, 0, 0, 0, 4, 1, 1],
        [0, 0, 0, 0, 0, 0, 4, 0, 0],
        [0, 0, 0, 0, 6, 1, 4, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 4, 4],
        [0, 0, 0, 0, 6, 0, 0, 4, 4],
        [0, 0, 0, 0, 0, 0, 4, 4, 0],
        [0, 0, 0, 0, 0, 1, 4, 4, 1],
        [0, 0, 0, 0, 0, 6, 4, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    );

    singleTemplates.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 7],
        [0, 0, 0, 0, 0, 0, 0, 0, 8],
        [0, 0, 0, 0, 0, 0, 0, 0, 7],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    );

    singleTemplates.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 8, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    );
    
    const heads = [];

    heads.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 4, 4, 4],
        [0, 0, 0, 0, 1, 1, 4, 4, 4],
        [0, 0, 0, 0, 0, 1, 4, 4, 4],
        [0, 0, 0, 0, 0, 0, 4, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    heads.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 3, 3],
        [0, 0, 0, 0, 5, 5, 3, 4, 4],
        [0, 0, 0, 0, 5, 5, 3, 4, 4],
        [0, 0, 0, 0, 0, 0, 3, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 3, 3],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    heads.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 2, 2, 4],
        [0, 0, 1, 0, 0, 0, 0, 2, 4],
        [0, 0, 0, 0, 0, 0, 0, 2, 4],
        [0, 1, 0, 0, 0, 0, 0, 2, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    const torsos = [];

    torsos.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 1, 4],
        [0, 0, 0, 1, 1, 4, 4, 4, 4],
        [0, 0, 0, 1, 1, 0, 0, 4, 4],
        [0, 0, 0, 1, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    torsos.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0, 4],
        [0, 1, 4, 4, 4, 4, 4, 4, 4],
        [0, 0, 1, 1, 1, 0, 0, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    torsos.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 4],
        [0, 0, 0, 6, 3, 3, 3, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    torsos.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 5, 3],
        [0, 0, 0, 0, 6, 3, 3, 3, 3],
        [0, 0, 0, 0, 0, 0, 0, 5, 3],
        [0, 0, 0, 0, 0, 0, 0, 0, 3],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    const eyes = [];
    eyes.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 0, 0, 0, 0, 3, 4, 4, 3],
        [0, 0, 0, 0, 0, 3, 4, 4, 3],
        [0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    eyes.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 3, 0],
        [0, 5, 0, 0, 0, 0, 3, 4, 3],
        [0, 0, 0, 0, 0, 0, 0, 3, 0],
        [0, 0, 0, 5, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    eyes.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 5, 0, 0, 0, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 3, 4, 3],
        [0, 5, 0, 0, 0, 0, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 5, 0, 0],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    eyes.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 5, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 5, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    eyes.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 5, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 5, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    const feet = [];
    feet.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 1, 1, 1, 4],
        [0, 0, 0, 0, 0, 1, 4, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);

    feet.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 1, 4],
        [0, 0, 0, 0, 0, 0, 0, 4, 4],
        [0, 0, 0, 0, 0, 6, 4, 4, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    feet.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 0, 0, 0, 0, 0, 0, 3],
        [0, 0, 5, 5, 0, 0, 0, 5, 3],
        [0, 5, 0, 0, 0, 0, 5, 3, 5],
        [0, 0, 0, 5, 5, 3, 3, 3, 5],
        [5, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);

    const bugs = [];
    bugs.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 5, 5, 5, 5],
        [0, 0, 0, 0, 0, 5, 5, 5, 5],
        [0, 0, 0, 0, 0, 5, 5, 5, 5],
        [0, 0, 0, 0, 0, 5, 5, 5, 3],
        [0, 0, 0, 0, 0, 5, 5, 3, 3],
        [0, 0, 0, 0, 0, 5, 5, 5, 5],
        [0, 0, 0, 0, 0, 5, 5, 5, 5],
        [0, 0, 0, 0, 0, 5, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]

    ]);
    bugs.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 5, 5],
        [0, 0, 0, 0, 5, 5, 5, 5, 5],
        [0, 0, 0, 0, 5, 5, 5, 5, 5],
        [0, 0, 0, 0, 5, 5, 5, 5, 5],
        [0, 0, 0, 0, 5, 5, 5, 5, 5],
        [0, 0, 0, 7, 5, 5, 5, 5, 5],
        [0, 0, 0, 0, 5, 5, 5, 5, 5],
        [0, 0, 0, 0, 5, 5, 5, 5, 5],
        [0, 0, 0, 0, 5, 5, 5, 5, 5],
        [0, 0, 0, 0, 5, 5, 5, 5, 5],
        [0, 0, 0, 0, 0, 0, 0, 5, 5],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]

    ]);
    bugs.push([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 5, 5, 5, 0, 0, 5, 5],
        [0, 0, 5, 5, 5, 5, 5, 5, 5],
        [0, 0, 5, 5, 5, 5, 5, 5, 5],
        [0, 0, 0, 5, 5, 5, 5, 5, 5],
        [0, 0, 0, 5, 5, 5, 5, 7, 5],
        [0, 0, 0, 5, 7, 5, 5, 7, 5],
        [0, 0, 0, 5, 5, 5, 5, 7, 5],
        [0, 0, 0, 5, 5, 5, 5, 5, 5],
        [0, 0, 0, 5, 5, 5, 5, 5, 5],
        [0, 0, 5, 5, 5, 5, 5, 5, 5],
        [0, 0, 5, 5, 5, 0, 0, 5, 5],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]

    ]);
  
    class PMapTemplate {
        constructor(template, steps) {
            this.template = template;
            this.steps = steps;
        }

        generateMap() {
            let steps = this.steps;
            let halfmap = copyMap(this.template);
            if (!steps || steps === null) {
                steps = defaultSteps();
            }
            //basic map
            let mapGenerated = this.generateFillings(halfmap);

            //mirroring
            if (steps.indexOf("mirrorquarter") !== -1) {
                mapGenerated = mirrorQuarter(mapGenerated);
            }
            if (steps.indexOf("mirrorvertically") !== -1 || (steps.indexOf("[mirrorvertically]") !== -1 && _randInt(0, 2) === 0)) {
                mapGenerated = mirrorVertically(mapGenerated);
            }
            //borders
            if (steps.indexOf("fillborders") !== -1) {
                mapGenerated = this.fillBorders(mapGenerated);
            }
            return new PMap(copyMap(this.template), this.steps, mapGenerated);
        }

        fillBorders(map) {
            for (var row = 0; row < map.length; row++) {
                for (var col = 0; col < map[row].length; col++) {
                    if (map[row][col] == 0 && this.neighbourIsBody(map, row, col)) {
                        map[row][col] = 2;
                    } else if (map[row][col] !== 0 && this.neighbourIsBody(map, row, col) && (row === 0 || col === 0 || col === map[0].length - 1 || row === map.length - 1)) {
                        map[row][col] = 2;
                    }
                }
            }
            return map;
        }
        neighbourIsBody(map, row, col) {
            if (row > 0 && map[row - 1][col] == 1) { return true; }
            if (row < map.length - 1 && map[row + 1][col] == 1) { return true; }
            if (col > 0 && map[row][col - 1] == 1) { return true; }
            if (col < map[row].length - 1 && map[row][col + 1] == 1) { return true; }
            return false;
        }
        generateFillings(map) {
            let rwalks = [];
            for (var row = 0; row < map.length; row++) {
                for (var col = 0; col < map[row].length; col++) {
                    map[row][col] = rollFilling(map[row][col]);
                    if (map[row][col] === 6 || map[row][col] === 8) {
                        rwalks.push([row, col, map[row][col]]);
                    }
                }
            }
            if (rwalks.length) {
                return this.rwalk(map, rwalks);
            }
            return map;
        }

        rwalk(map, rwalks) {
            rwalks.forEach((w) => {
                map[w[0]][w[1]] = 1;
                let n = getEmptyAround(map, w[0], w[1]);
                let c = 0;
                let x = null;
                let limit = w[2] === 8 ? 25 : 8;
                while (n.length && c < limit) {
                    x = n[_randInt(0, n.length)];
                    map[x[0]][x[1]] = 1;
                    c++;
                    n = getEmptyAround(map, x[0], x[1]);
                }
            });
            return map;
        }
    }

    class PMap {
        constructor(template, steps, map012) {
            this.template = template;
            this.steps = steps;
            this.map012 = map012;
            this.map012Scaled = this.scaledMap(map012, SCALE);
            this.bodyColorRGBArray = _getRandomColors(1)[0];

            this.brighten = steps.indexOf("brighten") !== -1 || (steps.indexOf("[brighten]") !== -1 && roll(2));
            this.coloredBorder = steps.indexOf("coloredborder") !== -1 || (steps.indexOf("[coloredborder]") !== -1 && roll(2));

            this.borderColorRGBArray = this.coloredBorder ? _getRandomColors(1)[0] : [0, 0, 0, 255];
            this.mapRBGValues = [];

            this.initialRGBValues();
        }

        initialRGBValues() {
            let bodycolor = this.bodyColorRGBArray;
            let bordercolor = this.borderColorRGBArray;

            for (var row = 0; row < this.map012.length; row++) {
                this.mapRBGValues.push([]);
                for (var col = 0; col < this.map012[row].length; col++) {
                    switch (this.map012[row][col]) {
                        case 0: this.mapRBGValues[row][col] = [0, 0, 0, 0]; break;
                        case 1:
                            if (this.brighten) {
                                this.mapRBGValues[row][col] = this.maybeBrightenBodyPixel(this.map012, row, col, this.bodyColorRGBArray);
                            } else {
                                this.mapRBGValues[row][col] = bodycolor;
                            }
                            break;
                        case 2:
                            this.mapRBGValues[row][col] = bordercolor;
                            break;
                    }
                }
            }
        }
        maybeBrightenBodyPixel(map, row, col, bodycolor) {
            switch (this.countBodyAround(map, row, col)) {
                case 1: if (_randInt(0, 101) <= 40) { return this.brightenColor(bodycolor, 1); } break;
                case 2: if (_randInt(0, 101) <= 60) { return this.brightenColor(bodycolor, 1); } break;
                case 3: if (_randInt(0, 101) <= 90) { return this.brightenColor(bodycolor, 2); } break;
                case 4: if (_randInt(0, 3) === 0) { return this.brightenColor(bodycolor, 5); } else { return this.brightenColor(bodycolor, 3); }
                default: return bodycolor;
            }
            return bodycolor;
        }
        countBodyAround(map, row, col) {
            let c = 0;
            if (row > 0 && map[row - 1][col] == 1) { c++; }
            if (row < map.length - 1 && map[row + 1][col] == 1) { c++; }
            if (col > 0 && map[row][col - 1] == 1) { c++; }
            if (col < map[row].length - 1 && map[row][col + 1] == 1) { c++; }
            return c;
        }

        brightenColor(color, n) {
            let r = color[0];
            let g = color[1];
            let b = color[2];
            r = Math.floor(Math.min(255, r + (255 - r) * 0.15));
            g = Math.floor(Math.min(255, g + (255 - g) * 0.15));
            b = Math.floor(Math.min(255, b + (255 - b) * 0.15));
            if (n === 0) {
                return [r, g, b, 255];
            } else {
                return this.brightenColor([r, g, b], n - 1);
            }
        }
        printToCanvas(canvas, effects) {
            const scale_sqrt = Math.round(Math.sqrt(SCALE));

            let map = this.scaledMap(this.mapRBGValues, scale_sqrt);
            const baseEffectDice = 7;

            if (effects) {
                let actions = [];
                if (roll(baseEffectDice)) { actions.push(this.distort_1.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.distort_2.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.distort_4.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.distort_5.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.distort_6.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.distort_7.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.distort_8.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.averageColors.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.gradient.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.invertColors.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.canvasTexture.bind(this)); }
                if (roll(6)) { actions.push(this.smoothenEdges.bind(this)); }
                if (roll(6)) { actions.push(this.edgeInterpolate.bind(this)); }
                if (roll(6)) { actions.push(this.replaceBlack.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.pattern_1.bind(this)); }
                if (roll(baseEffectDice)) { actions.push(this.pattern_2.bind(this)); }
                while (actions.length) {
                    let ix = _randInt(0, actions.length);
                    map = actions[ix](map);
                    actions.splice(ix, 1);
                }
            }


            map = this.scaledMap(map, scale_sqrt);

            canvas.width = map[0].length;
            canvas.height = map.length;

            const ctx = canvas.getContext('2d');
            const imgData = ctx.createImageData(canvas.width, canvas.height);
            const data = imgData.data;

            for (var row = 0; row < map.length; row++) {
                for (var col = 0; col < map[row].length; col++) {
                    data[(row * map[0].length + col) * 4] = map[row][col][0];
                    data[(row * map[0].length + col) * 4 + 1] = map[row][col][1];
                    data[(row * map[0].length + col) * 4 + 2] = map[row][col][2];
                    data[(row * map[0].length + col) * 4 + 3] = map[row][col][3];
                }
            }
            ctx.putImageData(imgData, 0, 0);

            // effect: cut out image in circle 
            if (roll(5)) {
                let radius = _randInt(10, 80);
                let x = Math.trunc(canvas.width / 2);
                let y = Math.trunc(canvas.height / 2);
                ctx.globalCompositeOperation = 'destination-in'
                ctx.arc(x, y, radius, 0, Math.PI*2, true);
                ctx.fill();
            } 

        }

        scaledMap(map, scale) {
            let enlarged = [];
            for (var row = 0; row < map.length; row++) {
                for (var s = 0; s < scale; s++) {
                    enlarged.push([]);
                }
                for (var col = 0; col < map[row].length; col++) {
                    for (var sr = 0; sr < s; sr++) {
                        for (var sc = 0; sc < s; sc++) {
                            enlarged[row * scale + sr][col * scale + sc] = map[row][col];
                        }
                    }
                }
            }
            return enlarged;
        }
        smoothenEdges(map) {
            let updated = copyRGBMap(map);
            const rounds = 3;

            for (var round = 0; round < rounds; round++) {
                let m = copyRGBMap(updated);
                for (var row = 0; row < m.length; row++) {
                    for (var col = 0; col < m[row].length; col++) {
                        updated[row][col] = this.mostCommonColorAround(m, row, col);
                    }
                }
            }
            return updated;
        }
        distort_1(map) {
            let updated = copyRGBMap(map);
            const rounds = _randInt(1, 15);
            const r4 = _randInt(0, 4);
            const r3 = _randInt(0, 3);
            const r2 = _randInt(0, 2);
            for (var round = 0; round < rounds; round++) {
                let m = copyRGBMap(updated);
                for (var row = 0; row < m.length; row++) {
                    for (var col = 0; col < m[row].length; col++) {
                        let ca = this.colorsAround(m, row, col);
                        if (ca.length === 2) {
                            updated[row][col] = ca[r2]
                        } else if (ca.length === 3) {
                            updated[row][col] = ca[r3];
                        } else if (ca.length === 4) {
                            updated[row][col] = ca[r4];
                        }
                    }
                }
            }
            return updated;
        }
        distort_2(map) {
            let updated = copyRGBMap(map);
            const rounds = 4;

            for (var round = 0; round < rounds; round++) {
                let m = copyRGBMap(updated);
                for (var row = 0; row < m.length; row++) {
                    for (var col = 0; col < m[row].length; col++) {
                        if (this.isEmpty(m[row][col])) {
                            continue;
                        }
                        let ca = this.colorsAround(m, row, col, false);
                        if (ca.length < 4) {
                            updated[row][col] = roll(1) ? [0, 0, 0, 0] : updated[row][col];
                        }
                    }
                }
            }
            return updated;
        }
        distort_3(map) {
            let updated = copyRGBMap(map);
            const rounds = _randInt(5, 45);
            const r1 = _randInt(2, 4);

            for (var round = 0; round < rounds; round++) {
                let m = copyRGBMap(updated);
                for (var row = 0; row < m.length; row++) {
                    for (var col = 0; col < m[row].length; col++) {
                        if (this.isEmpty(m[row][col])) {
                            continue;
                        }
                        let ca = this.colorsAround(m, row, col, false);
                        if (ca.length < 4) {
                            updated[row][col] = row % r1 === 0 ? [0, 0, 0, 0] : updated[row][col];
                        }
                    }
                }
            }
            return updated;
        }
        distort_4(map) {
            let updated = copyRGBMap(map);
            const rounds = _randInt(1, 10);

            for (var round = 0; round < rounds; round++) {
                let m = copyRGBMap(updated);
                for (var row = 0; row < m.length; row++) {
                    for (var col = 0; col < m[row].length; col++) {
                        if (this.isEmpty(m[row][col])) {
                            continue;
                        }
                        let ca = this.countColorsAround(m, row, col, true);
                        if (ca > 1) {
                            updated[row][col] = darkenRGBA(m[row][col], 20);
                        }
                    }
                }
            }
            return updated;
        }
        distort_5(map) {
            let updated = copyRGBMap(map);
            let r = _getRandomColors(1)[0];
            for (var row = 0; row < map.length; row++) {
                for (var col = 0; col < map[row].length; col++) {
                    if (this.isEmpty(map[row][col])) { continue; }
                    let ca = this.countColorsAround(map, row, col, true);
                    if (ca === 1) {
                        updated[row][col] = r;
                    } else if (ca === 3)
                        updated[row][col] = [0, 0, 0, 0];
                }
            }
            return updated;
        }
        distort_6(map) {
            let updated = copyRGBMap(map);
            let r = _getRandomColors(1)[0];
            for (var row = 0; row < map.length; row++) {
                for (var col = 0; col < map[row].length; col++) {
                    if (this.isEmpty(map[row][col])) { continue; }
                    if (this.hasDifferentColorAround(map, row, col)) {
                        updated[row][col] = r;
                    } else {
                        updated[row][col] = [0, 0, 0, 0];
                    }
                }
            }
            return updated;
        }
        distort_7(map) {
            let updated = copyRGBMap(map);
            let r = _getRandomColors(20);
            for (var round = 0; round < 1; round++) {
                for (var row = 0; row < map.length; row++) {
                    for (var col = 0; col < map[row].length; col++) {
                        if (this.isEmptyOrMapEdge(map, row, col)) { continue; }
                        let ca = smallestDistanceToEmptyPixel(map, row, col);
                        if (ca > 0 && ca < r.length - 1) {
                            updated[row][col] = r[ca].slice();
                        }
                    }
                }
            }
            return updated;
        }
        distort_8(map) {
            let updated = copyRGBMap(map);
            let r = _getRandomColors(1)[0];
            for (var row = 0; row < map.length; row++) {
                for (var col = 0; col < map[row].length; col++) {
                    if (this.isEmptyOrMapEdge(map, row, col)) { continue; }
                    let ca = smallestDistanceToEmptyPixel(map, row, col);
                    if (ca === 10) {
                        updated[row][col] = r;
                    } else if (ca === 2 || ca === 5 || ca === 8)
                        updated[row][col] = [0, 0, 0, 0];
                }
            }
            return updated;
        }
        movePixels(map) {
            let updated = copyRGBMap(map);
            const rounds = _randInt(1, 25);

            for (var round = 0; round < rounds; round++) {
                let m = copyRGBMap(updated);
                for (var row = 0; row < m.length; row++) {
                    for (var col = 0; col < m[row].length; col++) {
                        if (_randInt(0, 4) === 0) {
                            let ca = this.colorsAround(m, row, col, true);
                            if (ca.length) {
                                updated[row][col] = ca[_randInt(0, ca.length)];
                            }
                        }
                    }
                }
            }
            return updated;
        }
        averageColors(map) {
            let updated = copyRGBMap(map);
            let last = null;
            let m = copyRGBMap(updated);
            let r = _randInt(2, 5);

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        if (last) {
                            updated[row][col] = last;
                        }
                        if (roll(r)) {
                            last = this.averageColor(this.colorsAround(m, row, col));
                        }
                    }
                }
            }
            return updated;
        }
        gradient(map) {
            let updated = copyRGBMap(map);
            let c = null;
            let m = copyRGBMap(updated);

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        c = m[row][col];
                        let diff = smallestDistanceToEmptyPixel(m, row, col);
                        if (diff !== -1) {
                            for (var i = 0; i < 10 - diff; i++)
                                c = darkenRGBA(c, 15);
                        }
                        updated[row][col] = c;
                    }
                }
            }
            return updated;
        }
        gradientFancy(map) {
            let updated = copyRGBMap(map);
            let c = null;
            let m = copyRGBMap(updated);
            let rc_0 = [_randInt(150, 200), _randInt(150, 200), _randInt(150, 200), 255];
            let rc_1 = [_randInt(150, 200), _randInt(150, 200), _randInt(150, 200), 255];

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        c = m[row][col][0] > 150 == 0 ? rc_0 : rc_1;
                        let diff = smallestDistanceToEmptyPixel(m, row, col);
                        if (diff !== -1) {
                            for (var i = 0; i < Math.max(1, 20 - diff); i++)
                                c = darkenRGBA(c, Math.min(row, m.length - row, col, m[0].length - col));
                        }
                        updated[row][col] = c;
                    }
                }
            }
            return updated;
        }
        gradientPointed(map) {
            let updated = copyRGBMap(map);
            let c = null;
            let m = copyRGBMap(updated);
            let rp = _randInt(0, map.length);
            let cp = _randInt(0, map[0].length);
            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        c = m[row][col];
                        for (var i = 0; i < Math.trunc(Math.sqrt(Math.pow(rp - row, 2) + Math.pow(cp - col, 2))); i++)
                            c = darkenRGBA(c, 3);
                        updated[row][col] = c;
                    }
                }
            }
            return updated;
        }
        canvasTexture(map) {
            let updated = copyRGBMap(map);
            let c = null;
            let m = copyRGBMap(updated);

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        c = m[row][col];
                        for (var i = 0; i < _randInt(1, 15); i++)
                            if (row % 2 === 0)
                                c = darkenRGBA(c, 5);
                            else
                                c = darkenRGBA(c, -5);
                        updated[row][col] = c;
                    }
                }
            }
            return updated;
        }
        pattern_1(map) {
            let updated = copyRGBMap(map);
            let c = null;
            let m = copyRGBMap(updated);
            let rc = _getRandomColors(1)[0];

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        c = m[row][col];
                        if ((row === m.length - 1 || colorsAreEqual(c, m[row + 1][col])) && (row === 0 || colorsAreEqual(c, m[row - 1][col])) && (col === 0 || colorsAreEqual(c, m[row][col - 1])) && (col === m[0].length - 1 || colorsAreEqual(c, m[row][col + 1]))) {
                            updated[row][col] = rc;
                        }
                    }
                }
            }
            return updated;
        }
        pattern_2(map) {
            let c = null;
            let m = copyRGBMap(map);
            let rc = _getRandomColors(1)[0];

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        c = m[row][col];
                        if ((row === m.length - 1 || colorsAreEqual(c, m[row + 1][col])) && (row === 0 || colorsAreEqual(c, m[row - 1][col])) && (col === 0 || colorsAreEqual(c, m[row][col - 1])) && (col === m[0].length - 1 || colorsAreEqual(c, m[row][col + 1]))) {
                            m[row][col] = rc;
                        }
                    }
                }
            }
            return m;
        }
        pattern_3(map) {
            let m = copyRGBMap(map);
            let rc = _getRandomColors(1)[0];

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        let ca = this.countColorsAround(map, row, col);
                        if (ca > 1 && ca < 4) {
                            m[row][col] = rc;
                        }
                    }
                }
            }
            return m;
        }
        replaceBlack(map) {
            let updated = copyRGBMap(map);
            let m = copyRGBMap(updated);
            let rc = _getRandomColors(1)[0];

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0 && m[row][col][0] === 0 && m[row][col][1] === 0 && m[row][col][2] === 0) {
                        updated[row][col] = rc;
                    }
                }
            }
            return updated;
        }
        invertColors(map) {
            let updated = copyRGBMap(map);
            let m = copyRGBMap(updated);

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        updated[row][col] = invertRGBA(m[row][col]);
                    }
                }
            }
            return updated;
        }
        edgeInterpolate(map) {
            let updated = copyRGBMap(map);
            let m = copyRGBMap(updated);

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    updated[row][col] = edgeInterpolate(m, row, col);
                }
            }
            return updated;
        }

        colorsAround(map, row, col, includeEmpty = false) {
            let c = [];
            if (row - 1 >= 0 && (includeEmpty || !this.isEmpty(map[row - 1][col]))) {
                c.push(map[row - 1][col]);
            }
            if (row + 1 < map.length && (includeEmpty || !this.isEmpty(map[row + 1][col]))) {
                c.push(map[row + 1][col]);
            }
            if (col - 1 >= 0 && (includeEmpty || !this.isEmpty(map[row][col - 1]))) {
                c.push(map[row][col - 1]);
            }
            if (col + 1 < map[0].length && (includeEmpty || !this.isEmpty(map[row][col + 1]))) {
                c.push(map[row][col + 1]);
            }
            return c;
        }
        countColorsAround(map, row, col, includeEmpty = false) {
            let c = [];
            if (row - 1 >= 0 && c.indexOf(map[row - 1][col].toString()) === -1 && (includeEmpty || !this.isEmpty(map[row - 1][col]))) {
                c.push(map[row - 1][col].toString());
            }
            if (row + 1 < map.length && c.indexOf(map[row + 1][col].toString()) === -1 && (includeEmpty || !this.isEmpty(map[row + 1][col]))) {
                c.push(map[row + 1][col].toString());
            }
            if (col - 1 >= 0 && c.indexOf(map[row][col - 1].toString()) === -1 && (includeEmpty || !this.isEmpty(map[row][col - 1]))) {
                c.push(map[row][col - 1].toString());
            }
            if (col + 1 < map[0].length && c.indexOf(map[row][col + 1].toString()) === -1 && (includeEmpty || !this.isEmpty(map[row][col + 1]))) {
                c.push(map[row][col + 1].toString());
            }
            return c.length;
        }
        hasDifferentColorAround(map, row, col) {
            let c = map[row][col];
            if (row - 1 < 0 || !colorsAreEqual(map[row - 1][col], c)) {
                return true;
            }
            if (row + 1 >= map.length || !colorsAreEqual(map[row + 1][col], c)) {
                return true;
            }
            if (col - 1 < 0 || !colorsAreEqual(map[row][col - 1], c)) {
                return true;
            }
            if (col + 1 >= map[0].length || !colorsAreEqual(map[row][col + 1], c)) {
                return true;
            }
            return false;
        }
        averageColor(colors) {
            let r = 0;
            let g = 0;
            let b = 0;
            for (var i = 0; i < colors.length; i++) {
                r += colors[i][0];
                g += colors[i][1];
                b += colors[i][2];
            }
            return [Math.round(r / colors.length), Math.round(g / colors.length), Math.round(b / colors.length), 255];
        }
        isEmpty(cell) {
            return cell[0] === 0 && cell[1] === 0 && cell[2] === 0 && cell[3] === 0;
        }
        isEmptyOrMapEdge(map, row, col) {
            return this.isEmpty(map[row][col]) || row === 0 || col === 0 || row === map.length - 1 || col === map[0].length - 1;
        }
        mostCommonColorAround(map, row, col) {
            let c = {};
            if (row - 1 >= 0) {
                c[map[row - 1][col]] = c[map[row - 1][col]] + 1 || 1;
            }
            if (row + 1 < map.length) {
                c[map[row + 1][col]] = c[map[row + 1][col]] + 1 || 1;
            }
            if (col - 1 >= 0) {
                c[map[row][col - 1]] = c[map[row][col - 1]] + 1 || 1;
            }
            if (col + 1 < map[0].length) {
                c[map[row][col + 1]] = c[map[row][col + 1]] + 1 || 1;
            }
            let highest = -1;
            let chosen = [];
            for (var [color, count] of Object.entries(c)) {
                if (count > highest) {
                    highest = count;
                    chosen = [color];
                } else if (count == highest) {
                    chosen.push(color);
                }
            }
            if (highest === 3) {
                return this.averageColor(chosen.map(x => x.split(",").map(function (cs) { return Number(cs); })))
            }
            return chosen[0].split(",").map(function (cs) { return Number(cs); });
        }

    }
    function colorsAreEqual(c1, c2) {
        return c2[3] === c1[3] && c2[2] === c1[2] && c2[1] === c1[1] && c2[0] === c1[0];
    }
    function colorsAreClose(c1, c2, maxDelta) {
        return c2[3] === c1[3] && Math.abs(c2[2] - c1[2]) + Math.abs(c2[1] - c1[1]) + Math.abs(c2[0] - c1[0]) < maxDelta;
    }
    function mirrorVertically(map) {
        let l = map[0].length;
        for (var i = 0; i < map.length; i++) {
            for (var c = l - 1; c >= 0; c--) {
                map[i].push(map[i][c]);
            }
        }
        return map;
    }

    function mirrorQuarter(map) {
        let l = map[0].length;
        let rowC = map.length;
        for (var i = 0; i < map.length; i++) {
            for (var c = l - 1; c >= 0; c--) {
                map[i].push(map[i][c]);
            }
        }
        for (var i = 0; i < rowC; i++) {
            map.push([]);
            for (var c = 0; c < map[i].length; c++) {
                map[rowC + i].push(map[rowC - i - 1][c]);
            }
        }
        return map;
    }
    function _getRandomColors(count) {
        let colors = [];
        for (var c = 0; c < count; c++) {
            colors.push([_randInt(0, 256), _randInt(0, 256), _randInt(0, 256), 255]);
        }
        return colors;
    }
    function _randInt(start, endExclusive) {
        return Math.floor(Math.random() * (endExclusive - start)) + start;
    }
    function defaultSteps() {
        return ["fillborders", "mirrorvertically", "brighten", "[coloredborder]"];
    }
    function overlayAll(maps) {
        let current = maps[0];
        for (var i = 1; i <= maps.length - 1; i++) {
            current = overlayMaps(current, maps[i]);
        }
        return current;
    }
    function overlayMaps(map1, map2) {
        let mapFused = copyRGBMap(map1.mapRBGValues);
        for (var r = 0; r < map1.mapRBGValues.length; r++) {
            for (var c = 0; c < map1.mapRBGValues[0].length; c++) {
                if (map2.mapRBGValues[r][c].reduce(function (a, b) { return a + b; }) === 0) {
                    mapFused[r][c] = mapFused[r][c];
                } else {
                    mapFused[r][c] = map2.mapRBGValues[r][c];
                }
            }
        }
        map1.mapRBGValues = mapFused;
        let map012Fused = copyMap(map1.map012);
        for (var r = 0; r < map1.map012.length; r++) {
            for (var c = 0; c < map1.map012[0].length; c++) {
                if (map2.map012[r][c] === 0) {
                    map012Fused[r][c] = map012Fused[r][c];
                } else {
                    map012Fused[r][c] = map2.map012[r][c];
                }
            }
        }
        map1.mapRBGValues = mapFused;
        map1.map012 = map012Fused;
        map1.map012Scaled = map1.scaledMap(map1.map012, SCALE);
        return map1;
    }

    function generateRandom(canvas, effects = false) {
        let temps = [];
        let singles = [];
        let predef = [];

        temps.push(new PMapTemplate(template_1, defaultSteps()));
        temps.push(new PMapTemplate(template_2, defaultSteps()));
        temps.push(new PMapTemplate(template_3, defaultSteps()));
        temps.push(new PMapTemplate(template_4, defaultSteps()));
        temps.push(new PMapTemplate(template_5, defaultSteps()));
        temps.push(new PMapTemplate(template_6, defaultSteps()));
        temps.push(new PMapTemplate(template_7, defaultSteps()));
        temps.push(new PMapTemplate(template_8, defaultSteps()));
        temps.push(new PMapTemplate(template_9, ["fillborders", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_10, ["fillborders", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_11, ["fillborders", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_12, defaultSteps()));
        temps.push(new PMapTemplate(template_13, defaultSteps()));
        temps.push(new PMapTemplate(template_14, defaultSteps()));
        temps.push(new PMapTemplate(template_15, defaultSteps()));

        for (let i = 0; i < singleTemplates.length; i++) {
            singles.push(new PMapTemplate(singleTemplates[i], defaultSteps()));
        }

        let maps = [];
        let was_predef = false;

        if (roll(4)) {
            was_predef = true;
            predef.push(
                [heads, torsos, feet, eyes], 
                [bugs] 
                );

            let predef_pipeline = predef[_randInt(0, predef.length)];
            for (var i = 0; i < predef_pipeline.length; i++) {
                maps.push(new PMapTemplate(predef_pipeline[i][_randInt(0, predef_pipeline[i].length)], defaultSteps()).generateMap());
            }
        } else if (roll(3)) {
            let chosen = singles[_randInt(0, singles.length)];
            maps.push(chosen.generateMap());
        } else {
            const rounds = _randInt(3, 8);
            for (var i = 0; i < rounds; i++) {
                let chosen = temps[_randInt(0, temps.length)];
                let map = chosen.generateMap();
                maps.push(map);
            }
        }

        let fused = overlayAll(maps);
        fused.printToCanvas(canvas, effects && !was_predef);
    }

    function copyRGBMap(map) {
        var newArray = [];
        for (var i = 0; i < map.length; i++) {
            newArray[i] = [];
            for (var c = 0; c < map[i].length; c++) {
                newArray[i][c] = map[i][c].slice();
            }
        }
        return newArray;
    }
    function copyMap(map) {
        var newArray = [];
        for (var i = 0; i < map.length; i++) {
            newArray[i] = map[i].slice();
        }
        return newArray;
    }

    function rollFilling(type) {
        if (type == 0) {
            return 0;
        }
        if (type == 1) {
            return _randInt(0, 2) == 1 ? 0 : 1;
        }
        if (type == 2) {
            return _randInt(0, 2) == 1 ? 1 : 2;
        }
        if (type == 3) {
            return 2;
        }
        if (type == 4) {
            return 1;
        }
        if (type === 5) {
            return _randInt(0, 2) === 1 ? 0 : 2;
        }
        if (type === 6) {
            return 6;
        }
        if (type === 7) {
            return _randInt(0, 2) === 1 ? 0 : 6;
        }
        if (type === 8) {
            return 8;
        }
    }
    function roll(dice) {
        return _randInt(0, dice) === 0;
    }
    function getEmptyAround(map, row, col) {
        let n = [];
        if (row > 0 && map[row - 1][col] === 0) { n.push([row - 1, col]); }
        if (row < map.length - 1 && map[row + 1][col] == 0) { n.push([row + 1, col]); }
        if (col > 0 && map[row][col - 1] == 0) { n.push([row, col - 1]); }
        if (col < map[row].length - 1 && map[row][col + 1] == 0) { n.push([row, col + 1]); }
        return n;
    }
    function smallestDistanceToEmptyPixel(map, row, col) {
        let init_smallest = 100000;
        let smallest = init_smallest;
        for (var r = row; r < map.length; r++) {
            if (map[r][col][3] === 0) {
                if ((r - row) < smallest) { smallest = r - row; }
                break;
            }
        }
        for (var r = row; r >= 0; r--) {
            if (map[r][col][3] === 0) {
                if ((row - r) < smallest) { smallest = row - r; }
                break;
            }
        }
        for (var c = col; c < map[0].length; c++) {
            if (map[row][c][3] === 0) {
                if ((c - col) < smallest) { smallest = c - col; }
                break;
            }
        }
        for (var c = col; c >= 0; c--) {
            if (map[row][c][3] === 0) {
                if ((col - c) < smallest) { smallest = col - c; }
                break;
            }
        }
        if (smallest === init_smallest) {
            return -1;
        }
        return smallest;
    }
    function edgeInterpolate(map, row, col) {
        if (row - 1 >= 0 && col + 1 < map[0].length && !colorsAreClose(map[row][col], map[row - 1][col], 20) && colorsAreClose(map[row - 1][col], map[row][col + 1], 20)) {
            return map[row - 1][col];
        }
        if (row + 1 < map.length && col + 1 < map[0].length && !colorsAreClose(map[row][col], map[row + 1][col], 20) && colorsAreClose(map[row][col + 1], map[row + 1][col], 20)) {
            return map[row + 1][col];
        }
        if (row + 1 < map.length && col - 1 >= 0 && !colorsAreClose(map[row][col], map[row + 1][col], 20) && colorsAreClose(map[row + 1][col], map[row][col - 1], 20)) {
            return map[row + 1][col];
        }
        if (row - 1 >= 0 && col - 1 >= 0 && !colorsAreClose(map[row][col], map[row - 1][col], 20) && colorsAreClose(map[row - 1][col], map[row][col - 1], 20)) {
            return map[row - 1][col];
        }
        return map[row][col];
    }

    function darkenRGBA(rgba, delta) {
        return [Math.min(Math.max(0, rgba[0] - delta), 255), Math.min(Math.max(0, rgba[1] - delta), 255), Math.min(Math.max(0, rgba[2] - delta), 255), 255];
    }
    function invertRGBA(rgba) {
        return [Math.max(0, 255 - rgba[0]), Math.max(0, 255 - rgba[1]), Math.max(255 - rgba[2]), 255];
    }
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    let transformations = [];

    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            let px = _bottomPx(canvas, data, i / 4);
            if (!px || isEmpty(px))
                px = _topPx(canvas, data, i / 4);
            if (px) {
                data[i] = px[0];
                data[i + 1] = px[1];
                data[i + 2] = px[2];
                data[i + 3] = px[3];
            }
        }
        context.putImageData(imageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        for (var i = data.length - 4; i >= 0; i -= 4) {
            let px = _topPx(canvas, data, i / 4);
            if (!px || isEmpty(px))
                px = _bottomPx(canvas, data, i / 4);
            if (px) {
                data[i] = px[0];
                data[i + 1] = px[1];
                data[i + 2] = px[2];
                data[i + 3] = px[3];
            }
        }
        context.putImageData(imageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let s = Math.trunc(new Date().getSeconds() / 2);
        let d = _randInt(5, 20);
        let fns = [_topPx, _topleftPx, _rightPx, _toprightPx, _leftPx, _bottomleftPx, _bottomPx, _bottomrightPx];
        for (var i = data.length - 4; i >= 0; i -= 4) {
            let px = fns[s % 8](canvas, data, i / 4);
            let c = 0;
            while (!px) {
                c++;
                px = fns[(s + c) % 8](canvas, data, i / 4);
            }
            if (px && !isEmpty(px) && hasExactlyNEmptyNeighbours(canvas, data, i / 4, 2)) {
                data[i] = (px[0] - d) % 255;
                data[i + 1] = (px[1] - d) % 255;
                data[i + 2] = (px[2] - d) % 255;
                data[i + 3] = px[3];
            }
        }
        context.putImageData(imageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let px = null;
        for (var i = 0; i < data.length; i += 4) {
            if (isEmpty([data[i], data[i + 1], data[i + 2], data[i + 3]])) {
                px = cv_randomNeighbour(canvas, data, i / 4);
                data[i] = px[0];
                data[i + 1] = px[1];
                data[i + 2] = px[2];
                data[i + 3] = px[3];
            }
        }
        context.putImageData(imageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let px = null;
        for (var i = 0; i < data.length; i += 4) {
            px = cv_randomNeighbour(canvas, data, i / 4);
            data[i] = px[0];
            data[i + 1] = px[1];
            data[i + 2] = px[2];
            data[i + 3] = px[3];
        }
        context.putImageData(imageData, 0, 0);
    });
    
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let px = null;
        let n = _randInt(0, 4);
        for (var i = 0; i < data.length; i += 4) {
            if (hasExactlyNEmptyNeighbours(canvas, data, i / 4, n)) {
                px = cv_randomNeighbour(canvas, data, i / 4);
                data[i] = px[0];
                data[i + 1] = px[1];
                data[i + 2] = px[2];
                data[i + 3] = px[3];
            }
        }
        context.putImageData(imageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let px = null;
        let fn = shuffle([_bottomPx, _topPx, _leftPx, _rightPx]);
        let non_empty = false;
        for (var i = 0; i < data.length; i += 4) {
            if (hasEmptyNeighbour(canvas, data, i / 4)) {
                for (var ix = 0; ix < 4; ix++) {
                    px = fn[ix](canvas, data, i / 4);
                    if (px && isEmpty(_topPx(canvas, data, i / 4 + 1))) {
                        data[i] = px[0];
                        data[i + 1] = px[1];
                        data[i + 2] = px[2];
                        data[i + 3] = px[3];
                        break;
                    }
                }
            }
            if (!non_empty && data[i] != 0 || data[i + 1] != 0 || data[i + 2] != 0 || data[i + 3] != 0)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(imageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let non_empty = false;
        let n = (new Date().getMinutes() * 6) % 255;
        for (var i = 0; i < data.length; i += 4) {
            if (hasEmptyNeighbour(canvas, data, i / 4)) {
                data[i] = n;
                data[i + 1] = n;
                data[i + 2] = n;
            }
            if (!non_empty && data[i] != 0 || data[i + 1] != 0 || data[i + 2] != 0 || data[i + 3] != 0)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(imageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let non_empty = false;
        let fns = shuffle([_bottomPx, _topPx, _leftPx, _rightPx]);
        let fn = fns[0], fn_2 = fns[1];
        let px = null;
        for (var i = 0; i < data.length; i += 4) {
            if (isEmpty(fn(canvas, data, i / 4))) {
                px = fn_2(canvas, data, i / 4);
                if (px) {
                    newData[i] = px[0];
                    newData[i + 1] = px[1];
                    newData[i + 2] = px[2];
                    newData[i + 3] = px[3];
                }
            }
            if (!non_empty && newData[i + 3] >= 10)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let x = new Date().getMinutes() % 3;
        for (var i = 0; i < data.length; i += 4) {
            if (i < data.length - 3) {
                newData[i + x] = i / 2 / (canvas.width) % _randInt(150, 255);
            }
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let offset = _randInt(0, 255);
        for (var i = 0; i < data.length; i += 4) {
            if (i < data.length - 3);
            newData[i + 1] = i % offset;
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let non_empty = false;
        let n = (new Date().getMinutes() * 6) % 255;
        let n1 = (new Date().getMinutes() * 12) % 255;
        for (var i = 0; i < data.length; i += 4) {
            if (hasEmptyNeighbour(canvas, data, i / 4)) {
                newData[i] = n;
                newData[i + 1] = n1;
                newData[i + 2] = n;
                newData[i + 3] = data[i + 3];
            } else {
                newData[i + 3] = 0;
            }
            if (!non_empty && newData[i] != 0 || newData[i + 1] != 0 || newData[i + 2] != 0 || newData[i + 3] != 0)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let fns = shuffle([_topPx, _bottomPx, _leftPx, _rightPx]);
        let non_empty = false;
        let px = null, last = null;
        for (var i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 10) {
                let c = 0;
                for (let fn of fns) {
                    px = fn(canvas, data, i / 4);
                    if (px) {
                        last = px;
                        c++;
                    }
                }
                if (c >= 3) {
                    newData[i] = last[0];
                    newData[i + 1] = last[1];
                    newData[i + 2] = last[2];
                    newData[i + 3] = last[3];
                }
            }
            if (!non_empty && newData[i + 3] > 10)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let px = null, px_2 = null, px_3 = null;
        for (var i = 0; i < data.length; i += 4) {
            px = _topPx(canvas, data, i / 4);
            px_2 = _rightPx(canvas, data, i / 4);
            px_3 = _toprightPx(canvas, data, i / 4);
            if (px && px_2 && px_3 && px[0] < 245 && px_2[0] > 10 && px[1] < 245 && px_3[0] === px_2[0] && px_2[0] === px[0]) {
                newData[i] = (px[0] + px_2[0]) % 255;
                newData[i + 1] = (px[1] + px_2[1]) % 255;
                newData[i + 2] = (px[2] + px_2[2]) % 255;
            }
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let px = null, px_2 = null, px_3 = null;
        for (var i = 0; i < data.length; i += 4) {
            px = _topPx(canvas, data, i / 4);
            px_2 = _rightPx(canvas, data, i / 4);
            px_3 = _toprightPx(canvas, data, i / 4);
            if (px && px_2 && px_3 && px[0] == px_2[0] && Math.abs(px[0] - px_3[0]) % 3 == 0) {
                newData[i] = (px_3[0] + 10) % 255;
                newData[i + 1] = px_3[1];
                newData[i + 2] = (px[2] + px_2[2]) % 255;
            }
        }
        context.putImageData(cimageData, 0, 0);
    });

    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let px = null, px_2 = null, px_3 = null;
        let x = new Date().getMinutes() % 2 === 0;
        for (var i = 0; i < data.length; i += 4) {
            px = _bottomPx(canvas, data, i / 4);
            px_2 = _topPx(canvas, data, i / 4);
            px_3 = _bottomleftPx(canvas, data, i / 4);
            if (px && px_2 && px_3 && px[0] == px_2[0] && Math.abs(px[0] - px_3[0]) % 3 == 0) {
                newData[i] = (px_3[0] + 10) % 255;
                newData[i + x ? i%3 : 1] = (px_3[0] + 4) % 255;
                newData[i + 2] = (px[2] + px_2[2]) % 255;
            }
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let px = null;
        for (var i = 0; i < data.length; i += 4) {
            px = _bottomPx(canvas, data, i / 4);
            if (px  && data[i+3] > 10) {
                newData[i] = (px[0] + 4) % 255;
                newData[i + 1] = (data[i+1] + 4) % 255;
                newData[i + 2] = (data[i+2] + 4) % 255;
            }
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let px = null, px_2 = null;
        for (var i = 0; i < data.length; i += 4) {
            px = _bottomPx(canvas, data, i / 4);
            px_2 = _rightPx(canvas, data, i /4);
            if (px && px_2  && data[i+3] > 10) {
                newData[i] = (px[0] + 4) % 255;
                newData[i + 1] = (px_2[1] + 5) % 255;
                newData[i + 2] = (px_2[2] + 6) % 255;
            }
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let r = new Date().getMinutes() + 3;
        for (var i = 0; i < data.length; i += 4) {
            if (cv_hasDifferentColorAround(canvas, data, i / 4) && data[i + 3] > 50) {
                let d = cv_smallestDistanceToEmptyPixel(canvas, data, i / 4);
                newData[i + 3] = (255 - d * 10) % 255;
                newData[i + 2] = (d * r) % 255;
                newData[i + 1] = (d * r) % 255;
                newData[i] = (d * r) % 255;
            }

        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let delta_r = _randInt(0, 30) - 15;
        let delta_g = _randInt(0, 30) - 15;
        let delta_b = _randInt(0, 30) - 15;
        let px = null, px_2 = null, px_3 = null;
        for (var i = 0; i < data.length; i += 4) {
            px = _topPx(canvas, data, i / 4);
            px_2 = _rightPx(canvas, data, i / 4);
            px_3 = _toprightPx(canvas, data, i / 4);
            if (px && px_2 && px_3 && Math.abs(px[0] - px_2[0]) < 60) {
                data[i] = Math.min(255, Math.max(0, data[i] + delta_r));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + delta_g));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + delta_b));
            }
        }
        context.putImageData(imageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        for (var i = 0; i < data.length; i += 4) {
            let t = _topPx(canvas, data, i / 4);
            let r = _rightPx(canvas, data, i / 4);
            let tr = _toprightPx(canvas, data, i / 4);
            let br = _bottomrightPx(canvas, data, i / 4);
            let tl = _topleftPx(canvas, data, i / 4);
            let bl = _bottomleftPx(canvas, data, i / 4);
            let l = _leftPx(canvas, data, i / 4);
            let b = _bottomPx(canvas, data, i / 4);
            if (t && r && tr && bl && l && b && Math.abs(t[0] - r[0]) < 10 && Math.abs(l[0] - r[0]) < 20) {
                newData[i] = Math.min(255, Math.max(0, Math.abs(0 - 2 * l[0] - tl[0] - bl[0] + 2 * r[0] + tr[0] + br[0]) + Math.abs(2 * t[0] + tr[0] + tl[0] - 2 * b[0] - bl[0] - br[0])));
                newData[i + 1] = Math.min(255, Math.max(0, Math.abs(0 - 2 * l[1] - tl[1] - bl[1] + 2 * r[1] + tr[1] + br[1]) + Math.abs(2 * t[1] + tr[1] + tl[1] - 2 * b[1] - bl[1] - br[1])));
                newData[i + 2] = Math.min(255, Math.max(0, Math.abs(0 - 2 * l[2] - tl[2] - bl[2] + 2 * r[2] + tr[2] + br[2]) + Math.abs(2 * t[2] + tr[2] + tl[2] - 2 * b[2] - bl[2] - br[2])));
            }
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        for (var i = 0; i < data.length; i += 4) {
            let t = _topPx(canvas, data, i / 4);
            let r = _rightPx(canvas, data, i / 4);
            let tr = _toprightPx(canvas, data, i / 4);
            let br = _bottomrightPx(canvas, data, i / 4);
            let tl = _topleftPx(canvas, data, i / 4);
            let bl = _bottomleftPx(canvas, data, i / 4);
            let l = _leftPx(canvas, data, i / 4);
            let b = _bottomPx(canvas, data, i / 4);
            if (t && r && tr && bl && l && b && Math.abs(t[0] - r[0]) < 10 && Math.abs(l[0] - r[0]) < 20) {
                newData[i] = Math.min(255, Math.max(0, Math.abs(0 - i * l[0] - tl[0] - bl[0] + 2 * r[0] + tr[0] + br[0]) - Math.abs(i * t[0] + tr[0] + tl[0] - 2 * b[0] - bl[0] - br[0])));
                newData[i + 1] = Math.min(255, Math.max(0, Math.abs(0 - i * l[1] - tl[1] - bl[1] + 2 * r[1] + tr[1] + br[1]) - Math.abs(i * t[1] + tr[1] + tl[1] - 2 * b[1] - bl[1] - br[1])));
                newData[i + 2] = Math.min(255, Math.max(0, Math.abs(0 - i * l[2] - tl[2] - bl[2] + 2 * r[2] + tr[2] + br[2]) - Math.abs(i * t[2] + tr[2] + tl[2] - 2 * b[2] - bl[2] - br[2])));
            }
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        for (var i = 0; i < data.length; i += 4) {
            let t = _topPx(canvas, data, i / 4);
            let r = _rightPx(canvas, data, i / 4);
            let l = _leftPx(canvas, data, i / 4);
            let b = _bottomPx(canvas, data, i / 4);
            if (t && r && l && b) {
                newData[i] = Math.min(255, Math.max(0, 5 * data[i] - t[0] - r[0] - l[0] - b[0]));
                newData[i + 1] = Math.min(255, Math.max(0, 5 * data[i + 1] - t[1] - r[1] - l[1] - b[1]));
                newData[i + 2] = Math.min(255, Math.max(0, 5 * data[i + 2] - t[2] - r[2] - l[2] - b[2]));
            }
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let non_empty = false;
        for (var i = 0; i < data.length; i += 4) {
            let t = _topPx(canvas, data, i / 4);
            let r = _rightPx(canvas, data, i / 4);
            let tr = _toprightPx(canvas, data, i / 4);
            let br = _bottomrightPx(canvas, data, i / 4);
            let tl = _topleftPx(canvas, data, i / 4);
            let bl = _bottomleftPx(canvas, data, i / 4);
            let l = _leftPx(canvas, data, i / 4);
            let b = _bottomPx(canvas, data, i / 4);
            if (t && r && tr && bl && l && b && cv_hasDifferentColorAround(canvas, data, i / 4)) {
                newData[i] = Math.min(255, Math.max(0, Math.abs(2 * t[0])));
                newData[i + 1] = Math.min(255, Math.max(0, Math.abs(2 * tr[1])));
                newData[i + 2] = Math.min(255, Math.max(0, Math.abs(br[2])));
            }
            if (!non_empty && newData[i + 3] > 10)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let non_empty = false;
        let r = new Date().getMinutes() % 4 + 1;
        let fns = shuffle([_topPx, _topleftPx, _rightPx, _toprightPx, _leftPx, _bottomleftPx, _bottomPx, _bottomrightPx]);
        for (var i = 0; i < data.length; i += 4) {
            let p1 = fns[0](canvas, data, i / 4);
            let p2 = fns[1](canvas, data, i / 4);
            let l = _leftPx(canvas, data, i / 4);
            if (p1 && p2 && l && Math.trunc(i / 4 / canvas.width) % r == 0) {
                newData[i] = Math.min(255, Math.max(0, Math.abs(2 * p1[0])));
                newData[i + 1] = Math.min(255, Math.max(0, Math.abs(2 * p2[1])));
                newData[i + 2] = Math.min(255, Math.max(0, Math.abs(l[2])));
            }
            if (!non_empty && newData[i + 3] > 10)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let tr, t, l, b, r, bl;

        for (var i = 0; i < data.length; i += 4) {
            t = _topPx(canvas, data, i / 4);
            r = _rightPx(canvas, data, i / 4);
            tr = _toprightPx(canvas, data, i / 4);
            bl = _bottomleftPx(canvas, data, i / 4);
            l = _leftPx(canvas, data, i / 4);
            b = _bottomPx(canvas, data, i / 4);
            if (t && r && tr && bl && l && b) {
                newData[i] = Math.min(255, Math.max(0, data[i] - 2 * tr[0] - t[0] - r[0] + 2 * bl[0] + b[0] + l[0]));
                newData[i + 1] = Math.min(255, Math.max(0, data[i + 1] - 2 * tr[1] - t[1] - r[1] + 2 * bl[1] + b[1] + l[1]));
                newData[i + 2] = Math.min(255, Math.max(0, data[i + 2] - 2 * tr[2] - t[2] - r[2] + 2 * bl[2] + b[2] + l[2]));
            }
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let non_empty = false;
        let iter = getRandomIteration(data.length / 4);
        let fns = [_topPx, _topleftPx, _rightPx, _toprightPx, _leftPx, _bottomleftPx, _bottomPx, _bottomrightPx];
        let d1 = null, d2 = null;
        let min = new Date().getMinutes() % 8;
        let p = 0;
        for (var i = 0; i < iter.length; i++) {
            p = iter[i] * 4;
            d1 = fns[min](canvas, data, p / 4);
            d2 = fns[(min + 1) % 8](canvas, data, p / 4);
            if (d1 && d2 && d1[0] === d2[0] && d1[3] > 10) {
                data[p] = d1[0];
                data[p + 1] = (d2[1] * d1[0]) % 255;
                data[p + 2] = d1[2];
                data[p + 3] = d2[3];
            }
            if (!non_empty && data[p + 3] != 0)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(imageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let non_empty = false;
        let iter = getRandomIteration(data.length / 4);
        let p = 0;
        for (var i = 0; i < iter.length; i++) {
            p = iter[i] * 4;
            px = cv_smallestDistanceToEmptyPixel(canvas, data, p / 4);
            if (px) {
                data[p + 1] = data[(p + px) % data.length];
                data[p + 2] = data[p + 2];
                data[p + 3] = data[p + 3];
            }
            if (!non_empty && data[p + 3] != 0)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(imageData, 0, 0);
    });
      transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let non_empty = false;
        let iter = getRandomIteration(data.length / 4);
        let p = 0, diff = false;
        let x = new Date().getSeconds() % 3;
        for (var i = 0; i < iter.length; i++) {
            p = iter[i] * 4;
            diff = cv_hasDifferentColorAround(canvas, data, p / 4);
            if (diff) {
                data[p+0] = (x * data[p+0] +100) % 255;
                data[p+1] = (x * data[p+1] +100) % 255;
                data[p+2] = (x * data[p+2] +100) % 255;
            }
            if (!non_empty && data[p + 3] != 0)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(imageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let non_empty = false;
        let iter = getRandomIteration(data.length / 4);
        let p = 0, diff = false;
        let x = 4;
        let y = new Date().getSeconds() % 255;
        let lum = 0;
        for (var i = 0; i < iter.length; i++) {
            p = iter[i] * 4;
            if (data[p+3] <= 0)
            continue;
            lum = (data[p] + data[p+1] + data[p+2]) * 255 / 765;
            diff = cv_hasDifferentColorAround(canvas, data, p / 4);
            if (diff) {
                if (y % 3 !== 0) {
                    data[p+2] = Math.max(Math.min((lum - x), 255), 60);
                    data[p+1] = Math.max(Math.min((lum - x), 255), 60);
                    data[p+0] = Math.max(Math.min((lum - x), 255), 60);
                } else {

                    data[p+2] = Math.max(Math.min((lum + x), 210), 10);
                    data[p+1] = Math.max(Math.min((lum + x), 210), 10);
                    data[p+0] = Math.max(Math.min((lum + x), 210), 10);
                }
            }
            if (!non_empty && data[p + 3] != 0)
                non_empty = true;
        }
        if (non_empty)
            context.putImageData(imageData, 0, 0);
    });

    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let n = _randInt(2, 2);
        for (var i = 0; i < data.length; i += 4) {
            if (hasExactlyNEmptyNeighbours(canvas, data, i / 4, n)) {
                newData[i] = 0;
                newData[i + 1] = 0;
                newData[i + 2] = 0;
                newData[i + 3] = 0;
            }
        }
        if (roll(3)) {
            for (var i = 0; i < data.length; i += 4) {
                if (hasExactlyNEmptyNeighbours(canvas, newData, i / 4, 4)) {
                    newData[i] = 0;
                    newData[i + 1] = 0;
                    newData[i + 2] = 0;
                    newData[i + 3] = 0;
                }
            }
            clearInterval(window.sprite_animation);
        }
        context.putImageData(cimageData, 0, 0);
    });
    transformations.push((canvas) => {
        let context = canvas.getContext("2d");
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let cimageData = copyImgData(imageData);
        let newData = cimageData.data;
        let f = 1.04; 
        if (roll(2))
            f = 1.14; 
        for (var i = 0; i < data.length; i += 4) {
            if (data[i+3] > 0 && !cv_hasDifferentColorAround(canvas, data, i / 4)) {
                newData[i] = Math.max(0, Math.min(255, Math.trunc(data[i] * f)));
                newData[i+1] = Math.max(0, Math.min(255, Math.trunc(data[i+1] * f)));
                newData[i+2] = Math.max(0, Math.min(255, Math.trunc(data[i+2] * f)));
            }
        }
        if (roll(7)) {
            clearInterval(window.sprite_animation);
        }
        context.putImageData(cimageData, 0, 0);
    });
   

    function _bottomPx(canvas, data, ix) {
        if (data.length - ix <= canvas.width) {
            return null;
        }
        return [data[ix * 4 + canvas.width * 4], data[ix * 4 + canvas.width * 4 + 1], data[ix * 4 + canvas.width * 4 + 2], data[ix * 4 + canvas.width * 4 + 3]];
    }
    function _topPx(canvas, data, ix) {
        if (ix <= canvas.width) {
            return null;
        }
        return [data[ix * 4 - canvas.width * 4], data[ix * 4 - canvas.width * 4 + 1], data[ix * 4 - canvas.width * 4 + 2], data[ix * 4 - canvas.width * 4 + 3]];
    }
    function _leftPx(canvas, data, ix) {
        if (ix % canvas.width == 0) {
            return null;
        }
        ix -= 1;
        return [data[ix * 4], data[ix * 4 + 1], data[ix * 4 + 2], data[ix * 4 + 3]];
    }
    function _rightPx(canvas, data, ix) {
        if (ix % canvas.width == canvas.width - 1) {
            return null;
        }
        ix += 1;
        return [data[ix * 4], data[ix * 4 + 1], data[ix * 4 + 2], data[ix * 4 + 3]];
    }
    function _toprightPx(canvas, data, ix) {
        if (ix <= canvas.width || ix % canvas.width == canvas.width - 1) {
            return null;
        }
        ix += 1;
        return [data[ix * 4 - canvas.width * 4], data[ix * 4 - canvas.width * 4 + 1], data[ix * 4 - canvas.width * 4 + 2], data[ix * 4 - canvas.width * 4 + 3]];
    }
    function _topleftPx(canvas, data, ix) {
        if (ix <= canvas.width || ix % canvas.width == 0) {
            return null;
        }
        ix -= 1;
        return [data[ix * 4 - canvas.width * 4], data[ix * 4 - canvas.width * 4 + 1], data[ix * 4 - canvas.width * 4 + 2], data[ix * 4 - canvas.width * 4 + 3]];
    }
    function _bottomrightPx(canvas, data, ix) {
        if (data.length - ix <= canvas.width || ix % canvas.width == canvas.width - 1) {
            return null;
        }
        ix += 1;
        return [data[ix * 4 + canvas.width * 4], data[ix * 4 + canvas.width * 4 + 1], data[ix * 4 + canvas.width * 4 + 2], data[ix * 4 + canvas.width * 4 + 3]];
    }
    function _bottomleftPx(canvas, data, ix) {
        if (ix % canvas.width == 0 || data.length - ix <= canvas.width) {
            return null;
        }
        ix -= 1;
        return [data[ix * 4 + canvas.width * 4], data[ix * 4 + canvas.width * 4 + 1], data[ix * 4 + canvas.width * 4 + 2], data[ix * 4 + canvas.width * 4 + 3]];
    }
    function isEmpty(px) {
        return px && px[3] < 20;//  && px[0] == 0 && px[1] == 0 && px[2] == 0 && px[3] == 0;
    }
    function copyImgData(imageData) {
        return new ImageData(
            new Uint8ClampedArray(imageData.data),
            imageData.width,
            imageData.height
        )
    }
    function cv_randomNeighbour(canvas, data, ix) {
        let choices = [];
        let px = _topPx(canvas, data, ix);
        if (px) { choices.push(px); }
        px = _bottomPx(canvas, data, ix);
        if (px) { choices.push(px); }
        px = _rightPx(canvas, data, ix);
        if (px) { choices.push(px); }
        px = _leftPx(canvas, data, ix);
        if (px) { choices.push(px); }
        return choices[_randInt(0, choices.length)];
    }
    function cv_smallestDistanceToEmptyPixel(canvas, data, ix) {
        let smallest = 10000000;
        for (var i = ix; i % canvas.width != 0; i--) {
            if (data[i * 4 + 3] <= 5) {
                if ((ix - i) < smallest) {
                    smallest = ix - i;
                }
                break;
            }
            if ((ix - i) >= smallest)
                break;
        }
        for (var i = ix; i % canvas.width != canvas.width - 1; i++) {
            if (data[i * 4 + 3] <= 5) {
                if ((i - ix) < smallest) {
                    smallest = i - ix;
                }
                break;

            }
            if ((i - ix) >= smallest)
                break;
        }
        for (var i = ix; data.length - i > canvas.width; i += canvas.width) {
            if (data[i * 4 + 3] <= 5) {
                if (Math.trunc((i - ix) / canvas.width) < smallest) {
                    smallest = Math.trunc((i - ix) / canvas.width);
                }
                break;
            }
            if (Math.trunc((i - ix) / canvas.width) >= smallest) {
                break;
            }
        }
        for (var i = ix; i > canvas.width; i -= canvas.width) {
            if (data[i * 4 + 3] <= 5) {
                if (Math.trunc((ix - i) / canvas.width) < smallest) {
                    smallest = Math.trunc((ix - i) / canvas.width);
                }
                break;
            }
        }
        return smallest;
    }
    function cv_mostCommonColorAround(canvas, data, ix) {
        let c = {};
        let px = null;
        for (let fn of [_topPx, _bottomPx, _leftPx, _rightPx]) {
            px = fn(canvas, data, ix);
            if (px && (px[3] > 20)) {
                if (px in c) {
                    c[px] += 1;
                } else {
                    c[px] = 1;
                }
            }
        }
        let highest = 0;
        let highestC = null;
        for (const [key, value] of Object.entries(c)) {
            if (value >= highest) {
                highest = value;
                highestC = key;
            }
        }
        if (highestC)
            return highestC.split(",").map(function (cs) { return Number(cs); });
        return highestC;
    }

    function averageNeighbourColor(canvas, data, ix) {
        let c = 0;
        let avg = [0, 0, 0, 0];
        let px = _topPx(canvas, data, ix);
        if (px) { avg[0] + px[0]; avg[1] += px[1]; avg[2] += px[2]; avg[3] += px[3]; c++; }
        px = _bottomPx(canvas, data, ix);
        if (px) { avg[0] + px[0]; avg[1] += px[1]; avg[2] += px[2]; avg[3] += px[3]; c++; }
        px = _rightPx(canvas, data, ix);
        if (px) { avg[0] + px[0]; avg[1] += px[1]; avg[2] += px[2]; avg[3] += px[3]; c++; }
        px = _leftPx(canvas, data, ix);
        if (px) { avg[0] + px[0]; avg[1] += px[1]; avg[2] += px[2]; avg[3] += px[3]; c++; }
        return [avg[0] / c, avg[1] / c, avg[2] / c, avg[3] / c];
    }
    function hasExactlyNEmptyNeighbours(canvas, data, ix, n) {
        let px = _topPx(canvas, data, ix);
        let c = 0;
        if (px && isEmpty(px)) { c++; }
        if (c > n) { return false; }
        px = _bottomPx(canvas, data, ix);
        if (px && isEmpty(px)) { c++; }
        if (c > n) { return false; }
        px = _rightPx(canvas, data, ix);
        if (px && isEmpty(px)) { c++; }
        if (c > n) { return false; }
        px = _leftPx(canvas, data, ix);
        if (px && isEmpty(px)) { c++; }
        return c == n;
    }
    function hasEmptyNeighbour(canvas, data, ix) {
        let px = _topPx(canvas, data, ix);
        if (px && isEmpty(px)) { return true; }
        px = _bottomPx(canvas, data, ix);
        if (px && isEmpty(px)) { return true; }
        px = _rightPx(canvas, data, ix);
        if (px && isEmpty(px)) { return true; }
        px = _leftPx(canvas, data, ix);
        if (px && isEmpty(px)) { return true; }
        return false;
    }
    function hasNonEmptyNeighbour(canvas, data, ix) {
        let px = _topPx(canvas, data, ix);
        if (px && !isEmpty(px)) { return true; }
        px = _bottomPx(canvas, data, ix);
        if (px && !isEmpty(px)) { return true; }
        px = _rightPx(canvas, data, ix);
        if (px && !isEmpty(px)) { return true; }
        px = _leftPx(canvas, data, ix);
        if (px && !isEmpty(px)) { return true; }
        return false;
    }
    function getRandomIteration(ixCount) {
        let x = [];
        for (let i = 0; i < ixCount; i++) {
            x.push(i);
        }
        return shuffle(x);
    }
    function cv_hasDifferentColorAround(canvas, data, ix) {

        let px = _topPx(canvas, data, ix);
        if (px && (Math.abs(px[0] - data[ix * 4]) > 10 || Math.abs(px[1] - data[ix * 4 + 1]) > 10 || Math.abs(px[2] - data[ix * 4 + 2]) > 10 || Math.abs(px[3] - data[ix * 4 + 3]) > 10)) { return true; }
        px = _bottomPx(canvas, data, ix);
        if (px && (Math.abs(px[0] - data[ix * 4]) > 10 || Math.abs(px[1] - data[ix * 4 + 1]) > 10 || Math.abs(px[2] - data[ix * 4 + 2]) > 10 || Math.abs(px[3] - data[ix * 4 + 3]) > 10)) { return true; }
        px = _rightPx(canvas, data, ix);
        if (px && (Math.abs(px[0] - data[ix * 4]) > 10 || Math.abs(px[1] - data[ix * 4 + 1]) > 10 || Math.abs(px[2] - data[ix * 4 + 2]) > 10 || Math.abs(px[3] - data[ix * 4 + 3]) > 10)) { return true; }
        px = _leftPx(canvas, data, ix);
        if (px && (Math.abs(px[0] - data[ix * 4]) > 10 || Math.abs(px[1] - data[ix * 4 + 1]) > 10 || Math.abs(px[2] - data[ix * 4 + 2]) > 10 || Math.abs(px[3] - data[ix * 4 + 3]) > 10)) { return true; }
        return false;
    }

    function setTransformations() {
        let baseChance = Math.max(1, Math.trunc(transformations.length / 2));
        let chosen = [];
        for (let t of transformations) {
            if (roll(baseChance)) {
                chosen.push(t);
            }
        }
        chosen = shuffle(chosen);
        if (chosen.length >= 5) {
            window.prTransformationIvl = 200;
        } else {
            window.prTransformationIvl = 100;
        }
        window.prTransformations = chosen;
        window.prTransformationCount = 0;
    }

    function applyTransformations() {
        let s = performance.now();
        let c = prCanvas();
        if (!c) { return; }
        window.prTransformationCount ++;
        for (var i = 0; i < window.prTransformations.length; i++) {
            window.prTransformations[i](c);
        }
        let elapsed = performance.now() - s;
        if (elapsed > window.prTransformationIvl && window.prTransformationCount > 5) {
            clearInterval(window.sprite_animation);
            if (elapsed < 950) {
                let newInterval = elapsed + 50;
                setTimeout(() => { window.sprite_animation = setInterval(applyTransformations, newInterval); }, newInterval);
                console.log("Increasing interval from " + window.prTransformationIvl + " to " + newInterval);
                window.prTransformationIvl = newInterval;
            } else {
                console.log("Stopping animation, taking too long.");
            }
        }
        // console.log(elapsed);
    }
    window.scaleCanvas = function (oc, scale, cb) {

        var imageObject = new Image();
        let w = oc.width; let h = oc.height;
        let url = oc.toDataURL();
        oc.style.width = w * scale + "px";
        oc.style.height = h * scale + "px";
        oc.width = w * scale * window.devicePixelRatio;
        oc.height = h * scale * window.devicePixelRatio;
        let context = oc.getContext("2d");
        context.imageSmoothingEnabled = false;
        imageObject.onload = function () {
            context.clearRect(0, 0, oc.width, oc.height);
            context.scale(scale * window.devicePixelRatio, scale * window.devicePixelRatio);
            context.drawImage(imageObject, 0, 0);
            if (cb) {
                cb(oc);
            }
        }
        imageObject.src = url;
    }


    function genWithAnimation(canvas, c) {
        c = c + 1;
        generateRandom(canvas, effects = false);
        setTimeout(function () {
            if (c < 14) {
                genWithAnimation(canvas, c)
            } else {
                generateRandom(canvas, true);
                if (USE_EFFECT_ANIMATION && roll(ANIMATION_CHANCE)) {
                    setTransformations();
                    window.sprite_animation = setInterval(applyTransformations, window.prTransformationIvl);
                }
            }
        }, 12);
    }

    if (!window.prCanvas) {
        window.prCanvas = function () {
            return document.getElementById("px_canvas");
        }
    }
    window.scaleUp = function () {
        scaleCanvas(prCanvas(), 2);
    }
    window.scaleDown = function () {
        scaleCanvas(prCanvas(), 0.5);
    }

    if (window.sprite_animation) {
        clearInterval(window.sprite_animation);
    }

    function createUI() {


        let c = document.getElementById("procgen_canvas");
        c.style.textAlign = "center";
        c.style.zoom = ZOOM;
        let print_btn = window.pycmd ? "<a style='font-size: 17px; cursor: pointer;' onclick='saveProcgenCanvas()' title='Save to Image'><b>&#9113;</b></a>" : "";
        c.innerHTML = `
            <div style='position:relative; display: inline-block; padding: 0 35px 0 35px;'> 
                <div style='position: absolute; right: 0; font-family: monospace; user-select: none; opacity: 0.8; line-height: 1em;'> 
                    <a style='font-size: 17px; cursor: pointer; display: inline-block; margin-bottom: 5px;' onclick='scaleUp()' title='Zoom in'><b>+</b></a><br>
                    <a style='font-size: 17px; cursor: pointer; display: inline-block; margin-bottom: 5px;' onclick='scaleDown()' title='Zoom out'><b>-</b></a><br>
                    ${print_btn}
                </div>
                <canvas class='px_canvas' id='px_canvas'></canvas>
            </div>
        `;
        let cvs = prCanvas();
        cvs.getContext("2d").imageSmoothingEnabled = false;
        cvs.style.imageRendering = 'pixelated';

    }

    if (!window.saveProcgenCanvas) {
        window.saveProcgenCanvas = function () {
            pycmd("procgen-save " + prCanvas().toDataURL("image/png"));
        }
    }

    createUI();

    let canvases = document.getElementsByClassName("px_canvas");
    for (var i = 0; i < canvases.length; i++) {
        let c = canvases[i];
        if ((typeof(window._procgen_dev) === "undefined" || !window._procgen_dev) && USE_RENDER_ANIMATION) {
            genWithAnimation(c, 0);
        } else {
            generateRandom(c, true);
            if (USE_EFFECT_ANIMATION && roll(ANIMATION_CHANCE)) {
                setTransformations();
                window.sprite_animation = setInterval(applyTransformations, window.prTransformationIvl);
            }
        }
    }

})();