import { useState } from "react";
import { Rotate, Bolt, Heart, Present } from "./TravellerFlow.styles";
import { useHistory } from "react-router-dom";
const TRAVELLER_FLOW_DATA = [
  {
    title: "Welcome, Bridge Traveler.",
    Icon: Rotate,
    description:
      "Hello. We detect that you’ve traveled far from home. Welcome to Across.",
  },
  {
    title: "Our Offerings",
    Icon: Bolt,
    description:
      "Our realm offers lightning-fast transfers, astonishingly low fees and protection by the almighty OO.",
  },
  {
    title: "Reserve Your Gift",
    Icon: Present,
    description:
      "We’ve prepared a welcome gift for you! It awaits your arrival. Let us show you the way.",
  },
  {
    title: "Go Forth And Bridge",
    Icon: Heart,
    description:
      "This portal (button) will bring you to the bridge. You must complete a 0.1 ETH or 150 USDC transfer to receive your gift. Ready?",
  },
];
export default function useTravellerFlow() {
  const [step, setStep] = useState(1);
  const history = useHistory();
  return { step, setStep, view: TRAVELLER_FLOW_DATA[step - 1], history };
}