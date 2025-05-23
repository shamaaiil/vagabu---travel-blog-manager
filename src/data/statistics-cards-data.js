import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "teelclr", // Use the custom teelclr color (tailwind class name)
    icon: BanknotesIcon,
    title: "Today's Money",
    value: "$53k",
    footer: {
      color: "text-green-500", // This remains unchanged
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "teelclr", // Use the custom teelclr color (tailwind class name)
    icon: UsersIcon,
    title: "Today's Users",
    value: "2,300",
    footer: {
      color: "text-green-500", // This remains unchanged
      value: "+3%",
      label: "than last month",
    },
  },
  {
    color: "pinkClr", // Use the custom pink color (tailwind class name)
    icon: UserPlusIcon,
    title: "New Clients",
    value: "3,462",
    footer: {
      color: "text-red-500", // This remains unchanged
      value: "-2%",
      label: "than yesterday",
    },
  },
  {
    color: "teelclr", // Use the custom teelclr color (tailwind class name)
    icon: ChartBarIcon,
    title: "Sales",
    value: "$103,430",
    footer: {
      color: "text-green-500", // This remains unchanged
      value: "+5%",
      label: "than yesterday",
    },
  },
];

export default statisticsCardsData;
