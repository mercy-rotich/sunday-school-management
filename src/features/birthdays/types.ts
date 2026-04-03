export interface Birthday {
  id: string;
  name: string;
  date: string;
  age: number;
  daysUntil: number;
}

export interface BdayDeposit {
  id: string;
  childName: string;
  amount: number;
  time: string;
}

export interface BirthdayData {
  birthdays: Birthday[];
  deposits: BdayDeposit[];
}
