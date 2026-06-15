import { describe, it, expect } from "vitest";
import {
  parseMessages,
  getFranjaHoraria,
  getWordCloud,
  getEmojisMasUsados,
  getDiasSemana,
  getMensajesPorUsuario,
  getUsuarioQueMasEnvio,
  getUsuarioQueMenosEnvio,
} from "./whatsappParser";
import type { ParsedMessage } from "./whatsappParser";

describe("whatsappParser", () => {
  describe("parseMessages", () => {
    it("should parse a message with single-digit day and month correctly", () => {
      const text = "1/5/2023, 08:00 - User1: Hello";
      const messages = parseMessages(text);
      expect(messages).toHaveLength(1);
      expect(messages[0].usuario).toBe("User1");
      expect(messages[0].mensaje).toBe("Hello");
      expect(messages[0].hora).toBe(8);
    });

    it("should parse a message with double-digit day and month correctly", () => {
      const text = "15/12/2023, 22:30 - User2: Good night";
      const messages = parseMessages(text);
      expect(messages).toHaveLength(1);
      expect(messages[0].usuario).toBe("User2");
      expect(messages[0].mensaje).toBe("Good night");
      expect(messages[0].hora).toBe(22);
    });

    it("should extract user, time, and message correctly", () => {
      const text = "10/10/2023, 13:45 - Alice: What's up?";
      const messages = parseMessages(text);
      expect(messages[0].usuario).toBe("Alice");
      expect(messages[0].hora).toBe(13);
      expect(messages[0].mensaje).toBe("What's up?");
    });

    it("should concatenate continuation lines to the previous message", () => {
      const text = `10/10/2023, 14:00 - Bob: This is a message
that spans
multiple lines.`;
      const messages = parseMessages(text);
      expect(messages).toHaveLength(1);
      expect(messages[0].mensaje).toBe(
        "This is a message\nthat spans\nmultiple lines.",
      );
    });

    it("should ignore system messages", () => {
      const text = `10/10/2023, 15:00 - Messages to this chat are now secured.
10/10/2023, 15:01 - Charlie: My message`;
      const messages = parseMessages(text);
      expect(messages).toHaveLength(1);
      expect(messages[0].usuario).toBe("Charlie");
    });

    it("should return an empty array for empty text", () => {
      const text = "";
      const messages = parseMessages(text);
      expect(messages).toEqual([]);
    });

    it("should ignore BOM at the start of the text", () => {
      const text = "\uFEFF1/1/2023, 00:00 - User: Test";
      const messages = parseMessages(text);
      expect(messages).toHaveLength(1);
      expect(messages[0].usuario).toBe("User");
    });
  });

  describe("getFranjaHoraria", () => {
    it("should return an array of 24 positions", () => {
      const messages: ParsedMessage[] = [];
      const franja = getFranjaHoraria(messages);
      expect(franja).toHaveLength(24);
    });

    it("should return all zeros for no messages", () => {
      const messages: ParsedMessage[] = [];
      const franja = getFranjaHoraria(messages);
      expect(franja.every((count) => count === 0)).toBe(true);
    });

    it("should correctly increment the count for each message hour", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date("2023-01-01"),
          hora: 8,
          diaSemana: 0,
          usuario: "User",
          mensaje: "Hi",
        },
        {
          date: new Date("2023-01-01"),
          hora: 15,
          diaSemana: 0,
          usuario: "User",
          mensaje: "Hello",
        },
      ];
      const franja = getFranjaHoraria(messages);
      expect(franja[8]).toBe(1);
      expect(franja[15]).toBe(1);
    });

    it("should correctly count multiple messages in the same hour", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date("2023-01-01"),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "Msg1",
        },
        {
          date: new Date("2023-01-01"),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "Msg2",
        },
        {
          date: new Date("2023-01-01"),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "Msg3",
        },
      ];
      const franja = getFranjaHoraria(messages);
      expect(franja[10]).toBe(3);
    });
  });

  describe("getWordCloud", () => {
    it("should return an empty array if there are no messages", () => {
      const messages: ParsedMessage[] = [];
      const wordCloud = getWordCloud(messages);
      expect(wordCloud).toEqual([]);
    });

    it("should return a maximum of 50 words", () => {
      const messages: ParsedMessage[] = Array.from({ length: 60 }, (_, i) => ({
        date: new Date(),
        hora: 10,
        diaSemana: 0,
        usuario: "User",
        mensaje: `word${i} word${i} word${i}`,
      }));
      const wordCloud = getWordCloud(messages);
      expect(wordCloud.length).toBeLessThanOrEqual(50);
    });

    it("should exclude words with less than 3 characters", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "a be see the five",
        },
      ];
      const wordCloud = getWordCloud(messages);
      const words = wordCloud.map((item) => item.text);
      expect(words).not.toContain("a");
      expect(words).not.toContain("be");
      expect(words).toContain("see");
      expect(words).toContain("the");
      expect(words).toContain("five");
    });

    it("should exclude tokens that are only numbers", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "word 123 another 4567",
        },
      ];
      const wordCloud = getWordCloud(messages);
      const words = wordCloud.map((item) => item.text);
      expect(words).not.toContain("123");
      expect(words).not.toContain("4567");
      expect(words).toContain("word");
      expect(words).toContain("another");
    });

    it("should count word frequency correctly", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "test test word",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "test another word",
        },
      ];
      const wordCloud = getWordCloud(messages);
      expect(wordCloud).toContainEqual({ text: "test", count: 3 });
      expect(wordCloud).toContainEqual({ text: "word", count: 2 });
      expect(wordCloud).toContainEqual({ text: "another", count: 1 });
    });

    it("should be sorted by count in descending order", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "one two two three three three",
        },
      ];
      const wordCloud = getWordCloud(messages);
      expect(wordCloud.map((item) => item.text)).toEqual([
        "three",
        "two",
        "one",
      ]);
      expect(wordCloud.map((item) => item.count)).toEqual([3, 2, 1]);
    });
  });

  describe("getEmojisMasUsados", () => {
    it("should return an empty array if no messages contain emojis", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "Hello world",
        },
      ];
      const emojis = getEmojisMasUsados(messages);
      expect(emojis).toEqual([]);
    });

    it("should return a maximum of 10 emojis", () => {
      const manyEmojis = "😂😊😍🥰😘😉🤣😅😁😄😃😀🙂🤩🤔🤨😐😑😶";
      const messages: ParsedMessage[] = Array.from(manyEmojis).map((emoji) => ({
        date: new Date(),
        hora: 10,
        diaSemana: 0,
        usuario: "User",
        mensaje: `This is an emoji ${emoji}`,
      }));
      const emojis = getEmojisMasUsados(messages);
      expect(emojis.length).toBeLessThanOrEqual(10);
    });

    it("should count emoji frequency correctly", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "I am happy 😊",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "This is funny 😂",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "So happy 😊😊",
        },
      ];
      const emojis = getEmojisMasUsados(messages);
      expect(emojis).toContainEqual({ emoji: "😊", count: 3 });
      expect(emojis).toContainEqual({ emoji: "😂", count: 1 });
    });

    it("should be sorted by count in descending order", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "💀",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "👍👍",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "😂😂😂",
        },
      ];
      const emojis = getEmojisMasUsados(messages);
      expect(emojis.map((item) => item.emoji)).toEqual(["😂", "👍", "💀"]);
      expect(emojis.map((item) => item.count)).toEqual([3, 2, 1]);
    });

    it("should detect multiple distinct emojis in the same message", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "What a day! 🌙🎉",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "Party time 🎉",
        },
      ];
      const emojis = getEmojisMasUsados(messages);
      expect(emojis).toContainEqual({ emoji: "🎉", count: 2 });
      expect(emojis).toContainEqual({ emoji: "🌙", count: 1 });
    });
  });
  describe("getDiasSemana", () => {
    it("should return an array of 7 positions", () => {
      const messages: ParsedMessage[] = [];
      const dias = getDiasSemana(messages);
      expect(dias).toHaveLength(7);
    });

    it("should return all zeros for no messages", () => {
      const messages: ParsedMessage[] = [];
      const dias = getDiasSemana(messages);
      expect(dias.every((count) => count === 0)).toBe(true);
    });

    it("should correctly increment the count for each message day", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "User",
          mensaje: "Lunes",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 4,
          usuario: "User",
          mensaje: "Viernes",
        },
      ];
      const dias = getDiasSemana(messages);
      expect(dias[0]).toBe(1);
      expect(dias[4]).toBe(1);
    });

    it("should correctly count multiple messages on the same day", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 2,
          usuario: "User",
          mensaje: "Msg1",
        },
        {
          date: new Date(),
          hora: 11,
          diaSemana: 2,
          usuario: "User",
          mensaje: "Msg2",
        },
        {
          date: new Date(),
          hora: 12,
          diaSemana: 2,
          usuario: "User",
          mensaje: "Msg3",
        },
      ];
      const dias = getDiasSemana(messages);
      expect(dias[2]).toBe(3);
    });
  });

  describe("getMensajesPorUsuario", () => {
    it("should return an empty array if there are no messages", () => {
      const messages: ParsedMessage[] = [];
      expect(getMensajesPorUsuario(messages)).toEqual([]);
    });

    it("should count messages per user correctly", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Ana",
          mensaje: "Hola",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Ana",
          mensaje: "Como estas",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Juan",
          mensaje: "Bien",
        },
      ];
      const result = getMensajesPorUsuario(messages);
      expect(result).toContainEqual({ usuario: "Ana", cantidad: 2 });
      expect(result).toContainEqual({ usuario: "Juan", cantidad: 1 });
    });

    it("should be sorted by count in descending order", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Ana",
          mensaje: "Msg1",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Juan",
          mensaje: "Msg2",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Juan",
          mensaje: "Msg3",
        },
      ];
      const result = getMensajesPorUsuario(messages);
      expect(result[0].usuario).toBe("Juan");
      expect(result[1].usuario).toBe("Ana");
    });
  });

  describe("getUsuarioQueMasEnvio", () => {
    it("should return null if there are no messages", () => {
      expect(getUsuarioQueMasEnvio([])).toBeNull();
    });

    it("should return the user with the most messages", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Ana",
          mensaje: "Msg1",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Ana",
          mensaje: "Msg2",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Juan",
          mensaje: "Msg3",
        },
      ];
      const result = getUsuarioQueMasEnvio(messages);
      expect(result).toEqual({ usuario: "Ana", cantidad: 2 });
    });
  });

  describe("getUsuarioQueMenosEnvio", () => {
    it("should return null if there are no messages", () => {
      expect(getUsuarioQueMenosEnvio([])).toBeNull();
    });

    it("should return the user with the least messages", () => {
      const messages: ParsedMessage[] = [
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Ana",
          mensaje: "Msg1",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Ana",
          mensaje: "Msg2",
        },
        {
          date: new Date(),
          hora: 10,
          diaSemana: 0,
          usuario: "Juan",
          mensaje: "Msg3",
        },
      ];
      const result = getUsuarioQueMenosEnvio(messages);
      expect(result).toEqual({ usuario: "Juan", cantidad: 1 });
    });
  });
});
