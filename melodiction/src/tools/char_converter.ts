/**
 * Converts an alphaber letter to a musical note.
 *
 * @remarks
 *
 * Only letters in the latin alphabet are currently supported, other characters return `null`.
 * 
 * If the string representing the letter is empty, `null` will be returned; if the string has more
 * than one character, only the first one is used.
 * 
 * @param letter - the letter to convert to a musical note
 * @returns a musical note or `null`
 */
export function convertLetterToNote(letter: string): string | null {
    // Return null if there is nothing in the letter string
    if (letter.length === 0) {
        return null;
    }

    switch (letter[0].toLowerCase()) {
        // TODO: notes are always using 4 as a note octave, find how to use octave notes properly
        case "a":
        case "m":
        case "y":
            return "C4";
        case "b":
        case "n":
        case "z":
            return "D4";
        case "c":
        case "o":
            return "E4";
        case "d":
        case "p":
            return "F4";
        case "e":
        case "q":
            return "G4";
        case "f":
        case "r":
            return "A4";
        case "g":
        case "s":
            return "B4";
        case "h":
        case "t":
            return "C#4";
        case "i":
        case "u":
            return "D#4";
        case "j":
        case "v":
            return "F#4";
        case "k":
        case "w":
            return "G#4";
        case "l":
        case "x":
            return "A#4";
        default:
            return null;
    }
}
