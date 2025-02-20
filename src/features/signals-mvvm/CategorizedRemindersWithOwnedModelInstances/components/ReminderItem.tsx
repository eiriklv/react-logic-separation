import { Reminder } from "../types";

type Props = {
  reminder: Reminder;
};

export function ReminderItem({ reminder }: Props) {
  return <li>{reminder.text}</li>;
}
