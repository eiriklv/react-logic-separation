import { generateId, sleep } from "../../../../lib/utils";
import { Reminder } from "../types";

const reminders: Reminder[] = [
  { id: "1", text: "Write self reflection", category: "work" },
  { id: "2", text: "Fix that bug", category: "work" },
  { id: "3", text: "But milk", category: "home" },
  { id: "4", text: "Wash car", category: "home" },
  { id: "5", text: "Buy mother's day present", category: "family" },
  { id: "6", text: "Buy birthday gift", category: "family" },
];

export async function fetchReminders() {
  await sleep(1000);
  return reminders.slice();
}

export async function addReminder(text: string, category: string) {
  await sleep(1000);
  reminders.splice(0, reminders.length, ...reminders, {
    id: generateId(),
    text,
    category,
  });
}
