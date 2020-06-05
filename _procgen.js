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
//
// 0: empty
// 1: body
// 2: border

(function () {

    const SCALE = 10;
    const USE_ANIMATION = true;

    const template_1 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 1, 1, 1],
        [0, 0, 0, 1, 1, 1, 0, 1, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 1, 1, 1],
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
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 6, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const template_8 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

    class PMapTemplate {
        constructor(template, pipeline) {
            this.template = template;
            this.pipeline = pipeline;
        }

        generateMap() {
            let pipeline = this.pipeline;
            let halfmap = copyMap(this.template);
            if (!pipeline || pipeline === null) {
                pipeline = getDefaultPipeline();
            }
            //basic map
            let mapGenerated = this.generateFillings(halfmap);

            //mirroring
            if (pipeline.indexOf("mirrorquarter") !== -1) {
                mapGenerated = mirrorQuarter(mapGenerated);
            }
            if (pipeline.indexOf("mirrorvertically") !== -1 || (pipeline.indexOf("[mirrorvertically]") !== -1 && _randInt(0, 2) === 0)) {
                mapGenerated = mirrorVertically(mapGenerated);
            }
            //borders
            if (pipeline.indexOf("fillborders") !== -1) {
                mapGenerated = this.fillBorders(mapGenerated);
            }
            return new PMap(copyMap(this.template), this.pipeline, mapGenerated);
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
                    if (map[row][col] === 6) {
                        rwalks.push([row, col]);
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
                while (n.length && c < 8) {
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
        constructor(template, pipeline, map012) {
            this.template               = template;
            this.pipeline               = pipeline;
            this.map012                 = map012;
            this.map012Scaled           = this.scaledMap(map012, SCALE);
            this.bodyColorRGBArray      = _getRandomColors(1)[0];

            this.brighten               = pipeline.indexOf("brighten") !== -1 || (pipeline.indexOf("[brighten]") !== -1 && roll(2));
            this.transparentBody        = pipeline.indexOf("transparentbody") !== -1 || (pipeline.indexOf("[transparentbody]") !== -1 && roll(2));
            this.coloredBorder          = pipeline.indexOf("coloredborder") !== -1 || (pipeline.indexOf("[coloredborder]") !== -1 && roll(2));

            this.borderColorRGBArray    = this.coloredBorder ? _getRandomColors(1)[0] : [0, 0, 0, 255];
            this.mapRBGValues           = [];

            this.initialRGBValues();
        }

        initialRGBValues() {
            let bodycolor   = this.transparentBody ? [0, 0, 0, 0] : this.borderColorRGBArray;
            let bordercolor = this.borderColorRGBArray;

            for (var row = 0; row < this.map012.length; row++) {
                this.mapRBGValues.push([]);
                for (var col = 0; col < this.map012[row].length; col++) {
                    switch (this.map012[row][col]) {
                        case 0: this.mapRBGValues[row][col] = [0, 0, 0, 0]; break;
                        case 1:
                            if (this.brighten && !this.transparentBody) {
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
            let r   = color[0];
            let g   = color[1];
            let b   = color[2];
            r       = Math.floor(Math.min(255, r + (255 - r) * 0.15));
            g       = Math.floor(Math.min(255, g + (255 - g) * 0.15));
            b       = Math.floor(Math.min(255, b + (255 - b) * 0.15));
            if (n === 0) {
                return [r, g, b, 255];
            } else {
                return this.brightenColor([r, g, b], n - 1);
            }
        }
        printToCanvas(canvasId, effects) {
            const scale_sqrt        = Math.round(Math.sqrt(SCALE));
            let map                 = this.scaledMap(this.mapRBGValues, scale_sqrt);
            const baseEffectDice    = 13;

            if (effects) {
                let actions = [];
                if (roll(baseEffectDice)) {
                    actions.push(this.distort_1.bind(this));
                }
                if (roll(baseEffectDice)) {
                    actions.push(this.distort_2.bind(this));
                }
                if (roll(baseEffectDice)) {
                    actions.push(this.distort_4.bind(this));
                }
                if (roll(baseEffectDice)) {
                    actions.push(this.averageColors.bind(this));
                }
                if (roll(baseEffectDice)) {
                    actions.push(this.gradient.bind(this));
                }
                if (roll(baseEffectDice)) {
                    actions.push(this.invertColors.bind(this));
                }
                if (roll(baseEffectDice)) {
                    actions.push(this.canvasTexture.bind(this));
                }
                if (roll(6)) {
                    actions.push(this.smoothenEdges.bind(this));
                }
                if (roll(6)) {
                    actions.push(this.edgeInterpolate.bind(this));
                }
                if (roll(6)) {
                    actions.push(this.replaceBlack.bind(this));
                }
                if (roll(baseEffectDice)) {
                    actions.push(this.pattern_1.bind(this));
                }
                if (roll(baseEffectDice)) {
                    actions.push(this.pattern_2.bind(this));
                }
                while (actions.length) {
                    let ix = _randInt(0, actions.length);
                    map = actions[ix](map);
                    actions.splice(ix, 1);
                }
            }


            map                 = this.scaledMap(map, scale_sqrt);

            const canvas        = document.getElementById(canvasId);
            canvas.width        = map[0].length;
            canvas.height       = map.length;
            canvas.style.width  = map[0].length;
            canvas.style.height = map.length;

            const ctx           = canvas.getContext('2d');
            const imgData       = ctx.createImageData(canvas.width, canvas.height);
            const data          = imgData.data;

            for (var row = 0; row < map.length; row++) {
                for (var col = 0; col < map[row].length; col++) {
                    data[(row * map[0].length + col) * 4] = map[row][col][0];
                    data[(row * map[0].length + col) * 4 + 1] = map[row][col][1];
                    data[(row * map[0].length + col) * 4 + 2] = map[row][col][2];
                    data[(row * map[0].length + col) * 4 + 3] = map[row][col][3];
                }
            }
            ctx.putImageData(imgData, 0, 0);
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
            let updated     = copyRGBMap(map);
            const rounds    = 3;

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
            let updated     = copyRGBMap(map);
            const rounds    = _randInt(1, 15);
            const r4        = _randInt(0, 4);
            const r3        = _randInt(0, 3);
            const r2        = _randInt(0, 2);
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
            let updated     = copyRGBMap(map);
            const rounds    = 4;

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
            let updated     = copyRGBMap(map);
            const rounds    = _randInt(5, 45);
            const r1        = _randInt(2, 4);

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
            let updated     = copyRGBMap(map);
            const rounds    = _randInt(1, 10);

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
            let updated     = copyRGBMap(map);
            const rounds    = _randInt(1, 2);

            for (var round = 0; round < rounds; round++) {
                let m = copyRGBMap(updated);
                for (var row = 0; row < m.length; row++) {
                    for (var col = 0; col < m[row].length; col++) {
                        if (this.isEmpty(m[row][col])) {
                            continue;
                        }
                        if (this.hasDifferentColorAround(m, row, col)) {
                            updated[row][col] = [0, 0, 0, 0];
                        }
                    }
                }
            }
            return updated;
        }
        movePixels(map) {
            let updated     = copyRGBMap(map);
            const rounds    = _randInt(1, 25);

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
            let last    = null;
            let m       = copyRGBMap(updated);
            let r       = _randInt(2, 5);

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
            let c       = null;
            let m       = copyRGBMap(updated);

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
            let c       = null;
            let m       = copyRGBMap(updated);
            let rc_0    = [_randInt(150, 200),_randInt(150, 200), _randInt(150, 200), 255];
            let rc_1    = [_randInt(150, 200),_randInt(150, 200), _randInt(150, 200), 255];

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
            let c       = null;
            let m       = copyRGBMap(updated);
            let rp      = _randInt(0, map.length);
            let cp      = _randInt(0, map[0].length);
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
            let c       = null;
            let m       = copyRGBMap(updated);

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        c = m[row][col];
                        for (var i = 0; i < _randInt(1,15); i++)
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
            let c       = null;
            let m       = copyRGBMap(updated);
            let rc      = _getRandomColors(1)[0];

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        c = m[row][col];
                        if ((row === m.length -1 || colorsAreEqual(c, m[row + 1][col])) && (row === 0 || colorsAreEqual(c, m[row - 1][col])) && (col === 0 || colorsAreEqual(c, m[row][col - 1])) && (col === m[0].length -1 || colorsAreEqual(c, m[row][col + 1]))) {
                            updated[row][col] = rc;
                        }
                    }
                }
            }
            return updated;
        }
        pattern_2(map) {
            let c       = null;
            let m       = copyRGBMap(map);
            let rc      = _getRandomColors(1)[0];

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        c = m[row][col];
                        if ((row === m.length -1 || colorsAreEqual(c, m[row + 1][col])) && (row === 0 || colorsAreEqual(c, m[row - 1][col])) && (col === 0 || colorsAreEqual(c, m[row][col - 1])) && (col === m[0].length -1 || colorsAreEqual(c, m[row][col + 1]))) {
                            m[row][col] = rc;
                        }
                    }
                }
            }
            return m;
        }
        pattern_3(map) {
            let m       = copyRGBMap(map);
            let rc      = _getRandomColors(1)[0];

            for (var row = 0; row < m.length; row++) {
                for (var col = 0; col < m[row].length; col++) {
                    if (m[row][col][3] !== 0) {
                        // if (this.hasDifferentColorAround(map, row, col)) {
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
            let m       = copyRGBMap(updated);
            let rc      = _getRandomColors(1)[0];
            
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
            let m       = copyRGBMap(updated);

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
            let m       = copyRGBMap(updated);

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
            // return chosen[_randInt(0, chosen.length)].split(",").map(function (cs) { return Number(cs); });
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
    function getDefaultPipeline() {
        return ["fillborders", "mirrorvertically", "brighten"];
    }
    function overlayAll(maps) {
        let current = maps[0];
        for (var i = 1; i < maps.length - 1; i++) {
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

    function generateRandom(canvasId, effects = false) {
        let temps       = [];
        const rounds    = _randInt(3, 9);

        temps.push(new PMapTemplate(template_1, getDefaultPipeline()));
        temps.push(new PMapTemplate(template_2, getDefaultPipeline()));
        temps.push(new PMapTemplate(template_3, ["fillborders", "mirrorvertically", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_4, ["fillborders", "mirrorvertically", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_5, ["fillborders", "mirrorvertically", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_6, ["fillborders", "mirrorvertically", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_7, ["fillborders", "mirrorvertically", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_8, ["fillborders", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_9, ["fillborders", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_10, ["fillborders", "brighten", "[coloredborder]"]));
        temps.push(new PMapTemplate(template_11, ["fillborders", "brighten", "[coloredborder]"]));

        let maps = [];

        for (var i = 0; i < rounds; i++) {
            let chosen  = temps[_randInt(0, temps.length)];
            let map     = chosen.generateMap();
            maps.push(map);
        }

        let fused       = overlayAll(maps);
        fused.printToCanvas(canvasId, effects)
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
            return map[row- 1][col]; 
        }
        if (row + 1 < map.length && col + 1 < map[0].length && !colorsAreClose(map[row][col], map[row + 1][col], 20) && colorsAreClose(map[row][col + 1], map[row + 1][col], 20)) {
            return map[row + 1][col]; 
        }
        if (row + 1 < map.length && col - 1 >= 0 && !colorsAreClose(map[row][col], map[row + 1][col], 20)  && colorsAreClose(map[row + 1][col], map[row][col - 1], 20)) {
            return map[row + 1][col]; 
        }
        if (row - 1 >= 0 && col - 1 >= 0  && !colorsAreClose(map[row][col], map[row - 1][col], 20)  && colorsAreClose(map[row - 1][col], map[row][col - 1], 20)) {
            return map[row - 1][col]; 
        }
        return map[row][col];
    }

    function darkenRGBA(rgba, delta) {
        return [Math.min(Math.max(0, rgba[0] - delta), 255), Math.min(Math.max(0, rgba[1] - delta), 255), Math.min(Math.max(0, rgba[2] - delta), 255), 255];
    }
    function darkenRGBAAlt(rgba, delta) {
        if (rgba[0] + rgba[1] + rgba[2] < 10) {
            delta = Math.max(2, delta - (10 - (rgba[0] + rgba[1] + rgba[2])));
        }
        return [Math.min(Math.max(0, rgba[0] - delta), 255), Math.min(Math.max(0, rgba[1] - delta), 255), Math.min(Math.max(0, rgba[2] - delta), 255), 255];
    }
    function invertRGBA(rgba) {
        return [Math.max(0, 255 - rgba[0]), Math.max(0, 255 - rgba[1]), Math.max(255 - rgba[2]), 255];
    }

    function genWithAnimation(c) {
        c = c + 1;
        generateRandom('px_canvas', effects = false);
        setTimeout(function () {
            if (c < 14) {
                genWithAnimation(c)
            } else {
                generateRandom('px_canvas', true);
            }
        }, 12);
    }
    document.getElementById("procgen_canvas").style.textAlign = "center";
    document.getElementById("procgen_canvas").innerHTML = "<canvas id='px_canvas'></canvas>";
    if (USE_ANIMATION) {
        genWithAnimation(0);
    } else {
        generateRandom('px_canvas', true);
    }

})();