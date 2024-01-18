import { afterEach, describe, expect, test } from 'vitest';
import LocalMelodiesStorage from '../../../../data/storage/impl/local_melodies_storage';
import Melody from '../../../../data/melody';
import {SynthType} from "../../../../tools/synth_types";
import {ChorusEffect, TremoloEffect} from "../../../../tools/effect";

// This test suite requires to have access to a jsdom test environment, in order to use
// localStorage APIs

describe("Local melodies storage tests", () => {
    afterEach(() => {
        // Clear local storage after any test so tests are stateless
        localStorage.clear();
    });

    test("Get melodies count should return 0 by default", () => {
        const melodiesStorage = new LocalMelodiesStorage();

        expect(melodiesStorage.getMelodiesCount()).toEqual(0);
    });

    test("Add a melody should save a melody", () => {
        const melodiesStorage = new LocalMelodiesStorage();

        expect(melodiesStorage.addMelody(
            new Melody(
                "azerty",
                "Melody",
                "tada",
                1699542480024,
                new Map().set(SynthType.SYNTH, [{
                    frequency: 1234,
                    depth: 12
                } as TremoloEffect]))))
            .toEqual(true);

        expect(melodiesStorage.getMelodiesCount()).toEqual(1);
    });

    test("Get melodies list should return melodies saved", () => {
        const melodiesStorage = new LocalMelodiesStorage();

        melodiesStorage.addMelody(
            new Melody(
                "azerty",
                "Melody",
                "tada",
                1699542480024,
                new Map().set(SynthType.SYNTH, [{
                    frequency: 1234,
                    depth: 12
                } as TremoloEffect])));
        expect(melodiesStorage.getMelodiesCount()).toEqual(1);

        const melodiesList = melodiesStorage.getMelodiesList();

        expect(melodiesList).not.toBeNull();
        expect(melodiesList![0]).toEqual(
            new Melody(
                "azerty",
                "Melody",
                "tada",
                1699542480024,
                new Map().set(SynthType.SYNTH, [{
                    frequency: 1234,
                    depth: 12
                } as TremoloEffect])));
    });

    test("Move a melody within a melody list of one melody shouldn't change anything", () => {
        const melodiesStorage = new LocalMelodiesStorage();
        const melody = new Melody(
            "azerty",
            "Melody 1",
            "tada",
            1699542480024,
            new Map().set(SynthType.SYNTH, [{
                frequency: 1234,
                depth: 12
            } as TremoloEffect]));

        expect(melodiesStorage.addMelody(melody)).toEqual(true);
        expect(melodiesStorage.moveMelody(0, 1)).toEqual(false);
        expect(melodiesStorage.getMelodiesList()![0]).toEqual(melody);
    });

    test("Move a melody within a melody list of two melodies should move the melody", () => {
        const melodiesStorage = new LocalMelodiesStorage();
        const melodyOne = new Melody(
            "azerty",
            "Melody 1",
            "tada",
            1699542480024,
            new Map().set(SynthType.SYNTH, [{
                frequency: 1234,
                depth: 12
            } as TremoloEffect]));
        const melodyTwo = new Melody(
            "iop",
            "Melody 2",
            "tada",
            1699542480567,
            new Map().set(SynthType.PLUCK, [{
                frequency: 1234,
                delayTime: 34,
                depth: 12
            } as ChorusEffect]));

        expect(melodiesStorage.addMelody(melodyOne)).toEqual(true);
        expect(melodiesStorage.addMelody(melodyTwo)).toEqual(true);
        expect(melodiesStorage.moveMelody(0, 1)).toEqual(true);

        const melodiesList = melodiesStorage.getMelodiesList()!;

        expect(melodiesList[0]).toEqual(melodyTwo);
        expect(melodiesList[1]).toEqual(melodyOne);
    });

    test("Move a melody with one or two invalid indexes shouldn't change anything", () => {
        const melodiesStorage = new LocalMelodiesStorage();
        const melodyOne = new Melody(
            "azerty",
            "Melody 1",
            "tada",
            1699542480024,
            new Map().set(SynthType.SYNTH, [{
                frequency: 1234,
                depth: 12
            } as TremoloEffect]));
        const melodyTwo = new Melody(
            "iop",
            "Melody 2",
            "tada",
            1699542480567,
            new Map().set(SynthType.PLUCK, [{
                frequency: 1234,
                delayTime: 34,
                depth: 12
            } as ChorusEffect]));

        expect(melodiesStorage.addMelody(melodyOne)).toEqual(true);
        expect(melodiesStorage.addMelody(melodyTwo)).toEqual(true);
        expect(melodiesStorage.moveMelody(0, -1)).toEqual(false);
        expect(melodiesStorage.moveMelody(-1, -2)).toEqual(false);

        const melodiesList = melodiesStorage.getMelodiesList()!;

        expect(melodiesList[0]).toEqual(melodyOne);
        expect(melodiesList[1]).toEqual(melodyTwo);
    });

    test("Move a melody to the same index should work and not change anything", () => {
        const melodiesStorage = new LocalMelodiesStorage();
        const melodyOne = new Melody(
            "azerty",
            "Melody 1",
            "tada",
            1699542480024,
            new Map().set(SynthType.SYNTH, [{
                frequency: 1234,
                depth: 12
            } as TremoloEffect]));

        expect(melodiesStorage.addMelody(melodyOne)).toEqual(true);
        expect(melodiesStorage.moveMelody(0, 0)).toEqual(true);

        const melodiesList = melodiesStorage.getMelodiesList()!;

        expect(melodiesList[0]).toEqual(melodyOne);
    });

    test("Delete a melody with a valid index should delete the melody", () => {
        const melodiesStorage = new LocalMelodiesStorage();
        const melodyOne = new Melody(
            "azerty",
            "Melody 1",
            "tada",
            1699542480024,
            new Map().set(SynthType.SYNTH, [{
                frequency: 1234,
                depth: 12
            } as TremoloEffect]));

        expect(melodiesStorage.addMelody(melodyOne)).toEqual(true);
        expect(melodiesStorage.deleteMelody(0)).toEqual(true);
        expect(melodiesStorage.getMelodiesCount()).toEqual(0);
    });

    test("Delete a melody with an invalid index shouldn't do anything", () => {
        const melodiesStorage = new LocalMelodiesStorage();
        const melodyOne = new Melody(
            "azerty",
            "Melody 1",
            "tada",
            1699542480024,
            new Map().set(SynthType.SYNTH, [{
                frequency: 1234,
                depth: 12
            } as TremoloEffect]));

        expect(melodiesStorage.addMelody(melodyOne)).toEqual(true);
        expect(melodiesStorage.deleteMelody(1)).toEqual(false);
        expect(melodiesStorage.getMelodiesCount()).toEqual(1);
    });

    test("Get melodies with a melody having an invalid id saved should ignore melody", () => {
        // Put invalid data in LocalStorage
        const melody :any = {};
        melody[LocalMelodiesStorage.MELODY_ID_KEY_NAME] = "";
        melody[LocalMelodiesStorage.MELODY_NAME_KEY_NAME] = "Melody";
        melody[LocalMelodiesStorage.MELODY_TEXT_KEY_NAME] = "tada";
        melody[LocalMelodiesStorage.MELODY_TEXT_KEY_LAST_MODIFIED_TIMESTAMP] = 1699542480024;
        melody[LocalMelodiesStorage.MELODY_EFFECTS_KEY_NAME] = {"0": [{"frequency": 1234, "depth": 12}]};

        localStorage.setItem("melodies_list", JSON.stringify([melody]));

        const melodiesStorage = new LocalMelodiesStorage();
        expect(melodiesStorage.getMelodiesCount()).toEqual(0);
    });

    test("Get melodies with a melody having an invalid name saved should use default melody name", () => {
        // Put invalid data in LocalStorage
        const firstMelody :any = {};
        firstMelody[LocalMelodiesStorage.MELODY_ID_KEY_NAME] = "azerty";
        firstMelody[LocalMelodiesStorage.MELODY_NAME_KEY_NAME] = "";
        firstMelody[LocalMelodiesStorage.MELODY_TEXT_KEY_NAME] = "tada";
        firstMelody[LocalMelodiesStorage.MELODY_TEXT_KEY_LAST_MODIFIED_TIMESTAMP] = 1699542480024;
        firstMelody[LocalMelodiesStorage.MELODY_EFFECTS_KEY_NAME] = {"0": [{"frequency": 1234, "depth": 12}]};

        const secondMelody :any = {};
        secondMelody[LocalMelodiesStorage.MELODY_ID_KEY_NAME] = "azerty";
        secondMelody[LocalMelodiesStorage.MELODY_TEXT_KEY_NAME] = "tada";
        secondMelody[LocalMelodiesStorage.MELODY_TEXT_KEY_LAST_MODIFIED_TIMESTAMP] = 1699542480024;
        secondMelody[LocalMelodiesStorage.MELODY_EFFECTS_KEY_NAME] = {"0": [{"frequency": 1234, "depth": 12}]};

        localStorage.setItem("melodies_list", JSON.stringify([firstMelody, secondMelody]));

        const melodiesStorage = new LocalMelodiesStorage();
        expect(melodiesStorage.getMelodiesCount()).toEqual(2);

        const melodiesList = melodiesStorage.getMelodiesList()!;
        for (const melody of melodiesList) {
            expect(melody.getName()).toEqual(LocalMelodiesStorage.DEFAULT_MELODY_NAME);
        }
    });

    test("Get melodies with a melody having an invalid text saved should use default melody text", () => {
        // Put invalid data in LocalStorage
        const melody :any = {};
        melody[LocalMelodiesStorage.MELODY_ID_KEY_NAME] = "azerty";
        melody[LocalMelodiesStorage.MELODY_NAME_KEY_NAME] = "melody";
        melody[LocalMelodiesStorage.MELODY_TEXT_KEY_LAST_MODIFIED_TIMESTAMP] = 1699542480024;
        melody[LocalMelodiesStorage.MELODY_EFFECTS_KEY_NAME] = {"0": [{"frequency": 1234, "depth": 12}]};

        localStorage.setItem("melodies_list", JSON.stringify([melody]));

        const melodiesStorage = new LocalMelodiesStorage();
        expect(melodiesStorage.getMelodiesCount()).toEqual(1);
        expect(melodiesStorage.getMelodiesList()![0].getMelodyText()).toEqual(LocalMelodiesStorage.DEFAULT_MELODY_TEXT);
    });

    test("Get melodies with a melody having an invalid last modified timestamp saved should use current date's timestamp", () => {
        // Put invalid data in LocalStorage
        const firstMelody :any = {};
        firstMelody[LocalMelodiesStorage.MELODY_ID_KEY_NAME] = "azerty";
        firstMelody[LocalMelodiesStorage.MELODY_NAME_KEY_NAME] = "melody";
        firstMelody[LocalMelodiesStorage.MELODY_TEXT_KEY_LAST_MODIFIED_TIMESTAMP] = -1;
        firstMelody[LocalMelodiesStorage.MELODY_EFFECTS_KEY_NAME] = {"0": [{"frequency": 1234, "depth": 12}]};

        const secondMelody :any = {};
        secondMelody[LocalMelodiesStorage.MELODY_ID_KEY_NAME] = "uiop";
        secondMelody[LocalMelodiesStorage.MELODY_TEXT_KEY_NAME] = "melody";
        secondMelody[LocalMelodiesStorage.MELODY_EFFECTS_KEY_NAME] = {"0": [{"frequency": 1234, "depth": 12}]};

        localStorage.setItem("melodies_list", JSON.stringify([firstMelody, secondMelody]));

        const melodiesStorage = new LocalMelodiesStorage();
        expect(melodiesStorage.getMelodiesCount()).toEqual(2);

        const melodiesList = melodiesStorage.getMelodiesList()!;

        for (const melody of melodiesList) {
            expect(melody.getLastModifiedTimestamp()).toBeGreaterThanOrEqual(0);
        }
    });

    test("Get melodies with a melody having no melody effects saved should use no effects", () => {
        const melody :any = {};
        melody[LocalMelodiesStorage.MELODY_ID_KEY_NAME] = "azerty";
        melody[LocalMelodiesStorage.MELODY_NAME_KEY_NAME] = "melody";
        melody[LocalMelodiesStorage.MELODY_TEXT_KEY_LAST_MODIFIED_TIMESTAMP] = -1;
        melody[LocalMelodiesStorage.MELODY_EFFECTS_KEY_NAME] = {"0": []};

        const melodiesStorage = new LocalMelodiesStorage();
        expect(melodiesStorage.getMelodiesCount()).toEqual(1);
        expect(melodiesStorage.getMelodiesList()![0].getEffects()).toHaveLength(0);
    });

    test("Get melodies with a melody having invalid melody effects saved should use no effects", () => {
        const melody :any = {};
        melody[LocalMelodiesStorage.MELODY_ID_KEY_NAME] = "azerty";
        melody[LocalMelodiesStorage.MELODY_NAME_KEY_NAME] = "melody";
        melody[LocalMelodiesStorage.MELODY_TEXT_KEY_LAST_MODIFIED_TIMESTAMP] = -1;

        localStorage.setItem("melodies_list", JSON.stringify([melody]));

        const melodiesStorage = new LocalMelodiesStorage();
        expect(melodiesStorage.getMelodiesCount()).toEqual(1);
        expect(melodiesStorage.getMelodiesList()![0].getEffects()).toHaveLength(0);
    });
});
