import { generateId, sleep } from "../../../../lib/utils";

const reminders: Reminder[] = [
  { id: "1", text: "Write self reflection" },
  { id: "2", text: "Fix that bug" },
];

export async function fetchReminders() {
  await sleep(1000);
  return reminders.slice();
}

export async function addReminder(text: string) {
  await sleep(1000);
  reminders.splice(0, reminders.length, ...reminders, {
    id: generateId(),
    text,
  });
}
