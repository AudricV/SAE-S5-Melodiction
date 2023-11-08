import { expect, test } from 'vitest';
import Melody, { InvalidTimestampError } from "../../data/melody";

test("A melody instance with correct values should not throw an error",
    () => expect(() => new Melody("azerty", "Melody", "tada", 0)).not
        .toThrowError(Error));

test("Invalid last modified timestamp in constructor should throw an InvalidTimestampError",
    () => expect(() =>
        new Melody("azerty", "Melody", "tada", -1)).toThrowError(InvalidTimestampError));

test("Getters should return data provided", () => {
    const melodyId = "azerty";
    const melodyName = "Melody";
    const melodyText = "tada";
    const melodyLastModifiedTimestamp = new Date().getTime();

    const melody = new Melody(melodyId, melodyName, melodyText, melodyLastModifiedTimestamp);

    expect(melody.getId()).toEqual(melodyId);
    expect(melody.getName()).toEqual(melodyName);
    expect(melody.getMelodyText()).toEqual(melodyText);
    expect(melody.getLastModifiedTimestamp()).toEqual(melodyLastModifiedTimestamp);
});

test("Setters should update data", () => {
    const melody = new Melody("azerty", "Melody", "tada", 0);

    const newMelodyName = "My new melody name";
    melody.setName(newMelodyName);
    expect(melody.getName()).toEqual(newMelodyName);

    const newMelodyText = "blablabla";
    melody.setMelodyText(newMelodyText);
    expect(melody.getMelodyText()).toEqual(newMelodyText);

    const newMelodyLastModifiedTimestamp = new Date().getTime();
    expect(melody.setLastModifiedTimestamp(newMelodyLastModifiedTimestamp))
        .not.toThrow(InvalidTimestampError);
    expect(melody.getLastModifiedTimestamp()).toEqual(newMelodyLastModifiedTimestamp);
});

test("Set an invalid timestamp show throw an Error",
    () => expect(() => new Melody("azerty", "Melody", "tada", 0).setLastModifiedTimestamp(-1))
        .toThrow(InvalidTimestampError));

test("Create an InvalidTimestampError should not throw an error",
    () => expect(() => new InvalidTimestampError(-7)).not
        .toThrowError());
